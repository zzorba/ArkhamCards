import React, { useCallback, useContext, useMemo } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useDispatch } from 'react-redux';
import { t } from 'ttag';

import LinkedScenarioListComponent from './LinkedScenarioListComponent';
import CampaignGuideSummary from './CampaignGuideSummary';
import { Campaign, CampaignId } from '@actions/types';
import CampaignInvestigatorsComponent from '@components/campaignguide/CampaignInvestigatorsComponent';
import CampaignLogComponent from '@components/campaignguide/CampaignLogComponent';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import useTabView from '@components/core/useTabView';
import { updateCampaign } from '@components/campaign/actions';
import { useCampaignGuideReduxData } from '@components/campaignguide/contextHelper';
import { NavigationProps } from '@components/nav/types';
import StyleContext from '@styles/StyleContext';
import { useCampaign, useFlag, useInvestigatorCards, useNavigationButtonPressed } from '@components/core/hooks';
import useCampaignGuideContext from './useCampaignGuideContext';
import { useStopAudioOnUnmount } from '@lib/audio/narrationPlayer';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import space from '@styles/space';
import CampaignGuideFab from './CampaignGuideFab';
import { useAlertDialog, useTextDialog } from '@components/deck/dialogs';
import useTraumaDialog from '@components/campaign/useTraumaDialog';

export interface LinkedCampaignGuideProps {
  campaignId: number;
  campaignIdA: number;
  campaignIdB: number;
}

type Props = LinkedCampaignGuideProps & NavigationProps;

export default function LinkedCampaignGuideView(props: Props) {
  const { componentId, campaignIdA, campaignIdB } = props;
  const investigators = useInvestigatorCards();
  const styleContext = useContext(StyleContext);
  const { backgroundStyle } = styleContext;
  const dispatch = useDispatch();
  useStopAudioOnUnmount();

  const { showTraumaDialog, traumaDialog } = useTraumaDialog({ hideKilledInsane: true });
  const campaign = useCampaign(props.campaignId);
  const campaignName = (campaign && campaign.name) || '';
  const campaignDataA = useCampaignGuideReduxData(campaignIdA, investigators);
  const campaignDataB = useCampaignGuideReduxData(campaignIdB, investigators);

  const serverId = campaign?.serverId;
  const campaignId = useMemo(() => {
    return {
      campaignId: props.campaignId,
      serverId,
    };
  }, [props.campaignId, serverId]);

  const updateCampaignName = useCallback((name: string) => {
    dispatch(updateCampaign(campaignId, { name, lastUpdated: new Date() }));
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: name,
        },
      },
    });
  }, [campaignId, dispatch, componentId]);


  const { dialog, showDialog: showEditNameDialog } = useTextDialog({
    title: t`Name`,
    value: campaignName,
    onValueChange: updateCampaignName,
  });

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'edit') {
      showEditNameDialog();
    }
  }, componentId, [showEditNameDialog]);

  const handleUpdateCampaign = useCallback((id: CampaignId, sparseCampaign: Partial<Campaign>, now?: Date) => {
    dispatch(updateCampaign(id, sparseCampaign, now));
  }, [dispatch]);
  const [removeMode, toggleRemoveMode] = useFlag(false);
  const contextA = useCampaignGuideContext(campaignIdA, campaignDataA);
  const contextB = useCampaignGuideContext(campaignIdB, campaignDataB);
  const processedCampaignA = useMemo(() => contextA?.campaignGuide && contextA?.campaignState && contextA.campaignGuide.processAllScenarios(contextA.campaignState), [contextA?.campaignGuide, contextA?.campaignState]);
  const processedCampaignB = useMemo(() => contextB?.campaignGuide && contextB?.campaignState && contextB.campaignGuide.processAllScenarios(contextB.campaignState), [contextB?.campaignGuide, contextB?.campaignState]);

  const addInvestigatorAPressed = useCallback(() => {
    contextA?.campaignState.showChooseDeck();
  }, [contextA?.campaignState]);
  const addInvestigatorBPressed = useCallback(() => {
    contextB?.campaignState.showChooseDeck();
  }, [contextB?.campaignState]);
  const [alertDialog, showAlert] = useAlertDialog();
  const showAddInvestigator = useCallback(() => {
    if (contextA && contextB) {
      Alert.alert(
        t`Add investigator to which campaign?`,
        t`Which campaign would you like to add an investigator to?`,
        [
          {
            text: contextA.campaignGuide.campaignName(),
            onPress: addInvestigatorAPressed,
          },
          {
            text: contextB.campaignGuide.campaignName(),
            onPress: addInvestigatorBPressed,
          },
          {
            text: t`Cancel`,
            style: 'cancel',
          },
        ],
      );
    }
  }, [contextA, contextB, addInvestigatorAPressed, addInvestigatorBPressed]);

  const investigatorTab = useMemo(() => {
    if (!campaignDataA || !campaignDataB || !processedCampaignA || !processedCampaignB || !contextA || !contextB) {
      return null;
    }
    return {
      key: 'investigators',
      title: t`Decks`,
      node: (
        <SafeAreaView style={styles.wrapper}>
          <ScrollView contentContainerStyle={backgroundStyle}>
            <View style={[space.paddingSideS, space.paddingBottomS]}>
              <RoundedFactionBlock
                faction="neutral"
                noSpace
                header={
                  <CampaignGuideSummary
                    inverted
                    difficulty={processedCampaignA.campaignLog.campaignData.difficulty}
                    campaignGuide={contextA.campaignGuide}
                  />
                }
                footer={removeMode ? (
                  <RoundedFooterButton
                    icon="check"
                    title={t`Finished removing investigators`}
                    onPress={toggleRemoveMode}
                  />
                ) : (
                  <RoundedFooterButton
                    icon="expand"
                    title={t`Add Investigator`}
                    onPress={addInvestigatorAPressed}
                  />
                )}
              >
                <CampaignGuideContext.Provider value={contextA}>
                  <CampaignInvestigatorsComponent
                    removeMode={removeMode}
                    componentId={componentId}
                    showAlert={showAlert}
                    updateCampaign={handleUpdateCampaign}
                    campaignData={contextA}
                    processedCampaign={processedCampaignA}
                    showTraumaDialog={showTraumaDialog}
                  />
                </CampaignGuideContext.Provider>
              </RoundedFactionBlock>
            </View>
            <View style={[space.paddingSideS, space.paddingBottomL]}>
              <RoundedFactionBlock
                faction="neutral"
                noSpace
                header={
                  <CampaignGuideSummary
                    difficulty={processedCampaignB.campaignLog.campaignData.difficulty}
                    campaignGuide={contextB.campaignGuide}
                    inverted
                  />
                }
                footer={removeMode ? (
                  <RoundedFooterButton
                    icon="check"
                    title={t`Finished removing investigators`}
                    onPress={toggleRemoveMode}
                  />
                ) : (
                  <RoundedFooterButton
                    icon="expand"
                    title={t`Add Investigator`}
                    onPress={addInvestigatorBPressed}
                  />
                )}
              >
                <CampaignGuideContext.Provider value={contextB}>
                  <CampaignInvestigatorsComponent
                    removeMode={removeMode}
                    componentId={componentId}
                    showAlert={showAlert}
                    updateCampaign={handleUpdateCampaign}
                    processedCampaign={processedCampaignB}
                    campaignData={contextB}
                    showTraumaDialog={showTraumaDialog}
                  />
                </CampaignGuideContext.Provider>
              </RoundedFactionBlock>
            </View>
          </ScrollView>
        </SafeAreaView>
      ),
    };
  }, [showTraumaDialog, showAlert, addInvestigatorAPressed, addInvestigatorBPressed, showEditNameDialog, showAddInvestigator, toggleRemoveMode, handleUpdateCampaign,
    componentId, contextA, contextB, processedCampaignA, processedCampaignB, backgroundStyle, campaignDataA, campaignDataB, campaignId, campaignName, removeMode,
  ]);
  const scenarioTab = useMemo(() => {
    if (!processedCampaignA || !processedCampaignB || !contextA || !contextB) {
      return null;
    }
    return {
      key: 'scenarios',
      title: t`Scenarios`,
      node: (
        <ScrollView contentContainerStyle={backgroundStyle}>
          <LinkedScenarioListComponent
            componentId={componentId}
            campaignA={processedCampaignA}
            campaignDataA={contextA}
            campaignB={processedCampaignB}
            campaignDataB={contextB}
          />
        </ScrollView>
      ),
    };
  }, [backgroundStyle, componentId, processedCampaignA, processedCampaignB, contextA, contextB]);
  const logTab = useMemo(() => {
    if (!processedCampaignA || !processedCampaignB || !contextA || !contextB) {
      return null;
    }
    return {
      key: 'log',
      title: t`Log`,
      node: (
        <ScrollView contentContainerStyle={backgroundStyle}>
          <CampaignGuideContext.Provider value={contextA}>
            <CampaignLogComponent
              header={
                <CampaignGuideSummary
                  difficulty={processedCampaignA.campaignLog.campaignData.difficulty}
                  campaignGuide={contextA.campaignGuide}
                  inverted
                />
              }
              campaignId={contextA.campaignId.campaignId}
              campaignGuide={contextA.campaignGuide}
              campaignLog={processedCampaignA.campaignLog}
              componentId={componentId}
            />
          </CampaignGuideContext.Provider>
          <CampaignGuideContext.Provider value={contextB}>
            <CampaignLogComponent
              header={
                <CampaignGuideSummary
                  difficulty={processedCampaignB.campaignLog.campaignData.difficulty}
                  campaignGuide={contextB.campaignGuide}
                  inverted
                />
              }
              campaignId={contextB.campaignId.campaignId}
              campaignGuide={contextB.campaignGuide}
              campaignLog={processedCampaignB.campaignLog}
              componentId={componentId}
            />
          </CampaignGuideContext.Provider>
        </ScrollView>
      ),
    };
  }, [backgroundStyle, processedCampaignA, processedCampaignB, contextA, contextB, componentId]);
  const tabs = useMemo(() => {
    if (!investigatorTab || !scenarioTab || !logTab) {
      return null;
    }
    return [investigatorTab, scenarioTab, logTab];
  }, [investigatorTab, scenarioTab, logTab]);
  const [tabView, setSelectedTab] = useTabView({ tabs: tabs || [] });
  if (!tabs) {
    return null;
  }
  return (
    <SafeAreaView style={styles.wrapper}>
      { tabView }
      <CampaignGuideFab
        setSelectedTab={setSelectedTab}
        campaignId={campaignId}
        campaignName={campaignName}
        componentId={componentId}
        toggleRemoveInvestigator={toggleRemoveMode}
        removeMode={removeMode}
        showEditNameDialog={showEditNameDialog}
        showAddInvestigator={showAddInvestigator}
        guided
      />
      { alertDialog }
      { dialog }
      { traumaDialog }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

import React, { useCallback, useContext, useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useDispatch } from 'react-redux';
import { t } from 'ttag';

import CampaignGuideSummary from '@components/campaignguide/CampaignGuideSummary';
import { Campaign, CampaignId } from '@actions/types';
import CampaignInvestigatorsComponent from '@components/campaignguide/CampaignInvestigatorsComponent';
import CampaignLogComponent from '@components/campaignguide/CampaignLogComponent';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import useTabView from '@components/core/useTabView';
import { updateCampaign } from '@components/campaign/actions';
import { useCampaignGuideReduxData } from '@components/campaignguide/contextHelper';
import { NavigationProps } from '@components/nav/types';
import StyleContext from '@styles/StyleContext';
import { useCampaign, useInvestigatorCards, useNavigationButtonPressed } from '@components/core/hooks';
import useCampaignGuideContext from '@components/campaignguide/useCampaignGuideContext';
import { useStopAudioOnUnmount } from '@lib/audio/narrationPlayer';
import space from '@styles/space';
import CampaignGuideFab from '@components/campaignguide/CampaignGuideFab';
import { useAlertDialog, useCountDialog, useDialog, useSimpleTextDialog } from '@components/deck/dialogs';
import useTraumaDialog from '@components/campaign/useTraumaDialog';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useCampaignId } from '@components/campaign/hooks';
import ScenarioCarouselComponent from '@components/campaignguide/ScenarioCarouselComponent';
import DeckButton from '@components/deck/controls/DeckButton';
import { useCampaignLinkHelper } from './useCampaignLinkHelper';
import CampaignDetailTab from '../CampaignDetailTab';

export interface LinkedCampaignGuideProps {
  campaignId: CampaignId;
  campaignIdA: string;
  campaignIdB: string;
}

type Props = LinkedCampaignGuideProps & NavigationProps;

export default function LinkedCampaignGuideView(props: Props) {
  const { componentId } = props;
  const [countDialog, showCountDialog] = useCountDialog();
  const [campaignId, setCampaignServerId] = useCampaignId(props.campaignId);
  const [campaignIdA, campaignIdB] = useMemo(() => {
    return [
      { campaignId: props.campaignIdA, serverId: campaignId.serverId },
      { campaignId: props.campaignIdB, serverId: campaignId.serverId },
    ];
  }, [props.campaignIdA, props.campaignIdB, campaignId.serverId]);
  const investigators = useInvestigatorCards();
  const styleContext = useContext(StyleContext);
  const { user } = useContext(ArkhamCardsAuthContext);
  const { backgroundStyle } = styleContext;
  const dispatch = useDispatch();
  useStopAudioOnUnmount();

  const { showTraumaDialog, traumaDialog } = useTraumaDialog({ hideKilledInsane: true });
  const campaign = useCampaign(campaignId);
  const campaignName = (campaign && campaign.name) || '';
  const campaignDataA = useCampaignGuideReduxData(campaignIdA, investigators);
  const campaignDataB = useCampaignGuideReduxData(campaignIdB, investigators);


  const updateCampaignName = useCallback((name: string) => {
    dispatch(updateCampaign(user, campaignId, { name, lastUpdated: new Date() }));
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: name,
        },
      },
    });
  }, [campaignId, dispatch, user, componentId]);


  const { dialog, showDialog: showEditNameDialog } = useSimpleTextDialog({
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
    dispatch(updateCampaign(user, id, sparseCampaign, now));
  }, [dispatch, user]);
  const contextA = useCampaignGuideContext(campaignIdA, campaignDataA);
  const contextB = useCampaignGuideContext(campaignIdB, campaignDataB);
  const processedCampaignA = useMemo(() => contextA?.campaignGuide && contextA?.campaignState && contextA.campaignGuide.processAllScenarios(contextA.campaignState), [contextA?.campaignGuide, contextA?.campaignState]);
  const processedCampaignB = useMemo(() => contextB?.campaignGuide && contextB?.campaignState && contextB.campaignGuide.processAllScenarios(contextB.campaignState), [contextB?.campaignGuide, contextB?.campaignState]);


  const [showCampaignScenarioA, showCampaignScenarioB] = useCampaignLinkHelper({
    componentId,
    campaignA: processedCampaignA,
    campaignDataA: contextA,
    campaignB: processedCampaignB,
    campaignDataB: contextB,
  });
  const addInvestigatorAPressed = useCallback(() => {
    contextA?.campaignState.showChooseDeck();
  }, [contextA?.campaignState]);
  const addInvestigatorBPressed = useCallback(() => {
    contextB?.campaignState.showChooseDeck();
  }, [contextB?.campaignState]);
  const [alertDialog, showAlert] = useAlertDialog();
  const showAddInvestigator = useCallback(() => {
    if (contextA && contextB) {
      showAlert(
        t`Add investigator to which campaign?`,
        t`Which campaign would you like to add an investigator to?`,
        [
          {
            text: contextA.campaignGuide.campaignName(),
            onPress: addInvestigatorAPressed,
            icon: 'tdea',
          },
          {
            text: contextB.campaignGuide.campaignName(),
            onPress: addInvestigatorBPressed,
            icon: 'tdeb',
          },
          {
            text: t`Cancel`,
            style: 'cancel',
          },
        ],
      );
    }
  }, [contextA, contextB, addInvestigatorAPressed, addInvestigatorBPressed, showAlert]);

  const campaignATab = useMemo(() => {
    if (!campaignDataA || !processedCampaignA || !contextA) {
      return null;
    }
    return {
      key: 'campaignA',
      title: contextA.campaignGuide.campaignName(),
      node: (
        <SafeAreaView style={styles.wrapper}>
          <CampaignGuideContext.Provider value={contextA}>
            <CampaignDetailTab
              componentId={componentId}
              processedCampaign={processedCampaignA}
              showLinkedScenario={showCampaignScenarioB}
              showAlert={showAlert}
              showCountDialog={showCountDialog}
              showTraumaDialog={showTraumaDialog}
            />
          </CampaignGuideContext.Provider>
        </SafeAreaView>
      ),
    };
  }, [campaignDataA, processedCampaignA, contextA, componentId, showCampaignScenarioB, showCountDialog, showAlert, showTraumaDialog]);
  const campaignBTab = useMemo(() => {
    if (!campaignDataB || !processedCampaignB || !contextB) {
      return null;
    }
    return {
      key: 'campaignB',
      title: contextB.campaignGuide.campaignName(),
      node: (
        <SafeAreaView style={styles.wrapper}>
          <CampaignGuideContext.Provider value={contextB}>
            <CampaignDetailTab
              componentId={componentId}
              processedCampaign={processedCampaignB}
              showLinkedScenario={showCampaignScenarioA}
              showAlert={showAlert}
              showCountDialog={showCountDialog}
              showTraumaDialog={showTraumaDialog}
            />
          </CampaignGuideContext.Provider>
        </SafeAreaView>
      ),
    };
  }, [campaignDataB, processedCampaignB, contextB, componentId, showCampaignScenarioA, showCountDialog, showAlert, showTraumaDialog]);

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
                />
              }
              campaignId={contextA.campaignId}
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
                />
              }
              campaignId={contextB.campaignId}
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
    if (!campaignATab || !campaignBTab) {
      return null;
    }
    return [campaignATab, campaignBTab];
  }, [campaignATab, campaignBTab]);
  const [tabView, setSelectedTab] = useTabView({ tabs: tabs || [] });
  if (!tabs) {
    return null;
  }
  return (
    <View style={styles.wrapper}>
      { tabView }
      <CampaignGuideFab
        setCampaignServerId={setCampaignServerId}
        campaignId={campaignId}
        showEditNameDialog={showEditNameDialog}
        guided
      />
      { alertDialog }
      { dialog }
      { traumaDialog }
      { countDialog }
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

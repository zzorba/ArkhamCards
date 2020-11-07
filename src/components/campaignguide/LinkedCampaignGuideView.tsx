import React, { useCallback, useContext, useMemo } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import LinkedScenarioListComponent from './LinkedScenarioListComponent';
import CampaignGuideSummary from './CampaignGuideSummary';
import withDialogs, { InjectedDialogProps } from '@components/core/withDialogs';
import { Campaign } from '@actions/types';
import BasicButton from '@components/core/BasicButton';
import CampaignInvestigatorsComponent from '@components/campaignguide/CampaignInvestigatorsComponent';
import CampaignLogComponent from '@components/campaignguide/CampaignLogComponent';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import withTraumaDialog, { TraumaProps } from '@components/campaign/withTraumaDialog';
import TabView from '@components/core/TabView';
import { deleteCampaign, updateCampaign } from '@components/campaign/actions';
import { campaignGuideReduxData } from '@components/campaignguide/contextHelper';
import { AppState } from '@reducers';
import { NavigationProps } from '@components/nav/types';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useCampaign, useInvestigatorCards, useNavigationButtonPressed } from '@components/core/hooks';
import useCampaignGuideContext from './useCampaignGuideContext';

export interface LinkedCampaignGuideProps {
  campaignId: number;
  campaignIdA: number;
  campaignIdB: number;
}

type Props = LinkedCampaignGuideProps &
  NavigationProps &
  InjectedDialogProps &
  TraumaProps;

function LinkedCampaignGuideView(props: Props) {
  const { componentId, campaignId, campaignIdA, campaignIdB, showTraumaDialog, showTextEditDialog } = props;
  const investigators = useInvestigatorCards();
  const styleContext = useContext(StyleContext);
  const { backgroundStyle } = styleContext;
  const dispatch = useDispatch();

  const campaign = useCampaign(campaignId);
  const campaignName = (campaign && campaign.name) || '';
  const campaignDataASelector = useCallback((state: AppState) => investigators && campaignGuideReduxData(campaignIdA, investigators, state), [campaignIdA, investigators]);
  const campaignDataA = useSelector(campaignDataASelector);
  const campaignDataBSelector = useCallback((state: AppState) => investigators && campaignGuideReduxData(campaignIdB, investigators, state), [campaignIdB, investigators]);
  const campaignDataB = useSelector(campaignDataBSelector);

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

  const showEditNameDialog = useCallback(() => {
    showTextEditDialog(t`Name`, campaignName, updateCampaignName);
  }, [campaignName, showTextEditDialog, updateCampaignName]);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'edit') {
      showEditNameDialog();
    }
  }, componentId, [showEditNameDialog]);

  const actuallyDeleteCampaign = useCallback(() => {
    dispatch(deleteCampaign(campaignId));
    Navigation.pop(componentId);
  }, [componentId, dispatch, campaignId]);

  const deleteCampaignPressed = useCallback(() => {
    Alert.alert(
      t`Delete`,
      t`Are you sure you want to delete the campaign: ${campaignName}`,
      [
        { text: t`Delete`, onPress: actuallyDeleteCampaign, style: 'destructive' },
        { text: t`Cancel`, style: 'cancel' },
      ],
    );
  }, [campaignName, actuallyDeleteCampaign]);

  const handleUpdateCampaign = useCallback((id: number, sparseCampaign: Partial<Campaign>, now?: Date) => {
    dispatch(updateCampaign(id, sparseCampaign, now));
  }, [dispatch]);

  const contextA = useCampaignGuideContext(campaignIdA, campaignDataA);
  const contextB = useCampaignGuideContext(campaignIdB, campaignDataB);
  const processedCampaignA = useMemo(() => contextA?.campaignGuide && contextA?.campaignState && contextA.campaignGuide.processAllScenarios(contextA.campaignState), [contextA?.campaignGuide, contextA?.campaignState]);
  const processedCampaignB = useMemo(() => contextB?.campaignGuide && contextB?.campaignState && contextB.campaignGuide.processAllScenarios(contextB.campaignState), [contextB?.campaignGuide, contextB?.campaignState]);

  const tabs = useMemo(() => {
    if (!campaignDataA || !campaignDataB || !processedCampaignA || !processedCampaignB || !contextA || !contextB) {
      return null;
    }
    return [
      {
        key: 'investigators',
        title: t`Decks`,
        node: (
          <ScrollView contentContainerStyle={backgroundStyle}>
            <CampaignGuideSummary
              difficulty={processedCampaignA.campaignLog.campaignData.difficulty}
              campaignGuide={contextA.campaignGuide}
              inverted
            />
            <CampaignGuideContext.Provider value={contextA}>
              <CampaignInvestigatorsComponent
                componentId={componentId}
                updateCampaign={handleUpdateCampaign}
                processedCampaign={processedCampaignA}
                campaignData={contextA}
                showTraumaDialog={showTraumaDialog}
              />
            </CampaignGuideContext.Provider>
            <CampaignGuideSummary
              difficulty={processedCampaignB.campaignLog.campaignData.difficulty}
              campaignGuide={contextB.campaignGuide}
              inverted
            />
            <CampaignGuideContext.Provider value={contextB}>
              <CampaignInvestigatorsComponent
                componentId={componentId}
                updateCampaign={handleUpdateCampaign}
                processedCampaign={processedCampaignB}
                campaignData={contextB}
                showTraumaDialog={showTraumaDialog}
              />
            </CampaignGuideContext.Provider>
            <BasicButton
              title={t`Delete Campaign`}
              onPress={deleteCampaignPressed}
              color={COLORS.red}
            />
          </ScrollView>
        ),
      },
      {
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
      },
      {
        key: 'log',
        title: t`Log`,
        node: (
          <ScrollView contentContainerStyle={backgroundStyle}>
            <CampaignGuideSummary
              difficulty={processedCampaignA.campaignLog.campaignData.difficulty}
              campaignGuide={contextA.campaignGuide}
              inverted
            />
            <CampaignGuideContext.Provider value={contextA}>
              <CampaignLogComponent
                campaignId={contextA.campaignId}
                campaignGuide={contextA.campaignGuide}
                campaignLog={processedCampaignA.campaignLog}
                componentId={componentId}
              />
            </CampaignGuideContext.Provider>
            <CampaignGuideSummary
              difficulty={processedCampaignB.campaignLog.campaignData.difficulty}
              campaignGuide={contextB.campaignGuide}
              inverted
            />
            <CampaignGuideContext.Provider value={contextB}>
              <CampaignLogComponent
                campaignId={contextB.campaignId}
                campaignGuide={contextB.campaignGuide}
                campaignLog={processedCampaignB.campaignLog}
                componentId={componentId}
              />
            </CampaignGuideContext.Provider>
          </ScrollView>
        ),
      },
    ];
  }, [campaignDataA, campaignDataB, processedCampaignA, processedCampaignB, contextA, contextB, backgroundStyle, componentId, deleteCampaignPressed, handleUpdateCampaign, showTraumaDialog]);
  if (!tabs) {
    return null;
  }
  return (
    <TabView tabs={tabs} />
  );
}

export default withDialogs(
  withTraumaDialog(LinkedCampaignGuideView, { hideKilledInsane: true })
);

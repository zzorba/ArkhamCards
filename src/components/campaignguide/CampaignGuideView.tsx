import React, { useCallback, useContext, useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useDispatch } from 'react-redux';
import { t } from 'ttag';

import CampaignGuideSummary from './CampaignGuideSummary';
import withDialogs, { InjectedDialogProps } from '@components/core/withDialogs';
import { Campaign } from '@actions/types';
import CampaignInvestigatorsComponent from '@components/campaignguide/CampaignInvestigatorsComponent';
import CampaignLogComponent from '@components/campaignguide/CampaignLogComponent';
import ScenarioListComponent from '@components/campaignguide/ScenarioListComponent';
import TabView from '@components/core/TabView';
import { deleteCampaign, updateCampaign } from '@components/campaign/actions';
import withTraumaDialog, { TraumaProps } from '@components/campaign/withTraumaDialog';
import withCampaignGuideContext, {
  CampaignGuideProps as InjectedCampaignGuideProps,
  CampaignGuideInputProps,
} from '@components/campaignguide/withCampaignGuideContext';
import { NavigationProps } from '@components/nav/types';
import { s, m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useNavigationButtonPressed } from '@components/core/hooks';

export type CampaignGuideProps = CampaignGuideInputProps;

interface ReduxActionProps {
  updateCampaign: (
    id: number,
    sparseCampaign: Partial<Campaign>
  ) => void;
  deleteCampaign: (id: number) => void;
}

type Props = CampaignGuideProps &
  NavigationProps &
  InjectedDialogProps &
  InjectedCampaignGuideProps &
  TraumaProps;

function CampaignGuideView({ campaignId, componentId, showTextEditDialog, campaignData, showTraumaDialog }: Props) {
  const { backgroundStyle, borderStyle } = useContext(StyleContext);
  const dispatch = useDispatch();
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
    showTextEditDialog(t`Name`, campaignData.campaignName, updateCampaignName);
  }, [updateCampaignName, campaignData.campaignName, showTextEditDialog]);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'edit') {
      showEditNameDialog();
    }
  }, componentId, [showEditNameDialog]);

  const actuallyDeleteCampaign = useCallback(() => {
    dispatch(deleteCampaign(campaignId));
    Navigation.pop(componentId);
  }, [dispatch, componentId, campaignId]);

  const confirmDeleteCampaign = useCallback(() => {
    const campaignName = campaignData.campaignName;
    Alert.alert(
      t`Delete`,
      t`Are you sure you want to delete the campaign: ${campaignName}`,
      [
        { text: t`Delete`, onPress: actuallyDeleteCampaign, style: 'destructive' },
        { text: t`Cancel`, style: 'cancel' },
      ],
    );
  }, [campaignData.campaignName, actuallyDeleteCampaign]);

  const saveCampaignUpdate = useCallback((id: number, sparseCampaign: Partial<Campaign>, now?: Date) => {
    dispatch(updateCampaign(id, sparseCampaign, now));
  }, [dispatch])
  const { campaignGuide, campaignState } = campaignData;
  const processedCampaign = useMemo(() => campaignGuide.processAllScenarios(campaignState), [campaignGuide, campaignState]);
  const tabs = [
    {
      key: 'investigators',
      title: t`Decks`,
      node: (
        <ScrollView contentContainerStyle={backgroundStyle}>
          <View style={[styles.section, styles.bottomBorder, borderStyle]}>
            <CampaignGuideSummary
              difficulty={processedCampaign.campaignLog.campaignData.difficulty}
              campaignGuide={campaignGuide}
            />
          </View>
          <CampaignInvestigatorsComponent
            componentId={componentId}
            deleteCampaign={confirmDeleteCampaign}
            updateCampaign={saveCampaignUpdate}
            campaignData={campaignData}
            processedCampaign={processedCampaign}
            showTraumaDialog={showTraumaDialog}
          />
        </ScrollView>
      ),
    },
    {
      key: 'scenarios',
      title: t`Scenarios`,
      node: (
        <ScrollView contentContainerStyle={backgroundStyle}>
          <ScenarioListComponent
            campaignId={campaignId}
            campaignData={campaignData}
            processedCampaign={processedCampaign}
            componentId={componentId}
          />
        </ScrollView>
      ),
    },
    {
      key: 'log',
      title: t`Log`,
      node: (
        <ScrollView contentContainerStyle={backgroundStyle}>
          <CampaignLogComponent
            campaignId={campaignId}
            campaignGuide={campaignGuide}
            campaignLog={processedCampaign.campaignLog}
            componentId={componentId}
          />
        </ScrollView>
      ),
    },
  ];

  return (
    <TabView
      tabs={tabs}
    />
  );
}

export default withCampaignGuideContext<CampaignGuideProps & NavigationProps>(
  withDialogs<CampaignGuideProps & InjectedCampaignGuideProps & NavigationProps>(
    withTraumaDialog<CampaignGuideProps & InjectedDialogProps & InjectedCampaignGuideProps & NavigationProps>(
      CampaignGuideView,
      { hideKilledInsane: true }
    )
  )
);

const styles = StyleSheet.create({
  section: {
    padding: m,
    paddingLeft: s + m,
    paddingRight: s + m,
  },
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

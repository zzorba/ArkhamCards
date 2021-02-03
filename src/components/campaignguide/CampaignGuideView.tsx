import React, { useCallback, useContext, useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useDispatch } from 'react-redux';
import { t } from 'ttag';

import CampaignGuideSummary from './CampaignGuideSummary';
import { Campaign, CampaignId } from '@actions/types';
import CampaignInvestigatorsComponent from '@components/campaignguide/CampaignInvestigatorsComponent';
import CampaignLogComponent from '@components/campaignguide/CampaignLogComponent';
import ScenarioListComponent from '@components/campaignguide/ScenarioListComponent';
import useTabView from '@components/core/useTabView';
import { updateCampaign } from '@components/campaign/actions';
import withCampaignGuideContext, { CampaignGuideInputProps } from '@components/campaignguide/withCampaignGuideContext';
import { NavigationProps } from '@components/nav/types';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useFlag, useNavigationButtonPressed } from '@components/core/hooks';
import CampaignGuideContext from './CampaignGuideContext';
import { useStopAudioOnUnmount } from '@lib/audio/narrationPlayer';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import CampaignGuideFab from './CampaignGuideFab';
import { useAlertDialog, useSimpleTextDialog } from '@components/deck/dialogs';
import useTraumaDialog from '@components/campaign/useTraumaDialog';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import DeckButton from '@components/deck/controls/DeckButton';
import ScenarioCarouselComponent from './ScenarioCarouselComponent';

export type CampaignGuideProps = CampaignGuideInputProps;

type Props = CampaignGuideProps & NavigationProps & { setCampaignServerId: (serverId: string) => void };

function CampaignGuideView(props: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  const { user } = useContext(ArkhamCardsAuthContext);
  const { componentId, setCampaignServerId } = props;
  const campaignData = useContext(CampaignGuideContext);
  const { campaignId } = campaignData;
  const dispatch = useDispatch();
  const updateCampaignName = useCallback((name: string) => {
    dispatch(updateCampaign(user, campaignId, { name, lastUpdated: new Date() }));
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: name,
        },
      },
    });
  }, [campaignId, user, dispatch, componentId]);
  const { showTraumaDialog, traumaDialog } = useTraumaDialog({ hideKilledInsane: true });

  const { dialog, showDialog: showEditNameDialog } = useSimpleTextDialog({
    title: t`Name`,
    value: campaignData.campaignName,
    onValueChange: updateCampaignName,
  });

  useStopAudioOnUnmount();
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'edit') {
      showEditNameDialog();
    }
  }, componentId, [showEditNameDialog]);

  const saveCampaignUpdate = useCallback((campaignId: CampaignId, sparseCampaign: Partial<Campaign>, now?: Date) => {
    dispatch(updateCampaign(user, campaignId, sparseCampaign, now));
  }, [dispatch, user]);
  const { campaignGuide, campaignState } = campaignData;
  const processedCampaign = useMemo(() => campaignGuide.processAllScenarios(campaignState), [campaignGuide, campaignState]);
  const [alertDialog, showAlert] = useAlertDialog();
  const decksTab = useMemo(() => {
    return (
      <SafeAreaView style={[styles.wrapper, backgroundStyle]}>
        <ScrollView contentContainerStyle={backgroundStyle} showsVerticalScrollIndicator={false}>
          <View style={[space.paddingSideS, space.paddingBottomS]}>
            <CampaignGuideSummary
              difficulty={processedCampaign.campaignLog.campaignData.difficulty}
              campaignGuide={campaignGuide}
            />
          </View>
          <ScenarioCarouselComponent
            componentId={componentId}
            processedCampaign={processedCampaign}
            showAlert={showAlert}
          />
          <View style={[space.paddingSideS, space.paddingBottomS]}>
            <CampaignInvestigatorsComponent
              componentId={componentId}
              showAlert={showAlert}
              updateCampaign={saveCampaignUpdate}
              campaignData={campaignData}
              processedCampaign={processedCampaign}
              showTraumaDialog={showTraumaDialog}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }, [componentId, backgroundStyle, campaignData, processedCampaign, campaignGuide,
    saveCampaignUpdate, showTraumaDialog, showAlert,
  ]);
  const scenariosTab = useMemo(() => {
    return (
      <View style={[styles.wrapper, backgroundStyle]}>
        <ScrollView contentContainerStyle={backgroundStyle}>
          <ScenarioListComponent
            showAlert={showAlert}
            campaignId={campaignId}
            campaignData={campaignData}
            processedCampaign={processedCampaign}
            componentId={componentId}
          />
        </ScrollView>
      </View>
    );
  }, [backgroundStyle, campaignData, campaignId, processedCampaign, componentId, showAlert]);
  const logTab = useMemo(() => {
    return (
      <View style={[styles.wrapper, backgroundStyle]}>
        <ScrollView contentContainerStyle={backgroundStyle}>
          <CampaignLogComponent
            campaignId={campaignId}
            campaignGuide={campaignGuide}
            campaignLog={processedCampaign.campaignLog}
            componentId={componentId}
          />
        </ScrollView>
      </View>
    );
  }, [backgroundStyle, campaignId, campaignGuide, processedCampaign.campaignLog, componentId]);
  const tabs = useMemo(() => [
    {
      key: 'investigators',
      title: t`Decks`,
      node: decksTab,
    },
    {
      key: 'scenarios',
      title: t`Scenarios`,
      node: scenariosTab,
    },
    {
      key: 'log',
      title: t`Log`,
      node: logTab,
    },
  ], [decksTab, scenariosTab, logTab]);
  const [tabView, setSelectedTab] = useTabView({ tabs });
  return (
    <View style={styles.wrapper}>
      { tabView }
      <CampaignGuideFab
        setCampaignServerId={setCampaignServerId}
        campaignId={campaignData.campaignId}
        showEditNameDialog={showEditNameDialog}
        guided
      />
      { alertDialog }
      { dialog }
      { traumaDialog }
    </View>
  );
}

export default withCampaignGuideContext(CampaignGuideView);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

import React, { useCallback, useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import DrawChaosBagComponent from './DrawChaosBagComponent';
import { showGuideChaosBagOddsCalculator } from '@components/campaign/nav';
import { NavigationProps } from '@components/nav/types';
import { useSimpleChaosBagDialog } from '@components/campaign/CampaignDetailView/useChaosBagDialog';
import { Navigation } from 'react-native-navigation';
import useGuideChaosBag from '../campaignguide/useGuideChaosBag';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { useChaosBagResults } from '@data/hooks';
import withCampaignGuideContext, { InjectedCampaignGuideContextProps } from '@components/campaignguide/withCampaignGuideContext';
import { CampaignGuideInputProps } from '@components/campaignguide/withCampaignGuideContext';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import useProcessedCampaign from '@components/campaignguide/useProcessedCampaign';

export interface GuideDrawChaosBagProps extends CampaignGuideInputProps {
  scenarioId?: string;
  standalone?: boolean;
  investigatorIds: string[];
}

type Props = GuideDrawChaosBagProps & InjectedCampaignGuideContextProps;

function GuideDrawChaosBagView({ componentId, campaignId, scenarioId, standalone, investigatorIds }: Props & NavigationProps) {
  const campaignData = useContext(CampaignGuideContext);
  const { campaignGuide, campaignState } = campaignData;
  const [processedCampaign] = useProcessedCampaign(campaignGuide, campaignState);
  const chaosBag = processedCampaign?.campaignLog.chaosBag;

  const [loading, scenarioCard, scenarioCardText, difficulty, liveChaosBag] = useGuideChaosBag({ campaignId, scenarioId, standalone, processedCampaign });
  useEffect(() => {
    if (scenarioCard) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          subtitle: {
            text: scenarioCard.name,
          },
        },
      });
    }
  }, [scenarioCard, componentId]);
  const theChaosBag = liveChaosBag || chaosBag;
  const chaosBagResults = useChaosBagResults(campaignId);
  const [dialog, showDialog] = useSimpleChaosBagDialog(chaosBag, chaosBagResults);
  const showOdds = useCallback(() => {
    if (theChaosBag) {
      showGuideChaosBagOddsCalculator(componentId, campaignId, theChaosBag, investigatorIds, scenarioId, standalone, processedCampaign);
    }
  }, [componentId, campaignId, theChaosBag, investigatorIds, scenarioId, standalone, processedCampaign]);
  if (loading || !theChaosBag) {
    return <LoadingSpinner />
  }
  return (
    <View style={styles.container}>
      <DrawChaosBagComponent
        campaignId={campaignId}
        chaosBag={theChaosBag}
        chaosBagResults={chaosBagResults}
        viewChaosBagOdds={showOdds}
        editViewPressed={showDialog}
        scenarioCardText={scenarioCardText}
        difficulty={difficulty}
      />
      { dialog }
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default withCampaignGuideContext(GuideDrawChaosBagView, { rootView: false });
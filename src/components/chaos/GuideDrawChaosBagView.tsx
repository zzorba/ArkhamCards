import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import DrawChaosBagComponent from './DrawChaosBagComponent';
import { ChaosBag } from '@app_constants';
import { CampaignId } from '@actions/types';
import { showGuideChaosBagOddsCalculator } from '@components/campaign/nav';
import { NavigationProps } from '@components/nav/types';
import { useSimpleChaosBagDialog } from '@components/campaign/CampaignDetailView/useChaosBagDialog';
import { Navigation } from 'react-native-navigation';
import useGuideChaosBag from '../campaignguide/useGuideChaosBag';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { ProcessedCampaign } from '@data/scenario';
import { useChaosBagResults } from '@data/hooks';

export interface GuideDrawChaosBagProps {
  campaignId: CampaignId;
  scenarioId?: string;
  standalone?: boolean;
  chaosBag: ChaosBag;
  investigatorIds: string[];
  processedCampaign?: ProcessedCampaign;
}

export default function GuideDrawChaosBagView({ componentId, campaignId, scenarioId, standalone, chaosBag, investigatorIds, processedCampaign }: GuideDrawChaosBagProps & NavigationProps) {
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
  const [dialog, showDialog] = useSimpleChaosBagDialog(chaosBag, chaosBagResults.tarot);
  const showOdds = useCallback(() => {
    showGuideChaosBagOddsCalculator(componentId, campaignId, theChaosBag, investigatorIds, scenarioId, standalone, processedCampaign);
  }, [componentId, campaignId, theChaosBag, investigatorIds, scenarioId, standalone, processedCampaign]);
  if (loading) {
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
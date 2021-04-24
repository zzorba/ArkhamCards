import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import DrawChaosBagComponent from '@components/campaign/DrawChaosBagComponent';
import { ChaosBag } from '@app_constants';
import { CampaignId } from '@actions/types';
import { showGuideChaosBagOddsCalculator } from '@components/campaign/nav';
import { NavigationProps } from '@components/nav/types';
import { useSimpleChaosBagDialog } from '@components/campaign/CampaignDetailView/useChaosBagDialog';
import { useScenarioGuideContext } from './withScenarioGuideContext';
import useSingleCard from '@components/card/useSingleCard';

export interface GuideDrawChaosBagProps {
  campaignId: CampaignId;
  scenarioId?: string;
  standalone?: boolean;
  chaosBag: ChaosBag;
  investigatorIds: string[];
}

export default function GuideDrawChaosBagView({ componentId, campaignId, scenarioId, standalone, chaosBag, investigatorIds }: GuideDrawChaosBagProps & NavigationProps) {
  const [campaignContext, scenarioContext] = useScenarioGuideContext(campaignId, scenarioId, false, standalone);
  const liveChaosBag = useMemo(() => {
    if (scenarioId) {
      return scenarioContext?.processedScenario?.latestCampaignLog?.chaosBag;
    }
    if (!campaignContext) {
      return undefined;
    }
    const { campaignGuide, campaignState } = campaignContext;
    const processedCampaign = campaignGuide.processAllScenarios(campaignState);
    return processedCampaign.campaignLog.chaosBag;
  }, [campaignContext, scenarioContext, scenarioId]);
  const theChaosBag = liveChaosBag || chaosBag;
  const [dialog, showDialog] = useSimpleChaosBagDialog(chaosBag);
  const showOdds = useCallback(() => {
    showGuideChaosBagOddsCalculator(componentId, campaignId, theChaosBag, investigatorIds);
  }, [componentId, campaignId, theChaosBag, investigatorIds]);
  return (
    <View style={styles.container}>
      <DrawChaosBagComponent
        campaignId={campaignId}
        chaosBag={theChaosBag}
        viewChaosBagOdds={showOdds}
        editViewPressed={showDialog}
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
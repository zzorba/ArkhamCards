import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import DrawChaosBagComponent from '@components/campaign/DrawChaosBagComponent';
import { ChaosBag } from '@app_constants';
import { CampaignDifficulty, CampaignId } from '@actions/types';
import { showGuideChaosBagOddsCalculator } from '@components/campaign/nav';
import { NavigationProps } from '@components/nav/types';
import { useSimpleChaosBagDialog } from '@components/campaign/CampaignDetailView/useChaosBagDialog';
import { useScenarioGuideContext } from './withScenarioGuideContext';
import useSingleCard from '@components/card/useSingleCard';
import { Navigation } from 'react-native-navigation';

export interface GuideDrawChaosBagProps {
  campaignId: CampaignId;
  scenarioId?: string;
  standalone?: boolean;
  chaosBag: ChaosBag;
  investigatorIds: string[];
}

export default function GuideDrawChaosBagView({ componentId, campaignId, scenarioId, standalone, chaosBag, investigatorIds }: GuideDrawChaosBagProps & NavigationProps) {
  const [campaignContext, scenarioContext] = useScenarioGuideContext(campaignId, scenarioId, false, standalone);
  const processedScenario = scenarioContext?.processedScenario;
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
  const [scenarioCard] = useSingleCard(processedScenario?.scenarioGuide.scenarioCard(), 'encounter');
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
  const difficulty = processedScenario?.latestCampaignLog.campaignData.difficulty;
  const campaignScenarioText = difficulty && scenarioContext?.processedScenario?.scenarioGuide.scenarioCardText(difficulty);
  const scenarioCardText = useMemo(() => {
    if (!difficulty) {
      return undefined;
    }
    if (!scenarioCard) {
      return campaignScenarioText;
    }
    const text = (difficulty === CampaignDifficulty.EASY || difficulty === CampaignDifficulty.STANDARD) ?
      scenarioCard.text : scenarioCard.back_text;
    if (!text) {
      return undefined;
    }
    const lines = text?.split('\n');
    if (!lines.length) {
      return undefined;
    }
    const [, ...rest] = lines;
    return rest.join('\n');
  }, [campaignScenarioText, scenarioCard, difficulty])
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
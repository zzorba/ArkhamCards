import React, { useCallback, useContext, useMemo } from 'react';
import { filter, forEach, map } from 'lodash';
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { t } from 'ttag';

import ScenarioResultRow from './ScenarioResultRow';
import { campaignScenarios, Scenario, completedScenario } from '../constants';
import CampaignSummaryComponent from '../CampaignSummaryComponent';
import { NavigationProps } from '@components/nav/types';
import { Campaign, ScenarioResult } from '@actions/types';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCampaign, useCampaignScenarios } from '@components/core/hooks';

export interface CampaignScenarioProps {
  id: number;
}


export default function CampaignScenarioView({ id, componentId }: CampaignScenarioProps & NavigationProps) {
  const campaign = useCampaign(id);
  const [cycleScenarios, scenarioByCode] = useCampaignScenarios(campaign);
  const { backgroundStyle, typography } = useContext(StyleContext);

  const renderScenarioResult = useCallback((scenarioResult: ScenarioResult, idx: number) => {
    return (
      <ScenarioResultRow
        key={idx}
        componentId={componentId}
        campaignId={id}
        index={idx}
        scenarioResult={scenarioResult}
        scenarioByCode={scenarioByCode}
        editable
      />
    );
  }, [componentId, id, scenarioByCode]);

  if (!campaign) {
    return null;
  }
  const hasCompletedScenario = completedScenario(campaign.scenarioResults);
  return (
    <ScrollView style={[styles.container, backgroundStyle, space.paddingS]}>
      <CampaignSummaryComponent campaign={campaign} hideScenario />
      <Text style={[typography.small, typography.uppercase]}>
        { t`Scenarios` }
      </Text>
      { map(campaign.scenarioResults, renderScenarioResult) }
      { map(
        filter(cycleScenarios, scenario => !hasCompletedScenario(scenario)),
        (scenario, idx) => (
          <Text style={[typography.gameFont, styles.disabled]} key={idx}>
            { scenario.name }
          </Text>
        ))
      }
      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  disabled: {
    color: '#bdbdbd',
  },
  footer: {
    height: 50,
  },
});

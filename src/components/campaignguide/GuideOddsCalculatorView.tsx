import React, { useContext, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { flatMap } from 'lodash';

import OddsCalculatorComponent from '@components/campaign/OddsCalculatorComponent';
import { ChaosBag } from '@app_constants';
import Card from '@data/Card';
import { SCENARIO_CARDS_QUERY } from '@data/query';
import StyleContext from '@styles/StyleContext';
import { useCampaign, useCampaignScenarios, useInvestigatorCards } from '@components/core/hooks';
import useCardsFromQuery from '@components/card/useCardsFromQuery';

export interface GuideOddsCalculatorProps {
  campaignId: number;
  investigatorIds: string[];
  chaosBag: ChaosBag;
}

export default function GuideOddsCalculatorView({ campaignId, investigatorIds, chaosBag }: GuideOddsCalculatorProps) {
  const { colors } = useContext(StyleContext);
  const campaign = useCampaign(campaignId);
  const [cycleScenarios, scenarioByCode] = useCampaignScenarios(campaign);

  const investigators = useInvestigatorCards();
  const allInvestigators: Card[] = useMemo(() => {
    return flatMap(investigatorIds, code => (investigators && investigators[code]) || []);
  }, [investigators, investigatorIds]);
  const [scenarioCards, loading] = useCardsFromQuery({ query: SCENARIO_CARDS_QUERY });
  if (!campaign) {
    return null;
  }
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="small" color={colors.lightText} />
      </View>
    );
  }
  return (
    <OddsCalculatorComponent
      campaign={campaign}
      chaosBag={chaosBag}
      cycleScenarios={cycleScenarios}
      scenarioByCode={scenarioByCode}
      allInvestigators={allInvestigators}
      scenarioCards={scenarioCards}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

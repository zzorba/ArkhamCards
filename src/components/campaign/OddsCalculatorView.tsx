import React, { useContext, useMemo } from 'react';
import { flatMap } from 'lodash';
import { useSelector } from 'react-redux';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import OddsCalculatorComponent from './OddsCalculatorComponent';
import { SCENARIO_CARDS_QUERY } from '@data/query';
import { AppState, getCampaign } from '@reducers';
import { useCampaignScenarios, useInvestigatorCards } from '@components/core/hooks';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import StyleContext from '@styles/StyleContext';

export interface OddsCalculatorProps {
  campaignId: number;
  investigatorIds: string[];
}

const EMPTY_CHAOS_BAG = {};
export default function OddsCalculatorView({ campaignId, investigatorIds }: OddsCalculatorProps) {
  const { colors } = useContext(StyleContext);
  const campaign = useSelector((state: AppState) => getCampaign(state, campaignId));
  const chaosBag = campaign?.chaosBag || EMPTY_CHAOS_BAG;
  const [cycleScenarios, scenarioByCode] = useCampaignScenarios(campaign);
  const investigators = useInvestigatorCards();
  const allInvestigators = useMemo(() => flatMap(investigatorIds, code => investigators?.[code] || []), [investigatorIds, investigators]);
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
      chaosBag={chaosBag || {}}
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


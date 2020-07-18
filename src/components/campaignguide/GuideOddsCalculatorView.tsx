import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { forEach, flatMap } from 'lodash';
import { connect } from 'react-redux';

import OddsCalculatorComponent from '@components/campaign/OddsCalculatorComponent';
import { NavigationProps } from '@components/nav/types';
import CardQueryWrapper from '@components/card/CardQueryWrapper';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import { campaignScenarios, Scenario } from '@components/campaign/constants';
import { Campaign } from '@actions/types';
import { ChaosBag } from '@app_constants';
import Card from '@data/Card';
import { SCENARIO_CARDS_QUERY } from '@data/query';
import { AppState, getCampaign } from '@reducers';

export interface GuideOddsCalculatorProps {
  campaignId: number;
  investigatorIds: string[];
  chaosBag: ChaosBag;
}

interface ReduxProps {
  campaign?: Campaign;
  cycleScenarios?: Scenario[];
  scenarioByCode?: { [code: string]: Scenario };
}

type Props = NavigationProps & GuideOddsCalculatorProps & ReduxProps & PlayerCardProps & DimensionsProps;

class GuideOddsCalculatorView extends React.Component<Props> {
  allInvestigators(): Card[] {
    const {
      investigators,
      investigatorIds,
    } = this.props;
    return flatMap(investigatorIds, code => investigators[code] || []);
  }
  render() {
    const {
      campaign,
      chaosBag,
      fontScale,
      cycleScenarios,
      scenarioByCode,
    } = this.props;
    if (!campaign) {
      return null;
    }
    const allInvestigators = this.allInvestigators();
    return (
      <CardQueryWrapper name="guide-odds" query={SCENARIO_CARDS_QUERY}>
        { scenarioCards => scenarioCards.length ? (
          <OddsCalculatorComponent
            campaign={campaign}
            chaosBag={chaosBag}
            fontScale={fontScale}
            cycleScenarios={cycleScenarios}
            scenarioByCode={scenarioByCode}
            allInvestigators={allInvestigators}
            scenarioCards={scenarioCards}
          />
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator size="small" />
          </View>
        ) }
      </CardQueryWrapper>
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: GuideOddsCalculatorProps
): ReduxProps {
  const campaign = getCampaign(state, props.campaignId);
  if (!campaign) {
    return {
      cycleScenarios: [],
      scenarioByCode: {},
    };
  }
  const cycleScenarios = campaignScenarios(campaign.cycleCode);
  const scenarioByCode: { [code: string]: Scenario } = {};
  forEach(cycleScenarios, scenario => {
    scenarioByCode[scenario.code] = scenario;
  });
  return {
    campaign,
    cycleScenarios,
    scenarioByCode,
  };
}

export default connect(mapStateToProps)(
  withPlayerCards<NavigationProps & GuideOddsCalculatorProps & ReduxProps>(
    withDimensions(GuideOddsCalculatorView)
  )
);

const styles = StyleSheet.create({
  loading: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

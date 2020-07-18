import React from 'react';
import { flatMap, forEach } from 'lodash';
import { connect } from 'react-redux';

import OddsCalculatorComponent from './OddsCalculatorComponent';
import { NavigationProps } from '@components/nav/types';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import CardQueryWrapper from '@components/card/CardQueryWrapper';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import { campaignScenarios, Scenario } from '@components/campaign/constants';
import { Campaign } from '@actions/types';
import { ChaosBag } from '@app_constants';
import Card from '@data/Card';
import { SCENARIO_CARDS_QUERY } from '@data/query';
import { AppState, getCampaign } from '@reducers';

export interface OddsCalculatorProps {
  campaignId: number;
  investigatorIds: string[];
}

interface ReduxProps {
  campaign?: Campaign;
  chaosBag?: ChaosBag;
  cycleScenarios?: Scenario[];
  scenarioByCode?: { [code: string]: Scenario };
}

type Props = NavigationProps & OddsCalculatorProps & ReduxProps & PlayerCardProps & DimensionsProps;

class OddsCalculatorView extends React.Component<Props> {
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
      <CardQueryWrapper name="odds" query={SCENARIO_CARDS_QUERY}>
        { scenarioCards => (
          <OddsCalculatorComponent
            campaign={campaign}
            chaosBag={chaosBag || {}}
            fontScale={fontScale}
            cycleScenarios={cycleScenarios}
            scenarioByCode={scenarioByCode}
            allInvestigators={allInvestigators}
            scenarioCards={scenarioCards}
          />
        ) }
      </CardQueryWrapper>
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: OddsCalculatorProps
): ReduxProps {
  const campaign = getCampaign(state, props.campaignId);
  if (!campaign) {
    return {
      chaosBag: {},
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
    chaosBag: campaign.chaosBag || {},
    cycleScenarios,
    scenarioByCode,
  };
}

export default connect(mapStateToProps)(
  withPlayerCards<NavigationProps & OddsCalculatorProps & ReduxProps>(
    withDimensions(OddsCalculatorView)
  )
);

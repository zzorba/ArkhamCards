import React from 'react';
import { forEach, map } from 'lodash';
import { connect } from 'react-redux';
import { CardResults, connectRealm } from 'react-native-realm';
import { Results } from 'realm';

import OddsCalculatorComponent from './OddsCalculatorComponent';
import { NavigationProps } from 'components/nav/types';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { campaignScenarios, Scenario } from 'components/campaign/constants';
import { Campaign } from 'actions/types';
import { ChaosBag } from 'constants';
import Card from 'data/Card';
import { AppState, getCampaign } from 'reducers';

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

interface RealmProps {
  allInvestigators: Card[];
  scenarioCards?: Results<Card>;
}

type Props = NavigationProps & OddsCalculatorProps & ReduxProps & RealmProps & DimensionsProps;

class OddsCalculatorView extends React.Component<Props> {
  render() {
    const {
      campaign,
      chaosBag,
      fontScale,
      cycleScenarios,
      scenarioByCode,
      allInvestigators,
      scenarioCards,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <OddsCalculatorComponent
        campaign={campaign}
        chaosBag={chaosBag || {}}
        fontScale={fontScale}
        cycleScenarios={cycleScenarios}
        scenarioByCode={scenarioByCode}
        allInvestigators={allInvestigators}
        scenarioCards={scenarioCards}
      />
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
  connectRealm<NavigationProps & OddsCalculatorProps & ReduxProps, RealmProps, Card>(
    withDimensions(OddsCalculatorView),
    {
      schemas: ['Card'],
      mapToProps(
        results: CardResults<Card>,
        realm: Realm,
        props: OddsCalculatorProps
      ): RealmProps {
        const allInvestigators: Card[] = [];
        if (props.investigatorIds.length) {
          forEach(
            results.cards.filtered(
              map(
                props.investigatorIds,
                id => `(code == '${id}')`
              ).join(' OR ')),
            card => allInvestigators.push(card)
          );
        }
        return {
          scenarioCards: results.cards.filtered(`(type_code == 'scenario')`),
          allInvestigators,
        };
      },
    })
);

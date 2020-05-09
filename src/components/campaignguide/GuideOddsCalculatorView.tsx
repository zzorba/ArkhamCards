import React from 'react';
import { forEach, map } from 'lodash';
import { connect } from 'react-redux';
import { CardResults, connectRealm } from 'react-native-realm';
import { Results } from 'realm';

import OddsCalculatorComponent from 'components/campaign/OddsCalculatorComponent';
import { NavigationProps } from 'components/nav/types';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { campaignScenarios, Scenario } from 'components/campaign/constants';
import { Campaign } from 'actions/types';
import { ChaosBag } from 'constants';
import Card from 'data/Card';
import { AppState, getCampaign } from 'reducers';

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

interface RealmProps {
  allInvestigators: Card[];
  scenarioCards?: Results<Card>;
}

type Props = NavigationProps & GuideOddsCalculatorProps & ReduxProps & RealmProps & DimensionsProps;

class GuideOddsCalculatorView extends React.Component<Props> {
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
  connectRealm<NavigationProps & GuideOddsCalculatorProps & ReduxProps, RealmProps, Card>(
    withDimensions(GuideOddsCalculatorView),
    {
      schemas: ['Card'],
      mapToProps(
        results: CardResults<Card>,
        realm: Realm,
        props: GuideOddsCalculatorProps
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

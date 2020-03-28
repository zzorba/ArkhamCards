import React from 'react';
import { Text } from 'react-native';
import { flatMap } from 'lodash';
import { connect } from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import { CampaignGuideContextType } from './CampaignGuideContext';
import withCampaignGuideContext, { CampaignGuideInputProps } from './withCampaignGuideContext';
import withPlayerCards, { PlayerCardProps, TabooSetOverride } from 'components/core/withPlayerCards';
import { Deck } from 'actions/types';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import { InvestigatorDeck } from 'data/scenario';
import {
  AppState,
  getDecks,
  getLatestCampaignDeckIds,
} from 'reducers';

export interface ScenarioGuideInputProps extends CampaignGuideInputProps {
  scenarioId: string;
}

interface ReduxProps {
  decks: Deck[];
}

export default function withScenarioGuideContext<Props>(
  WrappedComponent: React.ComponentType<Props>
): React.ComponentType<Props & TabooSetOverride & ScenarioGuideInputProps> {
  const mapStateToProps = (
    state: AppState,
    props: Props & ScenarioGuideInputProps & CampaignGuideContextType &PlayerCardProps
  ): ReduxProps => {
    const latestDeckIds = getLatestCampaignDeckIds(state, props.campaign);
    const decks = getDecks(state, latestDeckIds || []);
    return {
      decks,
    };
  };

  class ScenarioDataComponent extends React.Component<Props & CampaignGuideContextType & ScenarioGuideInputProps & ReduxProps & PlayerCardProps> {
    render() {
      const {
        campaignState,
        campaignGuide,
        investigators,
        decks,
        scenarioId,
      } = this.props;
      const scenarioGuide = campaignGuide.getScenario(scenarioId, campaignState);
      if (!scenarioGuide) {
        return <Text>Unknown scenario: { scenarioId }</Text>;
      }
      const investigatorDecks: InvestigatorDeck[] = flatMap(decks, deck => {
        const investigator = investigators[deck.investigator_code];
        if (!investigator) {
          return [];
        }
        return {
          deck,
          investigator,
        };
      });
      const context: ScenarioGuideContextType = {
        // @ts-ignore TS2322
        scenarioGuide,
        investigatorDecks,
        scenarioState: new ScenarioStateHelper(
          scenarioGuide.scenario.id,
          campaignState
        ),
      };
      return (
        <ScenarioGuideContext.Provider value={context}>
          <WrappedComponent {...this.props as Props} />
        </ScenarioGuideContext.Provider>
      );
    }
  }
  const result = withCampaignGuideContext<Props & ScenarioGuideInputProps>(
    withPlayerCards<Props & CampaignGuideContextType & ScenarioGuideInputProps>(
      connect<ReduxProps, null, Props & CampaignGuideContextType & ScenarioGuideInputProps & PlayerCardProps, AppState>(
        mapStateToProps
      )(
        // @ts-ignore TS2345
        ScenarioDataComponent
      )
    )
  );
  hoistNonReactStatic(result, WrappedComponent);
  return result as React.ComponentType<Props & ScenarioGuideInputProps>;
}

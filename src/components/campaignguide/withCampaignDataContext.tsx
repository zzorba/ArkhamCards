import React from 'react';
import { Text } from 'react-native';
import { flatMap } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, Action } from 'redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import { resetScenario, setScenarioCount, setScenarioDecision, setScenarioChoice, setScenarioSupplies, setScenarioInvestigatorChoice } from './actions';
import { InvestigatorDeck } from './types';
import withPlayerCards, { PlayerCardProps, TabooSetOverride } from 'components/core/withPlayerCards';
import { InvestigatorChoices, SingleCampaign, Deck, ScenarioState, SupplyCounts } from 'actions/types';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import { getCampaignGuide } from 'data/scenario';
import {
  AppState,
  getCampaign,
  getDecks,
  getLatestCampaignDeckIds,
  getScenarioGuideState,
} from 'reducers';

export interface CampaignDataInputProps {
  campaignId: number;
  scenarioId: string;
}

interface ReduxProps {
  campaign?: SingleCampaign;
  scenarioState: ScenarioState;
  decks: Deck[];
}

interface ReduxActionProps {
  setScenarioDecision: (
    campaignId: number,
    scenarioId: string,
    stepId: string,
    value: boolean
  ) => void;
  setScenarioCount: (
    campaignId: number,
    scenarioId: string,
    stepId: string,
    value: number
  ) => void;
  setScenarioSupplies: (
    campaignId: number,
    scenarioId: string,
    stepId: string,
    supplyCounts: SupplyCounts
  ) => void;
  setScenarioInvestigatorChoice: (
    campaignId: number,
    scenarioId: string,
    stepId: string,
    supplyCounts: InvestigatorChoices
  ) => void;
  setScenarioChoice: (
    campaignId: number,
    scenarioId: string,
    stepId: string,
    choice: number
  ) => void;
  resetScenario: (campaignId: number, scenarioId: string) => void;
}

export default function withCampaignDataContext<Props>(
  WrappedComponent: React.ComponentType<Props>
): React.ComponentType<Props & TabooSetOverride & CampaignDataInputProps> {
  const mapStateToProps = (
    state: AppState,
    props: Props & CampaignDataInputProps & PlayerCardProps
  ): ReduxProps => {
    const campaign = getCampaign(state, props.campaignId);
    const latestDeckIds = getLatestCampaignDeckIds(state, campaign);
    const decks = getDecks(state, latestDeckIds || []);
    return {
      campaign,
      decks,
      scenarioState: getScenarioGuideState(state, props.campaignId, props.scenarioId),
    };
  };

  const mapDispatchToProps = (
    dispatch: Dispatch<Action>
  ): ReduxActionProps => {
    return bindActionCreators({
      setScenarioCount,
      setScenarioDecision,
      setScenarioSupplies,
      setScenarioInvestigatorChoice,
      resetScenario,
      setScenarioChoice,
    }, dispatch);
  };
  class CampaignDataComponent extends React.Component<Props & CampaignDataInputProps & ReduxProps & ReduxActionProps & PlayerCardProps> {
    _setScenarioDecision = (
      stepId: string,
      value: boolean
    ) => {
      const {
        setScenarioDecision,
        campaignId,
        scenarioId,
      } = this.props;
      setScenarioDecision(
        campaignId,
        scenarioId,
        stepId,
        value
      );
    };

    _setScenarioCount = (
      stepId: string,
      value: number
    ) => {
      const {
        setScenarioCount,
        campaignId,
        scenarioId,
      } = this.props;
      setScenarioCount(
        campaignId,
        scenarioId,
        stepId,
        value
      );
    };

    _setSupplies = (
      stepId: string,
      supplyCounts: SupplyCounts
    ) => {
      const {
        setScenarioSupplies,
        campaignId,
        scenarioId,
      } = this.props;
      setScenarioSupplies(
        campaignId,
        scenarioId,
        stepId,
        supplyCounts
      );
    };

    _setInvestigatorChoice = (
      stepId: string,
      choices: InvestigatorChoices
    ) => {
      const {
        setScenarioInvestigatorChoice,
        campaignId,
        scenarioId,
      } = this.props;
      setScenarioInvestigatorChoice(
        campaignId,
        scenarioId,
        stepId,
        choices
      );
    };

    _setChoice = (
      stepId: string,
      choice: number
    ) => {
      const {
        setScenarioChoice,
        campaignId,
        scenarioId,
      } = this.props;
      setScenarioChoice(
        campaignId,
        scenarioId,
        stepId,
        choice
      );
    };

    _resetScenario = () => {
      const {
        resetScenario,
        campaignId,
        scenarioId,
      } = this.props;
      resetScenario(campaignId, scenarioId);
    }

    render() {
      const {
        campaign,
        investigators,
        decks,
        scenarioId,
        scenarioState,
      } = this.props;
      if (!campaign) {
        return <Text>Unknown Campaign</Text>;
      }
      const campaignGuide = getCampaignGuide(campaign.cycleCode);
      if (!campaignGuide) {
        return <Text>Unknown Campaign Guide</Text>;
      }
      const scenarioGuide = campaignGuide.getScenario(scenarioId);
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
        campaign,
        campaignGuide,
        scenarioGuide,
        investigatorDecks,
        scenarioState: new ScenarioStateHelper(scenarioState, {
          setCount: this._setScenarioCount,
          setDecision: this._setScenarioDecision,
          setSupplies: this._setSupplies,
          setInvestigatorChoice: this._setInvestigatorChoice,
          setChoice: this._setChoice,
          resetScenario: this._resetScenario,
        }),
      };
      return (
        <ScenarioGuideContext.Provider value={context}>
          <WrappedComponent {...this.props as Props} />
        </ScenarioGuideContext.Provider>
      );
    }
  }
  const result = withPlayerCards<Props & CampaignDataInputProps>(
    connect<ReduxProps, ReduxActionProps, Props & CampaignDataInputProps & PlayerCardProps, AppState>(
      mapStateToProps,
      mapDispatchToProps
    )(
      // @ts-ignore TS2345
      CampaignDataComponent
    )
  );
  hoistNonReactStatic(result, WrappedComponent);
  return result as React.ComponentType<Props & CampaignDataInputProps>;
}

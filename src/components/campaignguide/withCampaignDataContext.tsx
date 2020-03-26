import React from 'react';
import { Text } from 'react-native';
import { flatMap } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, Action } from 'redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import {
  resetScenario,
  setScenarioCount,
  setScenarioDecision,
  setScenarioChoice,
  setScenarioSupplies,
  setScenarioChoiceList,
  undo,
} from './actions';
import withPlayerCards, { PlayerCardProps, TabooSetOverride } from 'components/core/withPlayerCards';
import { ListChoices, SingleCampaign, Deck, CampaignGuideState, SupplyCounts } from 'actions/types';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import { getCampaignGuide, InvestigatorDeck } from 'data/scenario';
import {
  AppState,
  getCampaign,
  getDecks,
  getLatestCampaignDeckIds,
  getCampaignGuideState,
} from 'reducers';

export interface CampaignDataInputProps {
  campaignId: number;
  scenarioId: string;
}

interface ReduxProps {
  campaign?: SingleCampaign;
  campaignState: CampaignGuideState;
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
  setScenarioChoiceList: (
    campaignId: number,
    scenarioId: string,
    stepId: string,
    supplyCounts: ListChoices
  ) => void;
  setScenarioChoice: (
    campaignId: number,
    scenarioId: string,
    stepId: string,
    choice: number
  ) => void;
  resetScenario: (campaignId: number, scenarioId: string) => void;
  undo: (campaignId: number) => void;
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
      campaignState: getCampaignGuideState(state, props.campaignId),
    };
  };

  const mapDispatchToProps = (
    dispatch: Dispatch<Action>
  ): ReduxActionProps => {
    return bindActionCreators({
      setScenarioCount,
      setScenarioDecision,
      setScenarioSupplies,
      setScenarioChoiceList,
      resetScenario,
      setScenarioChoice,
      undo,
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

    _setChoiceList = (
      stepId: string,
      choices: ListChoices
    ) => {
      const {
        setScenarioChoiceList,
        campaignId,
        scenarioId,
      } = this.props;
      setScenarioChoiceList(
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

    _undo = () => {
      const {
        undo,
        campaignId,
      } = this.props;
      undo(campaignId);
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
        campaignState,
        investigators,
        decks,
        scenarioId,
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
        scenarioState: new ScenarioStateHelper(
          scenarioGuide.scenario.id,
          campaignState,
          {
            setCount: this._setScenarioCount,
            setDecision: this._setScenarioDecision,
            setSupplies: this._setSupplies,
            setChoiceList: this._setChoiceList,
            setChoice: this._setChoice,
            resetScenario: this._resetScenario,
            undo: this._undo,
          },
          investigatorDecks.length
        ),
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

import React from 'react';
import { Platform, Text } from 'react-native';
import { flatMap, forEach, map } from 'lodash';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, Action } from 'redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import { MyDecksSelectorProps } from 'components/campaign/MyDecksSelectorDialog';
import CampaignGuideContext, { CampaignGuideContextType } from './CampaignGuideContext';
import {
  addInvestigator,
} from 'components/campaign/actions';
import {
  startScenario,
  resetScenario,
  setScenarioCount,
  setScenarioDecision,
  setScenarioChoice,
  setScenarioSupplies,
  setScenarioChoiceList,
  undo,
} from './actions';
import { Deck, ListChoices, SupplyCounts, SingleCampaign, CampaignGuideState } from 'actions/types';
import CampaignStateHelper from 'data/scenario/CampaignStateHelper';
import { getCampaignGuide } from 'data/scenario';
import Card from 'data/Card';
import withPlayerCards, { PlayerCardProps } from 'components/core/withPlayerCards';
import {
  AppState,
  getCampaign,
  getCampaignGuideState,
  getLatestCampaignInvestigators,
  getAllDecks,
  getLatestCampaignDeckIds,
} from 'reducers';

export interface CampaignGuideInputProps {
  campaignId: number;
}

interface ReduxProps {
  campaign?: SingleCampaign;
  campaignState: CampaignGuideState;
  allInvestigators: Card[];
  latestDecks: Deck[];
}

interface ReduxActionProps {
  addInvestigator: (campaignId: number, investigator: string, deckId?: number) => void;
  startScenario: (campaignId: number, scenarioId: string) => void;
  setScenarioDecision: (
    campaignId: number,
    stepId: string,
    value: boolean,
    scenarioId?: string
  ) => void;
  setScenarioCount: (
    campaignId: number,
    stepId: string,
    value: number,
    scenarioId?: string
  ) => void;
  setScenarioSupplies: (
    campaignId: number,
    stepId: string,
    supplyCounts: SupplyCounts,
    scenarioId?: string
  ) => void;
  setScenarioChoiceList: (
    campaignId: number,
    stepId: string,
    supplyCounts: ListChoices,
    scenarioId?: string
  ) => void;
  setScenarioChoice: (
    campaignId: number,
    stepId: string,
    choice: number,
    scenarioId?: string
  ) => void;
  resetScenario: (
    campaignId: number,
    scenarioId: string
  ) => void;
  undo: (
    campaignId: number,
    scenarioId: string
  ) => void;
}

export default function withCampaignGuideContext<Props>(
  WrappedComponent: React.ComponentType<Props & CampaignGuideContextType>
): React.ComponentType<Props & CampaignGuideInputProps> {
  const mapStateToProps = (
    state: AppState,
    props: Props & CampaignGuideInputProps & PlayerCardProps
  ): ReduxProps => {
    const campaign = getCampaign(state, props.campaignId);
    const allInvestigators = getLatestCampaignInvestigators(state, props.investigators, campaign);
    const decks = getAllDecks(state);
    const latestDeckIds = getLatestCampaignDeckIds(state, campaign);

    return {
      campaign,
      campaignState: getCampaignGuideState(state, props.campaignId),
      latestDecks: flatMap(latestDeckIds, deckId => decks[deckId]),
      allInvestigators,
    };
  };

  const mapDispatchToProps = (
    dispatch: Dispatch<Action>
  ): ReduxActionProps => {
    return bindActionCreators({
      addInvestigator,
      startScenario,
      setScenarioCount,
      setScenarioDecision,
      setScenarioSupplies,
      setScenarioChoiceList,
      resetScenario,
      setScenarioChoice,
      undo,
    }, dispatch);
  };
  class CampaignDataComponent extends React.Component<
    Props &
    CampaignGuideInputProps &
    ReduxProps &
    ReduxActionProps
  > {
    _deckAdded = (deck: Deck) => {
      this._addInvestigator(deck.investigator_code, deck.id);
    };

    _investigatorAdded = (card: Card) => {
      this._addInvestigator(card.code);
    };

    _showChooseDeck = () => {
      const {
        campaignId,
        allInvestigators,
      } = this.props;
      const passProps: MyDecksSelectorProps = {
        campaignId: campaignId,
        selectedInvestigatorIds: map(allInvestigators, investigator => investigator.code),
        onDeckSelect: this._deckAdded,
        onInvestigatorSelect: this._investigatorAdded,
        simpleOptions: true,
      };
      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: 'Dialog.DeckSelector',
              passProps,
              options: {
                modalPresentationStyle: Platform.OS === 'ios' ?
                  OptionsModalPresentationStyle.overFullScreen :
                  OptionsModalPresentationStyle.overCurrentContext,
              },
            },
          }],
        },
      });
    };

    _addInvestigator = (
      code: string,
      deckId?: number
    ) => {
      const {
        addInvestigator,
        campaignId,
      } = this.props;
      addInvestigator(campaignId, code, deckId);
    };

    _startScenario = (
      scenarioId: string
    ) => {
      const {
        startScenario,
        campaignId,
      } = this.props;
      startScenario(campaignId, scenarioId);
    };
    _setScenarioDecision = (
      stepId: string,
      value: boolean,
      scenarioId?: string
    ) => {
      const {
        setScenarioDecision,
        campaignId,
      } = this.props;
      setScenarioDecision(
        campaignId,
        stepId,
        value,
        scenarioId
      );
    };

    _setScenarioCount = (
      stepId: string,
      value: number,
      scenarioId?: string
    ) => {
      const {
        setScenarioCount,
        campaignId,
      } = this.props;
      setScenarioCount(
        campaignId,
        stepId,
        value,
        scenarioId
      );
    };

    _setSupplies = (
      stepId: string,
      supplyCounts: SupplyCounts,
      scenarioId?: string
    ) => {
      const {
        setScenarioSupplies,
        campaignId,
      } = this.props;
      setScenarioSupplies(
        campaignId,
        stepId,
        supplyCounts,
        scenarioId
      );
    };

    _setChoiceList = (
      stepId: string,
      choices: ListChoices,
      scenarioId?: string
    ) => {
      const {
        setScenarioChoiceList,
        campaignId,
      } = this.props;
      setScenarioChoiceList(
        campaignId,
        stepId,
        choices,
        scenarioId
      );
    };

    _setChoice = (
      stepId: string,
      choice: number,
      scenarioId?: string
    ) => {
      const {
        setScenarioChoice,
        campaignId,
      } = this.props;
      setScenarioChoice(
        campaignId,
        stepId,
        choice,
        scenarioId
      );
    };

    _undo = (scenarioId: string) => {
      const {
        undo,
        campaignId,
      } = this.props;
      undo(campaignId, scenarioId);
    };

    _resetScenario = (scenarioId: string) => {
      const {
        resetScenario,
        campaignId,
      } = this.props;
      resetScenario(campaignId, scenarioId);
    }

    render() {
      const {
        campaign,
        campaignState,
        allInvestigators,
        latestDecks,
      } = this.props;
      if (campaign === undefined) {
        return <Text>Unknown Campaign</Text>;
      }
      const decksByInvestigator: {
        [code: string]: Deck | undefined;
      } = {};
      forEach(latestDecks, deck => {
        if (deck && deck.investigator_code) {
          decksByInvestigator[deck.investigator_code] = deck
        }
      });
      const campaignStateHelper = new CampaignStateHelper(
        campaignState,
        {
          showChooseDeck: this._showChooseDeck,
          addInvestigator: this._addInvestigator,
          startScenario: this._startScenario,
          setCount: this._setScenarioCount,
          setDecision: this._setScenarioDecision,
          setSupplies: this._setSupplies,
          setChoiceList: this._setChoiceList,
          setChoice: this._setChoice,
          resetScenario: this._resetScenario,
          undo: this._undo,
        }
      );
      const campaignGuide = getCampaignGuide(campaign.cycleCode);
      if (!campaignGuide) {
        return <Text>Unknown Campaign Guide</Text>;
      }
      const context: CampaignGuideContextType = {
        // @ts-ignore TS2322
        campaign,
        campaignGuide,
        campaignState: campaignStateHelper,
        campaignInvestigators: allInvestigators,
        latestDecks: decksByInvestigator,
      };
      return (
        <CampaignGuideContext.Provider value={context}>
          <WrappedComponent
            {...this.props as Props}
            campaign={campaign as SingleCampaign}
            campaignGuide={campaignGuide}
            campaignState={campaignStateHelper}
            campaignInvestigators={allInvestigators}
            latestDecks={decksByInvestigator}
          />
        </CampaignGuideContext.Provider>
      );
    }
  }
  const result =
  withPlayerCards<Props & CampaignGuideContextType & CampaignGuideInputProps>(
    connect<ReduxProps, ReduxActionProps, Props & CampaignGuideInputProps & PlayerCardProps, AppState>(
      mapStateToProps,
      mapDispatchToProps
    )(
      // @ts-ignore TS2345
      CampaignDataComponent
    )
  );
  hoistNonReactStatic(result, WrappedComponent);
  return result as React.ComponentType<Props & CampaignGuideInputProps>;
}

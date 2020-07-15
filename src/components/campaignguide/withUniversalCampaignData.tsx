import React from 'react';
import { Platform } from 'react-native';
import { map } from 'lodash';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, Action } from 'redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import { MyDecksSelectorProps } from '@components/campaign/MyDecksSelectorDialog';
import {
  addInvestigator,
  removeInvestigator,
  deleteCampaign,
} from '@components/campaign/actions';
import {
  startScenario,
  startSideScenario,
  resetScenario,
  setScenarioCount,
  setScenarioDecision,
  setScenarioChoice,
  setScenarioSupplies,
  setScenarioNumberChoices,
  setScenarioStringChoices,
  setScenarioText,
  setCampaignLink,
  undo,
} from '@components/campaignguide/actions';
import {
  Deck,
  NumberChoices,
  StringChoices,
  SupplyCounts,
  GuideStartSideScenarioInput,
  GuideStartCustomSideScenarioInput,
} from 'actions/types';
import Card from '@data/Card';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import {
  AppState,
} from '@reducers';

interface ReduxProps {}

interface ReduxActionProps {
  deleteCampaign: (campaignId: number) => void;
  addInvestigator: (campaignId: number, investigator: string, deckId?: number) => void;
  removeInvestigator: (campaignId: number, investigator: string, deckId?: number) => void;
  startScenario: (campaignId: number, scenarioId: string) => void;
  startSideScenario: (
    campaignId: number,
    scenario: GuideStartSideScenarioInput | GuideStartCustomSideScenarioInput
  ) => void;
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
  setCampaignLink: (
    campaignId: number,
    stepId: string,
    value: string,
    scenarioId?: string
  ) => void;
  setScenarioSupplies: (
    campaignId: number,
    stepId: string,
    supplyCounts: SupplyCounts,
    scenarioId?: string
  ) => void;
  setScenarioStringChoices: (
    campaignId: number,
    stepId: string,
    choices: StringChoices,
    scenarioId?: string
  ) => void;
  setScenarioNumberChoices: (
    campaignId: number,
    stepId: string,
    supplyCounts: NumberChoices,
    scenarioId?: string
  ) => void;
  setScenarioChoice: (
    campaignId: number,
    stepId: string,
    choice: number,
    scenarioId?: string
  ) => void;
  setScenarioText: (
    campaignId: number,
    stepId: string,
    text: string,
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

interface UniversalActionsProps {
  showChooseDeck: (
    campaignId: number,
    campaignInvestigators: Card[],
    singleInvestigator?: Card,
    callback?: (code: string) => void
  ) => void;
}

export type UniversalCampaignProps = ReduxProps & ReduxActionProps & PlayerCardProps & UniversalActionsProps;

export default function withUniversalCampaignData<Props>(
  WrappedComponent: React.ComponentType<Props & UniversalCampaignProps & UniversalActionsProps>
): React.ComponentType<Props> {
  const mapStateToProps = (): ReduxProps => {
    return {};
  };
  const mapDispatchToProps = (
    dispatch: Dispatch<Action>
  ): ReduxActionProps => {
    return bindActionCreators({
      addInvestigator,
      removeInvestigator,
      deleteCampaign,
      startScenario,
      startSideScenario,
      setScenarioCount,
      setScenarioDecision,
      setScenarioSupplies,
      setScenarioNumberChoices,
      setScenarioStringChoices,
      resetScenario,
      setScenarioChoice,
      setScenarioText,
      setCampaignLink,
      undo,
    }, dispatch);
  };

  class UniversalCampaignDataComponent extends React.Component<
    Props &
    PlayerCardProps &
    ReduxActionProps
  > {
    _showChooseDeck = (
      campaignId: number,
      campaignInvestigators: Card[],
      singleInvestigator?: Card,
      callback?: (code: string) => void
    ) => {
      const onDeckSelect = (deck: Deck) => {
        this._addInvestigator(campaignId, deck.investigator_code, deck.id);
        callback && callback(deck.investigator_code);
      };
      const passProps: MyDecksSelectorProps = singleInvestigator ? {
        campaignId: campaignId,
        singleInvestigator: singleInvestigator.code,
        onDeckSelect,
      } : {
        campaignId: campaignId,
        selectedInvestigatorIds: map(
          campaignInvestigators,
          investigator => investigator.code
        ),
        onDeckSelect,
        onInvestigatorSelect: (card: Card) => {
          this._addInvestigator(campaignId, card.code);
          callback && callback(card.code);
        },
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
      campaignId: number,
      code: string,
      deckId?: number
    ) => {
      const {
        addInvestigator,
      } = this.props;
      addInvestigator(campaignId, code, deckId);
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          showChooseDeck={this._showChooseDeck}
        />
      );
    }
  }
  const result = withPlayerCards<Props>(
    connect<ReduxProps, ReduxActionProps, Props & PlayerCardProps, AppState>(
      mapStateToProps,
      mapDispatchToProps
    )(
      // @ts-ignore TS2345
      UniversalCampaignDataComponent
    )
  );
  hoistNonReactStatic(result, WrappedComponent);
  return result;
}

import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { forEach, keys, map, values } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { StringChoices, WeaknessSet } from 'actions/types';
import Card, { CardsMap } from '@data/Card';
import { drawWeakness } from 'lib/weaknessHelper';
import InvestigatorButton from '@components/core/InvestigatorButton';
import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import COLORS from '@styles/colors';

interface OwnProps {
  id: string;
  investigators: Card[];
  cards: CardsMap;
  weaknessCards: Card[];
  traits: string[];
  realTraits: boolean;
  campaignLog: GuidedCampaignLog;
  scenarioState: ScenarioStateHelper;
}

interface State {
  choices: {
    [code: string]: string;
  };
}

type Props = OwnProps;

export default class DrawRandomWeaknessComponent extends React.Component<Props, State> {
  static contextType = CampaignGuideContext;
  context!: CampaignGuideContextType;

  state: State = {
    choices: {},
  };

  effectiveWeaknessSet(): WeaknessSet {
    const { cards, campaignLog } = this.props;
    const {
      campaignInvestigators,
      latestDecks,
      weaknessSet,
    } = this.context;
    const { choices } = this.state;
    return campaignLog.effectiveWeaknessSet(
      campaignInvestigators,
      latestDecks,
      weaknessSet,
      cards,
      values(choices)
    );
  }

  _drawRandomWeakness = (
    code: string
  ) => {
    const { weaknessCards, traits, campaignLog, realTraits } = this.props;
    const weaknessSet = this.effectiveWeaknessSet();
    const card = drawWeakness(
      weaknessSet,
      weaknessCards,
      {
        traits,
        multiplayer: campaignLog.playerCount() > 1,
        standalone: false,
      },
      realTraits
    );
    if (!card) {
      Alert.alert(t`All weaknesses have been assigned.`);
    } else {
      this.setState({
        choices: {
          ...this.state.choices,
          [code]: card.code,
        },
      });
    }
  };

  _save = () => {
    const { id, scenarioState } = this.props;
    const choices: StringChoices = {};
    forEach(this.state.choices, (card, code) => {
      choices[code] = [card];
    });
    scenarioState.setStringChoices(`${id}_weakness`, choices);
  };

  renderSaveButton(choices?: StringChoices) {
    const { investigators } = this.props;
    if (choices !== undefined) {
      return null;
    }
    return (
      <BasicButton
        disabled={keys(this.state.choices).length !== investigators.length}
        onPress={this._save}
        title={t`Proceed`}
      />
    );
  }

  render() {
    const { id, investigators, cards, scenarioState } = this.props;
    const choices = scenarioState.stringChoices(`${id}_weakness`);
    return (
      <>
        <View style={styles.wrapper}>
          { map(investigators, investigator => {
            const choice = choices !== undefined ? choices[investigator.code][0] :
              this.state.choices[investigator.code];
            const choiceCard = choice ? cards[choice] : undefined;
            return (
              <InvestigatorButton
                key={investigator.code}
                investigator={investigator}
                value={choice === undefined ?
                  t`Draw random weakness` :
                  (choiceCard?.name || 'Missing Card')
                }
                onPress={this._drawRandomWeakness}
                disabled={choice !== undefined}
                widget="shuffle"
              />
            );
          }) }
        </View>
        { this.renderSaveButton(choices) }
      </>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
});

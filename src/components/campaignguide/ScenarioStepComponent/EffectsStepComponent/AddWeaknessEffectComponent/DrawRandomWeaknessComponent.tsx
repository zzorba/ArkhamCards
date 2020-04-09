import React from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';
import { forEach, keys, map } from 'lodash';
import { t } from 'ttag';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { StringChoices, Slots, WeaknessSet } from 'actions/types';
import Card from 'data/Card';
import { drawWeakness } from 'lib/weaknessHelper';
import withWeaknessCards, { WeaknessCardProps } from 'components/weakness/withWeaknessCards';
import InvestigatorButton from 'components/campaignguide/prompts/InvestigatorButton';
import CampaignGuideContext, { CampaignGuideContextType } from 'components/campaignguide/CampaignGuideContext';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';

interface OwnProps {
  id: string;
  investigators: Card[];
  traits: string[];
  campaignLog: GuidedCampaignLog;
  scenarioState: ScenarioStateHelper;
}

interface State {
  choices: {
    [code: string]: string;
  };
}

type Props = WeaknessCardProps & OwnProps;

class DrawRandomWeaknessComponent extends React.Component<Props, State> {
  static contextType = CampaignGuideContext;
  context!: CampaignGuideContextType;

  state: State = {
    choices: {},
  };

  effectiveWeaknessSet(): WeaknessSet {
    const { cardsMap, campaignLog } = this.props;
    const {
      campaignInvestigators,
      latestDecks,
      weaknessSet,
    } = this.context;
    const { choices } = this.state;
    const assignedCards: Slots = {};
    forEach(campaignInvestigators, investigator => {
      const deck = latestDecks[investigator.code];
      if (deck) {
        forEach(deck.slots, (count, code) => {
          if (cardsMap[code]) {
            assignedCards[code] = (assignedCards[code] || 0) + count;
          }
        });
        forEach(deck.ignoreDeckLimitSlots, (count, code) => {
          if (cardsMap[code]) {
            assignedCards[code] = (assignedCards[code] || 0) + count;
          }
        });
      }
      const storyAssets = campaignLog.storyAssets(investigator.code);
      forEach(storyAssets, (count, code) => {
        if (cardsMap[code]) {
          assignedCards[code] = (assignedCards[code] || 0) + count;
        }
      });

      const ignoreStoryAssets = campaignLog.ignoreStoryAssets(investigator.code);
      forEach(ignoreStoryAssets, (count, code) => {
        if (cardsMap[code]) {
          assignedCards[code] = (assignedCards[code] || 0) + count;
        }
      });

      const assignedWeakness = choices[investigator.code];
      if (assignedWeakness) {
        assignedCards[assignedWeakness] = (assignedCards[assignedWeakness] || 0) + 1;
      }
    });

    return {
      ...weaknessSet,
      assignedCards,
    };
  }

  _drawRandomWeakness = (
    code: string
  ) => {
    const { cards, traits, campaignLog } = this.props;
    const weaknessSet = this.effectiveWeaknessSet();
    const card = drawWeakness(weaknessSet, cards, {
      traits,
      multiplayer: campaignLog.playerCount() > 0,
      standalone: false,
    });
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
      <View style={styles.buttonWrapper}>
        <Button
          disabled={keys(this.state.choices).length !== investigators.length}
          onPress={this._save}
          title={t`Proceed`}
        />
      </View>
    );
  }

  render() {
    const { id, investigators, cardsMap, scenarioState } = this.props;
    const choices = scenarioState.stringChoices(`${id}_weakness`);
    return (
      <>
        { map(investigators, investigator => {
          const choice = choices !== undefined ? choices[investigator.code][0] :
            this.state.choices[investigator.code];
          return (
            <InvestigatorButton
              key={investigator.code}
              investigator={investigator}
              value={choice === undefined ?
                t`Draw random weakness` :
                cardsMap[choice].name
              }
              onPress={this._drawRandomWeakness}
              disabled={choice !== undefined}
              widget={(
                <View style={styles.shuffleIcon}>
                  <MaterialCommunityIcons
                    name="shuffle-variant"
                    size={24}
                    color="#000"
                  />
                </View>
              )}
            />
          );
        }) }
        { this.renderSaveButton(choices) }
      </>
    );
  }
}

export default withWeaknessCards<OwnProps>(
  DrawRandomWeaknessComponent
);

const styles = StyleSheet.create({
  shuffleIcon: {
    marginRight: 8,
  },
  buttonWrapper: {
    padding: 8,
  },
});

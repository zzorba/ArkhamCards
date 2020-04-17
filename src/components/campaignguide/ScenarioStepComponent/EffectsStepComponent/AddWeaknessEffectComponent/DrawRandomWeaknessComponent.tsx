import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { forEach, keys, map, values } from 'lodash';
import { t } from 'ttag';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import BasicButton from 'components/core/BasicButton';
import { StringChoices, WeaknessSet } from 'actions/types';
import Card from 'data/Card';
import { drawWeakness } from 'lib/weaknessHelper';
import { WeaknessCardProps } from 'components/weakness/withWeaknessCards';
import InvestigatorButton from 'components/campaignguide/prompts/InvestigatorButton';
import CampaignGuideContext, { CampaignGuideContextType } from 'components/campaignguide/CampaignGuideContext';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import space from 'styles/space';

interface OwnProps extends WeaknessCardProps {
  id: string;
  investigators: Card[];
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

type Props = WeaknessCardProps & OwnProps;

export default class DrawRandomWeaknessComponent extends React.Component<Props, State> {
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
    return campaignLog.effectiveWeaknessSet(
      campaignInvestigators,
      latestDecks,
      weaknessSet,
      cardsMap,
      values(choices)
    );
  }

  _drawRandomWeakness = (
    code: string
  ) => {
    const { cards, traits, campaignLog, realTraits } = this.props;
    const weaknessSet = this.effectiveWeaknessSet();
    const card = drawWeakness(
      weaknessSet,
      cards,
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
    const { id, investigators, cardsMap, scenarioState } = this.props;
    const choices = scenarioState.stringChoices(`${id}_weakness`);
    return (
      <>
        <View style={styles.wrapper}>
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
                  <View style={space.marginRightS}>
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
        </View>
        { this.renderSaveButton(choices) }
      </>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
  },
});

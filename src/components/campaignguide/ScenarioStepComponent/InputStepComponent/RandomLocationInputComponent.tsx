import React from 'react';
import { StyleSheet, View } from 'react-native';
import { filter, flatMap, map, throttle, shuffle } from 'lodash';
import { t } from 'ttag';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import BasicButton from 'components/core/BasicButton';
import CardSearchResult from 'components/cardlist/CardSearchResult';
import CardListWrapper from 'components/card/CardListWrapper';
import PickerStyleButton from 'components/core/PickerStyleButton';
import Card from 'data/Card';
import { RandomLocationInput } from 'data/scenario/types';
import ScenarioStepContext, { ScenarioStepContextType } from 'components/campaignguide/ScenarioStepContext';
import space, { m, l } from 'styles/space';

interface Props {
  input: RandomLocationInput;
  fontScale: number;
}

interface State {
  choices: number[];
}

export default class RandomLocationInputComponent extends React.Component<Props, State>{
  static contextType = ScenarioStepContext;
  context!: ScenarioStepContextType;

  _done: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      choices: [],
    };

    this._done = throttle(this.done.bind(this), 500);
  }

  done() {
    this.context.scenarioState.undo();
  }

  _drawLocation = () => {
    const { input } = this.props;
    this.setState((state: State) => {
      if (input.multiple) {
        const existingChoices = new Set(state.choices);
        const remainingCards = filter(
          map(input.cards, (card, idx) => idx),
          idx => !existingChoices.has(idx)
        );
        if (!remainingCards.length) {
          return {
            choices: state.choices,
          };
        }
        return {
          choices: [
            ...state.choices,
            shuffle(remainingCards)[0],
          ],
        };
      }
      return {
        choices: state.choices.length ? [] : [
          Math.floor(Math.random() * input.cards.length),
        ],
      };
    });
  };

  _clearLocations = () => {
    this.setState({
      choices: [],
    });
  };

  _renderCards = (cards: Card[]) => {
    const { input, fontScale } = this.props;
    const { choices } = this.state;

    const selectedCards = flatMap(choices, idx => cards[idx]);
    if (!input.multiple) {
      return (
        <View style={styles.wrapper}>
          <PickerStyleButton
            id="single"
            title={t`Random location`}
            value={selectedCards.length ?
              selectedCards[0].name :
              ''
            }
            onPress={this._drawLocation}
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
        </View>
      );
    }
    return (
      <>
        <BasicButton
          title={t`Draw location`}
          disabled={selectedCards.length >= cards.length}
          onPress={this._drawLocation}
        />
        <BasicButton
          title={t`Reshuffle`}
          disabled={choices.length === 0}
          onPress={this._clearLocations}
        />
        <View style={selectedCards.length ? styles.wrapper : {}}>
          { map(selectedCards, card => (
            <CardSearchResult
              key={card.code}
              card={card}
              fontScale={fontScale}
            />
          )) }
        </View>
      </>
    );
  };

  render() {
    const { input } = this.props;
    return (
      <View style={styles.container}>
        <CardListWrapper
          cards={input.cards}
          extraArg={undefined}
        >
          { this._renderCards }
        </CardListWrapper>
        <BasicButton
          title={t`Done`}
          onPress={this._done}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
  },
  container: {
    marginTop: m,
    marginBottom: l * 3,
  },
});

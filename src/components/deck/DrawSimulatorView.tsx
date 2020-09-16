import React from 'react';
import { concat, filter, flatMap, map, shuffle, range, without } from 'lodash';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from 'react-native-elements';
import { c, t } from 'ttag';

import { Slots } from '@actions/types';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import CardSearchResult from '../cardlist/CardSearchResult';
import { s, xs } from '@styles/space';
import COLORS from '@styles/colors';

export interface DrawSimulatorProps {
  slots: Slots;
}

type Props = DrawSimulatorProps &
  PlayerCardProps;

interface State {
  shuffledDeck: string[];
  drawnCards: string[];
  selectedCards: string[];
}

interface Item {
  key: string;
  code: string;
  selected: boolean;
}

class DrawSimulatorView extends React.Component<Props, State> {
  _drawOne = this.draw.bind(this, 1);
  _drawTwo = this.draw.bind(this, 2);
  _drawFive = this.draw.bind(this, 5);
  _drawAll = this.draw.bind(this, 'all');

  constructor(props: Props) {
    super(props);

    this.state = {
      shuffledDeck: this.shuffleFreshDeck(),
      drawnCards: [],
      selectedCards: [],
    };
  }

  _resetDeck = () => {
    this.setState({
      shuffledDeck: this.shuffleFreshDeck(),
      drawnCards: [],
      selectedCards: [],
    });
  };

  _reshuffleSelected = () => {
    const {
      shuffledDeck,
      selectedCards,
      drawnCards,
    } = this.state;

    const selectedSet = new Set(selectedCards);
    const newDrawnCards = filter(drawnCards, key => !selectedSet.has(key));
    this.setState({
      shuffledDeck: shuffle(concat(shuffledDeck, selectedCards)),
      drawnCards: newDrawnCards,
      selectedCards: [],
    });
  };

  _redrawSelected = () => {
    const {
      selectedCards,
    } = this.state;
    const {
      drawnCards,
      shuffledDeck,
    } = this.drawHelper(selectedCards.length);

    const selectedSet = new Set(selectedCards);
    const newDrawnCards = filter(drawnCards, key => !selectedSet.has(key));
    this.setState({
      shuffledDeck: shuffle(concat(shuffledDeck, selectedCards)),
      drawnCards: newDrawnCards,
      selectedCards: [],
    });
  };

  drawHelper(count: number | 'all') {
    const {
      drawnCards,
      shuffledDeck,
    } = this.state;
    if (count === 'all') {
      return {
        drawnCards: [
          ...shuffledDeck,
          ...drawnCards,
        ],
        shuffledDeck: [],
      };
    }

    return {
      drawnCards: [
        ...shuffledDeck.slice(0, count),
        ...drawnCards,
      ],
      shuffledDeck: shuffledDeck.slice(count),
    };
  }

  draw(count: number | 'all') {
    this.setState(this.drawHelper(count));
  }

  shuffleFreshDeck() {
    const {
      cards,
      slots,
    } = this.props;
    return shuffle(
      flatMap(
        Object.keys(slots),
        cardId => {
          const card = cards[cardId];
          if (!card) {
            return [];
          }
          // DUKE=02014
          if (card.permanent || card.double_sided || card.code === '02014') {
            return [];
          }
          return map(range(0, slots[cardId]), copy => `${cardId}-${copy}`);
        }));
  }

  _toggleSelection = (id: string) => {
    const {
      selectedCards,
    } = this.state;
    if (selectedCards.indexOf(id) !== -1) {
      this.setState({
        selectedCards: without(selectedCards, id),
      });
    } else {
      this.setState({
        selectedCards: [
          ...selectedCards,
          id,
        ],
      });
    }
  };

  _renderHeader = () => {
    const {
      shuffledDeck,
      drawnCards,
      selectedCards,
    } = this.state;
    const deckEmpty = shuffledDeck.length === 0;
    const noSelection = selectedCards.length === 0;
    return (
      <View style={styles.controlsContainer}>
        <View style={styles.drawButtonRow}>
          <Text style={styles.text}>{ t`Draw: ` }</Text>
          <View style={styles.buttonContainer}>
            <Button
              title="1"
              disabled={deckEmpty}
              onPress={this._drawOne}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="2"
              disabled={deckEmpty}
              onPress={this._drawTwo}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="5"
              disabled={deckEmpty}
              onPress={this._drawFive}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={c('Draw Cards').t`All`}
              disabled={deckEmpty}
              onPress={this._drawAll}
            />
          </View>
        </View>
        <View style={styles.wrapButtonRow}>
          <View style={styles.buttonContainer}>
            <Button
              title={t`Redraw`}
              disabled={noSelection}
              onPress={this._redrawSelected} />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={t`Reshuffle`}
              disabled={noSelection}
              onPress={this._reshuffleSelected} />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={t`Reset`}
              disabled={drawnCards.length === 0}
              onPress={this._resetDeck} />
          </View>
        </View>
      </View>
    );
  };

  _renderCardItem = ({ item }: { item: Item }) => {
    const card = this.props.cards[item.code];
    if (!card) {
      return null;
    }
    return (
      <CardSearchResult
        key={item.key}
        id={item.key}
        card={card}
        onPressId={this._toggleSelection}
        backgroundColor={item.selected ? COLORS.veryLightBackground : undefined}
      />
    );
  };

  render() {
    const {
      drawnCards,
      selectedCards,
    } = this.state;
    const selectedSet = new Set(selectedCards);
    const data = map(drawnCards, cardKey => {
      const parts = cardKey.split('-');
      return {
        key: cardKey,
        code: parts[0],
        selected: selectedSet.has(cardKey),
      };
    });
    return (
      <View style={styles.container}>
        { this._renderHeader() }
        <FlatList
          data={data}
          renderItem={this._renderCardItem}
        />
      </View>
    );
  }
}

export default withPlayerCards<DrawSimulatorProps>(DrawSimulatorView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.background,
  },
  controlsContainer: {
    flexDirection: 'column',
  },
  drawButtonRow: {
    width: '100%',
    paddingTop: xs,
    paddingBottom: xs,
    paddingLeft: s,
    paddingRight: s,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.veryVeryLightBackground,
  },
  wrapButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.veryVeryLightBackground,
    flexWrap: 'wrap',
  },
  text: {
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: 22,
    color: COLORS.darkText,
  },
  buttonContainer: {
    flex: 1,
    padding: s,
  },
});

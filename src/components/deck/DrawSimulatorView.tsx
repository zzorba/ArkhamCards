import React from 'react';
import { concat, filter, flatMap, map, shuffle, range, without } from 'lodash';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { t } from 'ttag';
import { Slots } from 'actions/types';
import withPlayerCards, { PlayerCardProps } from 'components/core/withPlayerCards';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import CardSearchResult from '../cardlist/CardSearchResult';
import { xs } from 'styles/space';

export interface DrawSimulatorProps {
  slots: Slots;
}

type Props = DrawSimulatorProps &
  PlayerCardProps &
  DimensionsProps;

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
          <View style={styles.button}>
            <Button title="1" disabled={deckEmpty} onPress={this._drawOne} />
          </View>
          <View style={styles.button}>
            <Button title="2" disabled={deckEmpty} onPress={this._drawTwo} />
          </View>
          <View style={styles.button}>
            <Button title="5" disabled={deckEmpty} onPress={this._drawFive} />
          </View>
          <View style={styles.button}>
            <Button title={t`All`} disabled={deckEmpty} onPress={this._drawAll} />
          </View>
        </View>
        <View style={styles.wrapButtonRow}>
          <View style={styles.button}>
            <Button
              title={t`Redraw`}
              disabled={noSelection}
              onPress={this._redrawSelected} />
          </View>
          <View style={styles.button}>
            <Button
              title={t`Reshuffle`}
              disabled={noSelection}
              onPress={this._reshuffleSelected} />
          </View>
          <View style={styles.button}>
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
    const { fontScale } = this.props;
    const card = this.props.cards[item.code];
    return (
      <CardSearchResult
        key={item.key}
        id={item.key}
        card={card}
        onPressId={this._toggleSelection}
        fontScale={fontScale}
        backgroundColor={item.selected ? '#ddd' : undefined}
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

export default withPlayerCards<DrawSimulatorProps>(
  withDimensions(DrawSimulatorView)
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  controlsContainer: {
    flexDirection: 'column',
  },
  drawButtonRow: {
    width: '100%',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f6f6f6',
  },
  wrapButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f6f6f6',
    flexWrap: 'wrap',
  },
  text: {
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: 22,
  },
  button: {
    flex: 1,
    marginLeft: xs,
    marginRight: xs,
  },
});

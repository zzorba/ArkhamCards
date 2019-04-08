import React from 'react';
import { concat, filter, flatMap, map, shuffle, range, without } from 'lodash';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import L from '../../app/i18n';
import { Slots } from '../../actions/types';
import withPlayerCards, { PlayerCardProps } from '../withPlayerCards';
import CardSearchResult from '../CardSearchResult';


interface OwnProps {
  slots: Slots;
}

type Props = OwnProps & PlayerCardProps;

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
  _drawOne!: () => void;
  _drawTwo!: () => void;
  _drawFive!: () => void;
  _drawAll!: () => void;

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
          <Text style={styles.text}>{ L('Draw: ') }</Text>
          <Button title="1" disabled={deckEmpty} onPress={this._drawOne} />
          <Button title="2" disabled={deckEmpty} onPress={this._drawTwo} />
          <Button title="5" disabled={deckEmpty} onPress={this._drawFive} />
          <Button title={L('All')} disabled={deckEmpty} onPress={this._drawAll} />
        </View>
        <View style={styles.wrapButtonRow}>
          <Button
            title={L('Redraw')}
            disabled={noSelection}
            onPress={this._redrawSelected} />
          <Button
            title={L('Reshuffle')}
            disabled={noSelection}
            onPress={this._reshuffleSelected} />
          <Button
            title={L('Reset')}
            disabled={drawnCards.length === 0}
            onPress={this._resetDeck} />
        </View>
      </View>
    );
  };

  _renderCardItem = ({ item }: { item: Item }) => {
    const card = this.props.cards[item.code];
    return (
      <View style={item.selected ? styles.selected : {}}>
        <CardSearchResult
          id={item.key}
          card={card}
          onPressId={this._toggleSelection}
        />
      </View>
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

export default withPlayerCards(DrawSimulatorView);

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
  selected: {
    backgroundColor: '#ddd',
  },
});

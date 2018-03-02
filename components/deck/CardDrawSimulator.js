import React from 'react';
import PropTypes from 'prop-types';
import { concat, flatMap, map, pullAt, shuffle, range, without } from 'lodash';
const {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = require('react-native');
import { Circle as ProgressCircle } from 'react-native-progress';
import ArkhamIcon from '../../assets/ArkhamIcon';

import { DeckType } from './parseDeck';

export default class CardDrawSimulator extends React.Component {
  static propTypes = {
    parsedDeck: DeckType,
    cards: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      shuffledDeck: this.shuffleFreshDeck(),
      drawnCards: [],
      selectedCards: [],
    };

    this._drawOne = this.draw.bind(this, 1);
    this._drawTwo = this.draw.bind(this, 2);
    this._drawFive = this.draw.bind(this, 5);
    this._drawAll = this.draw.bind(this, 'all');

    this._resetDeck = this.resetDeck.bind(this);
    this._redrawSelected = this.redrawSelected.bind(this);
    this._reshuffleSelected = this.reshuffleSelected.bind(this);
  }

  resetDeck() {
    this.setState({
      shuffledDeck: this.shuffleFreshDeck(),
      drawnCards: [],
      selectedCards: [],
    });
  }

  reshuffleSelected(callback) {
    const {
      shuffledDeck,
      selectedCards,
      drawnCards,
    } = this.state;

    const selectedIndexes = map(selectedCards, key => key.split('-')[0]);
    const selectedCardIds = map(selectedCards, key => key.split('-')[1]);

    const newDrawnCards = drawnCards.slice();
    pullAt(newDrawnCards, selectedIndexes);
    this.setState({
      shuffledDeck: shuffle(concat(shuffledDeck, selectedCardIds)),
      drawnCards: newDrawnCards,
      selectedCards: [],
    });
  }

  redrawSelected() {
    const {
      selectedCards,
    } = this.state;
    const {
      drawnCards,
      shuffledDeck,
    } = this.drawHelper(selectedCards.length);

    const selectedIndexes = map(selectedCards, key => key.split('-')[0]);
    const selectedCardIds = map(selectedCards, key => key.split('-')[1]);

    const newDrawnCards = drawnCards.slice();
    pullAt(newDrawnCards, selectedIndexes);
    this.setState({
      shuffledDeck: shuffle(concat(shuffledDeck, selectedCardIds)),
      drawnCards: newDrawnCards,
      selectedCards: [],
    });
  }

  drawHelper(count) {
    const {
      drawnCards,
      shuffledDeck,
    } = this.state;
    if (count === 'all') {
      return {
        drawnCards: [
          ...drawnCards,
          ...shuffledDeck,
        ],
        shuffledDeck: [],
      };
    }

    return {
      drawnCards: [
        ...drawnCards,
        ...shuffledDeck.splice(0, count),
      ],
      shuffledDeck: shuffledDeck.splice(count),
    };
  }

  draw(count) {
    this.setState(this.drawHelper(count));
  }

  shuffleFreshDeck() {
    const {
      cards,
      parsedDeck: {
        deck,
      },
    } = this.props;
    return shuffle(
      flatMap(
        Object.keys(deck.slots),
        cardId => {
          const card = cards[cardId];
          if (card.permanent) {
            return [];
          }
          return range(0, deck.slots[cardId]).map(() => cardId)
        }));
  }

  toggleSelection(id) {
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
  }

  render() {
    const {
      cards,
    } = this.props;
    const {
      drawnCards,
      selectedCards,
    } = this.state;

    const noSelection = selectedCards.length === 0;
    return (
      <ScrollView>
        <View style={styles.drawButtonRow}>
          <Text>Draw: </Text>
          <Button title="1" onPress={this._drawOne} />
          <Button title="2" onPress={this._drawTwo} />
          <Button title="5" onPress={this._drawFive} />
          <Button title="All" onPress={this._drawAll} />
        </View>
        <View style={styles.wrapButtonRow}>
          <Button title="Redraw Selected" disabled={noSelection} onPress={this._redrawSelected} />
          <Button title="Reshuffle Selected" disabled={noSelection} onPress={this._reshuffleSelected} />
          <Button title="Reset" disabled={drawnCards.length === 0} onPress={this._resetDeck} />
        </View>
        <View style={styles.deckContainer}>
          { map(drawnCards, (cardId, idx) => {
              const card = cards[cardId];
              const key = `${idx}-${cardId}`;
              const selected = selectedCards.indexOf(key) !== -1;
              return (
                <TouchableHighlight
                  key={key}
                  onPress={() => this.toggleSelection(key)}
                  style={
                    selected ? styles.selectedCardWrapper : styles.cardWrapper
                  }
                >
                  { card.code === '01000' ?
                    <View style={styles.randomBasicWeakness}>
                      <ArkhamIcon name="weakness" size={100} color="#000000" />
                    </View>
                    :
                    <Image
                      style={styles.drawnCard}
                      source={{
                        uri: `https://arkhamdb.com${card.imagesrc}`,
                      }}
                    />
                  }
                </TouchableHighlight>
              );
            })
          }
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  drawButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f6f6f6',
  },
  wrapButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f6f6f6',
    flexWrap: 'wrap',
  },
  deckContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardWrapper: {
    margin: 1,
  },
  randomBasicWeakness: {
    width: 98,
    height: 136,
    backgroundColor: '#D6D6D6',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
  },
  selectedCardWrapper: {
    backgroundColor: 'red',
    margin: 1,
  },
  drawnCard: {
    width: 98,
    height: 136,
    margin: 3,
  },
});

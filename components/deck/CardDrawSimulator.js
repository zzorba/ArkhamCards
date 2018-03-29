import React from 'react';
import PropTypes from 'prop-types';
import { concat, flatMap, map, pullAt, shuffle, range, without } from 'lodash';
import {
  Button,
  StyleSheet,
  Text,
  SectionList,
  View,
} from 'react-native';

import { DeckType } from './parseDeck';
import DrawCardItem from './DrawCardItem';

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

    this._toggleSelection = this.toggleSelection.bind(this);
    this._renderHeader = this.renderHeader.bind(this);
    this._renderCardItem = this.renderCardItem.bind(this);

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

  reshuffleSelected() {
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
          // DUKE=02014
          if (card.permanent || card.double_sided || card.code === '02014') {
            return [];
          }
          return range(0, deck.slots[cardId]).map(() => cardId);
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

  renderHeader() {
    const {
      shuffledDeck,
      drawnCards,
      selectedCards,
    } = this.state;
    const deckEmpty = shuffledDeck.length === 0;
    const noSelection = selectedCards.length === 0;
    return (
      <View>
        <View style={styles.drawButtonRow}>
          <Text>Draw: </Text>
          <Button title="1" disabled={deckEmpty} onPress={this._drawOne} />
          <Button title="2" disabled={deckEmpty} onPress={this._drawTwo} />
          <Button title="5" disabled={deckEmpty} onPress={this._drawFive} />
          <Button title="All" disabled={deckEmpty} onPress={this._drawAll} />
        </View>
        <View style={styles.wrapButtonRow}>
          <Button
            title="Redraw Selected"
            disabled={noSelection}
            onPress={this._redrawSelected} />
          <Button
            title="Reshuffle Selected"
            disabled={noSelection}
            onPress={this._reshuffleSelected} />
          <Button
            title="Reset"
            disabled={drawnCards.length === 0}
            onPress={this._resetDeck} />
        </View>
      </View>
    );
  }

  renderCardItem({ item, index }) {
    const card = this.props.cards[item.id];
    return (
      <DrawCardItem
        id={`${index}-${item.id}`}
        card={card}
        onPressItem={this._toggleSelection}
        selected={item.selected}
      />
    );
  }

  render() {
    const {
      drawnCards,
      selectedCards,
    } = this.state;

    const data = map(drawnCards, (cardId, idx) => {
      const key = `${idx}-${cardId}`;
      return {
        key,
        id: cardId,
        selected: selectedCards.indexOf(key) !== -1,
      };
    });
    return (
      <SectionList
        contentContainerStyle={styles.deckContainer}
        sections={[
          {
            data,
            title: 'na',
          },
        ]}
        renderItem={this._renderCardItem}
        renderSectionHeader={this._renderHeader}
        numColumns={3}
      />
    );
  }
}

const styles = StyleSheet.create({
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
});

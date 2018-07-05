import React from 'react';
import PropTypes from 'prop-types';
import { filter, forEach, keys, map, pullAt, sum, sortBy } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';
import { Button } from 'react-native-elements';

import ArkhamIcon from '../../assets/ArkhamIcon';
import DeckViewCardItem from './DeckViewCardItem';
import typography from '../../styles/typography';

class DeckDelta extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    cards: PropTypes.object,
    deck: PropTypes.object,
    changedCards: PropTypes.object.isRequired,
    exiledCards: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._showPreviousDeck = this.showPreviousDeck.bind(this);
    this._showNextDeck = this.showNextDeck.bind(this);
    this._showCard = this.showCard.bind(this);
  }

  showPreviousDeck() {
    const {
      navigator,
      deck,
    } = this.props;
    navigator.push({
      screen: 'Deck',
      passProps: {
        id: deck.previous_deck,
        isPrivate: true,
      },
      navigatorStyle: {
        tabBarHidden: true,
      },
    });
  }

  showNextDeck() {
    const {
      navigator,
      deck,
    } = this.props;
    navigator.push({
      screen: 'Deck',
      passProps: {
        id: deck.next_deck,
        isPrivate: true,
      },
      navigatorStyle: {
        tabBarHidden: true,
      },
    });
  }

  showCard(card) {
    this.props.navigator.push({
      screen: 'Card',
      passProps: {
        id: card.code,
        pack_code: card.pack_code,
      },
    });
  }

  renderXp() {
    const {
      cards,
      deck: {
        slots,
        xp,
      },
      changedCards,
      exiledCards,
    } = this.props;

    if (xp === null) {
      return null;
    }

    const exiledSlots = {};
    forEach(keys(exiledCards), code => {
      const card = cards[code];
      for (let i = exiledCards[code]; i < 0; i++) {
        exiledSlots.push(card);
      }
    });
    let adaptableUses = (slots['02110'] || 0) * 2;
    let arcaneResearchUses = (slots['04109'] || 0);

    const addedCards = [];
    const removedCards = [];
    forEach(keys(changedCards), code => {
      const card = cards[code];
      if (changedCards[code] < 0) {
        for (let i = changedCards[code]; i < 0; i++) {
          removedCards.push(card);
        }
      } else {
        for (let i = 0; i < changedCards[code]; i++) {
          addedCards.push(card);
        }
      }
    });

    const spentXp = sum(map(
      sortBy(
        // null cards are story assets, so putting them in is free.
        filter(addedCards, card => card.xp !== null),
        card => -card.xp
      ),
      addedCard => {
        // We visit cards from high XP to low XP, so if there's 0 XP card,
        // we've found matches for all the other cards already.
        // Only 0 XP cards are left.
        if (addedCard.xp === 0) {
          if (exiledSlots.length > 0) {
            // Every exiled card gives you one free '0' cost insert.
            pullAt(exiledSlots, [0]);
            return 0;
          }
          // You can use adaptable to swap in to level 0s.
          // Technically you have to take
          if (adaptableUses > 0) {
            for (let i = 0; i < removedCards.length; i++) {
              const removedCard = removedCards[i];
              if (removedCard.xp !== null && removedCard.xp === 0) {
                pullAt(removedCards, [i]);
                adaptableUses--;
                return 0;
              }
            }
            // Couldn't find a 0 cost card to remove, that's weird.
            return 1;
          }
          // But if there's no slots it costs you a minimum of 1 xp.
          return 1;
        }
        // XP higher than 0.
        // See if there's a lower version card that counts as an upgrade.
        // TODO: handle card 04109 (Arcane Research) and 04106 (Shrewd Analysis)
        for (let i = 0; i < removedCards.length; i++) {
          const removedCard = removedCards[i];
          if (addedCard.name === removedCard.name &&
              addedCard.xp > removedCard.xp) {

            pullAt(removedCards, [i]);

            // If you have unspent uses of arcaneResearchUses,
            // and its a spell, you get a 1 XP discount on first spell.
            if (arcaneResearchUses > 0 &&
              addedCard.traits_normalized.indexOf('#spell#') !== -1) {
              arcaneResearchUses--;
              return (addedCard.xp - removedCard.xp) - 1;
            }
            // Upgrade of the same name, so you only pay the delta.
            return (addedCard.xp - removedCard.xp);
          }
        }
        return addedCard.xp;
      }
    ));

    return (
      <View style={styles.xp}>
        <Text style={typography.text}>
          { `Available Experience: ${xp}\nSpent Experience: ${spentXp}` }
        </Text>
      </View>
    );
  }

  render() {
    const {
      cards,
      deck,
      changedCards,
      exiledCards,
    } = this.props;
    if (!keys(changedCards).length && !keys(exiledCards)) {
      return null;
    }
    return (
      <View>
        <Text style={[typography.text, styles.title]}>Campaign Progress</Text>
        { this.renderXp() }
        <View style={styles.buttonContainer}>
          { !!deck.previous_deck && (
            <Button
              style={styles.button}
              onPress={this._showPreviousDeck}
              text="Previous Deck"
              icon={<ArkhamIcon name="deck" size={18} color="white" />}
            />
          ) }
          { !!deck.next_deck && (
            <Button
              style={styles.button}
              onPress={this._showNextDeck}
              text="Next Deck"
              icon={<ArkhamIcon name="deck" size={18} color="white" />}
            />
          ) }
        </View>
        { !!keys(changedCards).length && (
          <View>
            <Text style={[typography.text, styles.title]}>Changes</Text>
            { map(keys(changedCards), code => (
              <DeckViewCardItem
                key={code}
                onPress={this._showCard}
                item={{ quantity: changedCards[code] }}
                card={cards[code]}
                deltaMode
              />
            )) }
          </View>
        ) }
        { !!keys(exiledCards).length && (
          <View>
            <Text style={[typography.text, styles.title]}>Exiled Cards</Text>
            { map(keys(exiledCards), code => (
              <DeckViewCardItem
                key={code}
                onPress={this._showCard}
                item={{ quantity: exiledCards[code] }}
                card={cards[code]}
                deltaMode
              />
            )) }
          </View>
        ) }
      </View>
    );
  }
}

export default connectRealm(DeckDelta, {
  schemas: ['Card'],
  mapToProps(results, realm, props) {
    const cards = {};
    forEach(results.cards, card => {
      if (card.code in props.changedCards || card.code in props.exiledCards) {
        cards[card.code] = card;
      }
    });
    return {
      cards,
    };
  },
});

const styles = StyleSheet.create({
  title: {
    marginTop: 16,
    fontWeight: '900',
  },
  xp: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'column',
  },
  button: {
    marginBottom: 8,
    width: '100%',
  },
});

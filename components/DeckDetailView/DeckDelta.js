import React from 'react';
import PropTypes from 'prop-types';
import { forEach, keys, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';

import Button from '../core/Button';
import ArkhamIcon from '../../assets/ArkhamIcon';
import DeckViewCardItem from './DeckViewCardItem';
import typography from '../../styles/typography';

class DeckDelta extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    cards: PropTypes.object,
    parsedDeck: PropTypes.object,
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
      parsedDeck: {
        deck,
      },
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
      parsedDeck: {
        deck,
      },
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
      parsedDeck: {
        deck: {
          xp,
          previous_deck,
        },
        spentXp,
      },
    } = this.props;

    if (previous_deck === null) {
      return null;
    }

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
      parsedDeck: {
        deck,
        changedCards,
        exiledCards,
      },
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
              align="left"
              onPress={this._showPreviousDeck}
              text="Previous Deck"
              icon={<ArkhamIcon name="deck" size={18} color="white" />}
            />
          ) }
          { !!deck.next_deck && (
            <Button
              style={styles.button}
              align="left"
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
    const {
      parsedDeck: {
        changedCards,
        exiledCards,
      },
    } = props;
    const cards = {};
    forEach(results.cards, card => {
      if (card.code in changedCards || card.code in exiledCards) {
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
    marginLeft: 0,
  },
});

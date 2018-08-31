import React from 'react';
import PropTypes from 'prop-types';
import { forEach, keys, map } from 'lodash';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';

import L from '../../app/i18n';
import CardSearchResult from '../CardSearchResult';
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
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={typography.smallLabel}>
            { L('CAMPAIGN PROGRESS') }
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          { !!deck.previous_deck && (
            <View style={styles.button}>
              <Button
                onPress={this._showPreviousDeck}
                title={L('Previous Deck')}
              />
            </View>
          ) }
          { !!deck.next_deck && (
            <View style={styles.button}>
              <Button
                onPress={this._showNextDeck}
                title={L('Next Deck')}
              />
            </View>
          ) }
        </View>
        { !!keys(changedCards).length && (
          <View>
            <View style={styles.title}>
              <Text style={typography.smallLabel}>
                { L('CHANGES FROM PREVIOUS DECK') }
              </Text>
            </View>
            { map(keys(changedCards), code => (
              <CardSearchResult
                key={code}
                onPress={this._showCard}
                card={cards[code]}
                count={changedCards[code]}
                deltaCountMode
              />
            )) }
          </View>
        ) }
        { !!keys(exiledCards).length && (
          <View>
            <View style={styles.title}>
              <Text style={typography.smallLabel}>
                { L('EXILED CARDS') }
              </Text>
            </View>
            { map(keys(exiledCards), code => (
              <CardSearchResult
                key={code}
                onPress={this._showCard}
                card={cards[code]}
                count={exiledCards[code]}
                deltaCountMode
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
  container: {
    marginTop: 16,
  },
  title: {
    marginTop: 16,
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  buttonContainer: {
    flexDirection: 'column',
    marginLeft: 8,
    marginRight: 8,
  },
  button: {
    margin: 8,
  },
});

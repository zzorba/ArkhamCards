import React from 'react';
import { keys, map } from 'lodash';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import L from '../../app/i18n';
import { getDeckOptions, showCard } from '../navHelper';
import { ParsedDeck } from '../parseDeck';
import CardSearchResult from '../CardSearchResult';
import Card, { CardsMap } from '../../data/Card';
import typography from '../../styles/typography';

interface Props {
  componentId: string;
  cards: CardsMap;
  parsedDeck: ParsedDeck;
}

export default class DeckDelta extends React.Component<Props> {
  _showPreviousDeck = () => {
    const {
      componentId,
      parsedDeck: {
        deck,
        investigator,
      },
    } = this.props;
    Navigation.push(componentId, {
      component: {
        name: 'Deck',
        passProps: {
          title: investigator.name,
          id: deck.previous_deck,
          isPrivate: true,
        },
        options: getDeckOptions(investigator),
      },
    });
  };

  _showNextDeck = () => {
    const {
      componentId,
      parsedDeck: {
        deck,
        investigator,
      },
    } = this.props;
    Navigation.push(componentId, {
      component: {
        name: 'Deck',
        passProps: {
          id: deck.next_deck,
          isPrivate: true,
        },
        options: getDeckOptions(investigator),
      },
    });
  };

  _showCard = (card: Card) => {
    showCard(this.props.componentId, card.code, card, true);
  };

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
      <React.Fragment>
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
                count={-exiledCards[code]}
                deltaCountMode
              />
            )) }
          </View>
        ) }
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
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

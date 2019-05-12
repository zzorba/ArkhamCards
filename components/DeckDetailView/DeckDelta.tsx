import React from 'react';
import { keys, map } from 'lodash';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import { t } from 'ttag';
import { getDeckOptions, showCard } from '../navHelper';
import { ParsedDeck } from '../parseDeck';
import CardSearchResult from '../CardSearchResult';
import { DeckDetailProps } from '../DeckDetailView';
import Card, { CardsMap } from '../../data/Card';
import typography from '../../styles/typography';
import { m, s } from '../../styles/space';

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
    if (!deck.previous_deck) {
      return;
    }
    Navigation.push<DeckDetailProps>(componentId, {
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
    if (!deck.next_deck) {
      return;
    }
    Navigation.push<DeckDetailProps>(componentId, {
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
    return (
      <React.Fragment>
        <Text style={[typography.text, styles.text]}>
          { t`Version ${deck.version}` }
        </Text>
        <View style={styles.buttonContainer}>
          { !!deck.previous_deck && (
            <View style={styles.button}>
              <Button
                onPress={this._showPreviousDeck}
                title={t`Previous Deck`}
              />
            </View>
          ) }
          { !!deck.next_deck && (
            <View style={styles.button}>
              <Button
                onPress={this._showNextDeck}
                title={t`Next Deck`}
              />
            </View>
          ) }
        </View>
        { !!keys(changedCards).length && (
          <View>
            <View style={styles.title}>
              <Text style={typography.smallLabel}>
                { t`CHANGES FROM PREVIOUS DECK` }
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
                { t`EXILED CARDS` }
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
    marginTop: m,
    paddingLeft: s,
    paddingRight: s,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  text: {
    margin: s,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginLeft: s,
    marginRight: s,
  },
  button: {
    margin: 8,
  },
});

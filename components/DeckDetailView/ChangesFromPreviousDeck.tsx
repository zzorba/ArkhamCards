import React from 'react';
import { keys, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { t } from 'ttag';
import { showCard } from '../navHelper';
import { ParsedDeck } from '../parseDeck';
import CardSearchResult from '../CardSearchResult';
import Card, { CardsMap } from '../../data/Card';
import typography from '../../styles/typography';
import { m, s } from '../../styles/space';

interface Props {
  componentId: string;
  cards: CardsMap;
  parsedDeck: ParsedDeck;
  xpAdjustment: number;
}

export default class ChangesFromPreviousDeck extends React.Component<Props> {
  _showCard = (card: Card) => {
    showCard(this.props.componentId, card.code, card, true);
  };

  render() {
    const {
      cards,
      parsedDeck: {
        changedCards,
        exiledCards,
        deck,
      },
    } = this.props;
    if (!deck.previous_deck) {
      return null;
    }
    if (keys(changedCards).length === 0 && keys(exiledCards).length === 0) {
      return (
        <View style={styles.title}>
          <Text style={typography.smallLabel}>
            { t`CHANGES FROM PREVIOUS DECK` }
          </Text>
        </View>
      );
    }
    return (
      <React.Fragment>
        { !!keys(changedCards.length) && (
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
});

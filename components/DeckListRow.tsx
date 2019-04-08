import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import L from '../app/i18n';
import { Campaign, Deck } from '../actions/types';
import Card, { CardsMap } from '../data/Card';
import InvestigatorImage from './core/InvestigatorImage';
import FactionGradient from './core/FactionGradient';
import DeckTitleBarComponent from './DeckTitleBarComponent';
import DeckProblemRow from './DeckProblemRow';
import { toRelativeDateString } from '../lib/datetime';
import { parseDeck, ParsedDeck } from './parseDeck';
import typography from '../styles/typography';

interface Props {
  deck: Deck;
  previousDeck?: Deck;
  deckToCampaign?: { [deck_id: number]: Campaign };
  cards: CardsMap;
  investigator?: Card;
  onPress?: (deck: Deck, investigator?: Card) => void;
  details?: ReactNode;
  subDetails?: ReactNode;
  titleButton?: ReactNode;
  compact?: boolean;
  viewDeckButton?: boolean;
}

export default class DeckListRow extends React.Component<Props> {
  _onPress = () => {
    const {
      deck,
      investigator,
      onPress,
    } = this.props;
    onPress && onPress(deck, investigator);
  };

  static xpString(parsedDeck: ParsedDeck) {
    const xp = (parsedDeck.deck.xp || 0) + (parsedDeck.deck.xp_adjustment || 0);
    if (xp > 0) {
      if ((parsedDeck.spentXp || 0) > 0) {
        return L(
          '{{availableXp}} available experience, {{spentXp}} spent',
          {
            availableXp: xp,
            spentXp: parsedDeck.spentXp,
          });
      }
      return L('{{availableXp}} available experience', { availableXp: xp });
    }
    if (parsedDeck.experience > 0) {
      return L('{{totalXp}} experience required', { totalXp: parsedDeck.experience });
    }
    return null;
  }

  renderDeckDetails() {
    const {
      deck,
      previousDeck,
      cards,
      details,
      deckToCampaign,
    } = this.props;
    if (details) {
      return (
        <View>
          { details }
        </View>
      );
    }
    if (!deck) {
      return null;
    }
    const parsedDeck = parseDeck(
      deck,
      deck.slots,
      deck.ignoreDeckLimitSlots || {},
      cards,
      previousDeck
    );
    const xpString = DeckListRow.xpString(parsedDeck);

    const date: undefined | string = deck.date_update || deck.date_creation;
    const parsedDate: number | undefined = date ? Date.parse(date) : undefined;
    return (
      <View>
        <Text style={typography.small}>
          { deckToCampaign && deckToCampaign[deck.id] ?
            deckToCampaign[deck.id].name :
            L('{{scenarioCount}} scenarios completed', {
              count: deck.scenarioCount,
              scenarioCount: deck.scenarioCount,
            })
          }
        </Text>
        { !!xpString && (
          <Text style={typography.small}>
            { xpString }
          </Text>
        ) }
        { !!deck.problem && (
          <DeckProblemRow problem={{ reason: deck.problem }} color="#222" />
        ) }
        { !!parsedDate && (
          <Text style={typography.small} >
            { L('Updated {{date}}', { date: toRelativeDateString(new Date(parsedDate)) }) }
          </Text>
        ) }
      </View>
    );
  }

  render() {
    const {
      deck,
      investigator,
      titleButton,
      compact,
      viewDeckButton,
      subDetails,
    } = this.props;
    if (!deck || !investigator) {
      return (
        <View style={styles.row}>
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="#000000"
          />
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={this._onPress} disabled={viewDeckButton}>
        <View style={styles.column}>
          <DeckTitleBarComponent
            name={compact && investigator ? investigator.name : deck.name}
            investigator={investigator}
            button={titleButton}
            compact
          />
          <FactionGradient
            faction_code={investigator.factionCode()}
            style={styles.investigatorBlock}
          >
            <View style={styles.investigatorBlockRow}>
              <View style={styles.image}>
                { !!investigator && <InvestigatorImage card={investigator} /> }
              </View>
              <View style={[styles.column, styles.titleColumn]}>
                { !compact && (
                  <Text style={typography.bigLabel}>
                    { investigator.name }
                  </Text>
                ) }
                { this.renderDeckDetails() }
              </View>
            </View>
            { subDetails }
          </FactionGradient>
        </View>
        <FactionGradient
          faction_code={investigator.factionCode()}
          style={styles.footer}
          dark
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    height: 16,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  investigatorBlockRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  investigatorBlock: {
    paddingTop: 8,
    paddingBottom: 8,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  loading: {
    marginLeft: 10,
  },
  image: {
    marginLeft: 10,
    marginRight: 8,
  },
  titleColumn: {
    flex: 1,
  },
});

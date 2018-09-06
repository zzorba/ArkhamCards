import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import L from '../app/i18n';
import InvestigatorImage from './core/InvestigatorImage';
import FactionGradient from './core/FactionGradient';
import DeckTitleBarComponent from './DeckTitleBarComponent';
import DeckProblemRow from './DeckProblemRow';
import { toRelativeDateString } from '../lib/datetime';
import { parseDeck } from './parseDeck';
import typography from '../styles/typography';

export default class DeckListRow extends React.Component {
  static propTypes = {
    deck: PropTypes.object.isRequired,
    previousDeck: PropTypes.object,
    deckToCampaign: PropTypes.object,
    cards: PropTypes.object,
    investigator: PropTypes.object,
    onPress: PropTypes.func,
    details: PropTypes.node,
    subDetails: PropTypes.node,
    titleButton: PropTypes.node,
    compact: PropTypes.bool,
    viewDeckButton: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      deck,
      investigator,
      onPress,
    } = this.props;
    onPress && onPress(deck, investigator);
  }

  static xpString(parsedDeck) {
    if (parsedDeck.deck.xp > 0) {
      if (parsedDeck.spentXp > 0) {
        return L(
          '{{availableXp}} available experience, {{spentXp}} spent',
          {
            availableXp: parsedDeck.deck.xp || 0,
            spentXp: parsedDeck.spentXp,
          });
      }
      return L('{{availableXp}} available experience', { availableXp: parsedDeck.deck.xp || 0 });
    }
    return L('{{totalXp}} experience required', { totalXp: parsedDeck.experience });
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
    const parsedDeck = parseDeck(deck, deck.slots, cards, previousDeck);
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
        <Text style={typography.small}>
          { DeckListRow.xpString(parsedDeck) }
        </Text>
        { deck.problem ?
          <DeckProblemRow problem={{ reason: deck.problem }} color="#222" /> :
          (!!deck.date_update && (
            <Text style={typography.small} >
              { L('Updated {{date}}', { date: toRelativeDateString(Date.parse(deck.date_update)) }) }
            </Text>
          )) }
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
            faction_code={investigator.faction_code}
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
          faction_code={investigator.faction_code}
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

import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import { ngettext, msgid, t } from 'ttag';

import { Campaign, Deck, ParsedDeck } from 'actions/types';
import Card, { CardsMap } from 'data/Card';
import InvestigatorImage from 'components/core/InvestigatorImage';
import FactionGradient from 'components/core/FactionGradient';
import DeckProblemRow from 'components/core/DeckProblemRow';
import { toRelativeDateString } from 'lib/datetime';
import { parseDeck } from 'lib/parseDeck';
import typography from 'styles/typography';
import { s } from 'styles/space';
import DeckTitleBarComponent from './DeckTitleBarComponent';

interface Props {
  deck: Deck;
  fontScale: number;
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
  killedOrInsane?: boolean;
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
      if (parsedDeck.changes && parsedDeck.changes.spentXp > 0) {
        return t`${xp} available experience, ${parsedDeck.changes.spentXp} spent`;
      }
      return t`${xp} available experience`;
    }
    if (parsedDeck.experience > 0) {
      return t`${parsedDeck.experience} experience required`;
    }
    return null;
  }

  killedOrInsane(): boolean {
    const {
      killedOrInsane,
      investigator,
      deckToCampaign,
      deck,
    } = this.props;
    if (killedOrInsane) {
      return true;
    }
    if (!investigator) {
      return false;
    }
    const campaign = deckToCampaign && deckToCampaign[deck.id];
    const traumaData = campaign && campaign.investigatorData[deck.id];
    return investigator.eliminated(traumaData);
  }

  renderDeckDetails(investigator: Card, campaign?: Campaign) {
    const {
      deck,
      previousDeck,
      cards,
      details,
      fontScale,
    } = this.props;
    if (details) {
      return details;
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
    const scenarioCount = deck.scenarioCount || 0;
    const dateStr = parsedDate ? toRelativeDateString(new Date(parsedDate)) : undefined;
    const traumaData = campaign && campaign.investigatorData[investigator.code];
    return (
      <View>
        <Text style={typography.small}>
          { campaign ? campaign.name :
            ngettext(
              msgid`${scenarioCount} scenario completed`,
              `${scenarioCount} scenarios completed`,
              scenarioCount
            )
          }
        </Text>
        { this.killedOrInsane() && (
          <Text style={typography.small}>
            { investigator.traumaString(traumaData) }
          </Text>
        ) }
        { !!xpString && (
          <Text style={typography.small}>
            { xpString }
          </Text>
        ) }
        { !!deck.problem && (
          <DeckProblemRow
            problem={{ reason: deck.problem }}
            color="#222"
            fontScale={fontScale}
          />
        ) }
        { !!dateStr && (
          <Text style={typography.small} >
            { t`Updated ${dateStr}` }
          </Text>
        ) }
      </View>
    );
  }

  renderInvestigatorImage(investigator: Card) {
    return (
      <View style={styles.image}>
        <InvestigatorImage
          card={investigator}
          killedOrInsane={this.killedOrInsane()}
        />
      </View>
    );
  }

  renderContents() {
    const {
      deck,
      deckToCampaign,
      investigator,
      titleButton,
      compact,
      subDetails,
      fontScale,
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
    const campaign = deckToCampaign && deckToCampaign[deck.id];
    const killedOrInsane = this.killedOrInsane();
    return (
      <View>
        <View style={styles.column}>
          <DeckTitleBarComponent
            name={compact && investigator ? investigator.name : deck.name}
            investigator={investigator}
            button={titleButton}
            fontScale={fontScale}
            killedOrInsane={killedOrInsane}
            compact
          />
          <FactionGradient faction_code={killedOrInsane ? 'dead' : investigator.factionCode()}>
            <View style={styles.investigatorBlock}>
              <View style={styles.investigatorBlockRow}>
                { this.renderInvestigatorImage(investigator) }
                <View style={[styles.column, styles.titleColumn]}>
                  { !compact && (
                    <Text style={typography.label}>
                      { investigator.name }
                    </Text>
                  ) }
                  { this.renderDeckDetails(investigator, campaign) }
                </View>
              </View>
              { subDetails }
            </View>
          </FactionGradient>
        </View>
        <FactionGradient
          faction_code={killedOrInsane ? 'dead' : investigator.factionCode()}
          style={styles.footer}
          dark
        />
      </View>
    );
  }

  render() {
    const {
      deck,
      investigator,
      viewDeckButton,
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
    if (viewDeckButton) {
      return this.renderContents();
    }
    if (Platform.OS === 'ios' || !TouchableNativeFeedback.canUseNativeForeground()) {
      return (
        <TouchableOpacity onPress={this._onPress}>
          { this.renderContents() }
        </TouchableOpacity>
      );
    }
    return (
      <TouchableNativeFeedback useForeground onPress={this._onPress}>
        { this.renderContents() }
      </TouchableNativeFeedback>
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
    paddingTop: s,
    paddingBottom: s,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  loading: {
    marginLeft: 10,
  },
  image: {
    marginLeft: s,
    marginRight: s,
  },
  titleColumn: {
    flex: 1,
  },
});

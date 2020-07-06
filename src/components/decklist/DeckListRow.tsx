import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ngettext, msgid, t } from 'ttag';

import { Campaign, Deck, ParsedDeck } from 'actions/types';
import Card, { CardsMap } from 'data/Card';
import { BODY_OF_A_YITHIAN } from 'app_constants';
import InvestigatorRow from 'components/core/InvestigatorRow';
import DeckProblemRow from 'components/core/DeckProblemRow';
import { toRelativeDateString } from 'lib/datetime';
import { parseBasicDeck } from 'lib/parseDeck';
import typography from 'styles/typography';
import { s } from 'styles/space';
import COLORS from 'styles/colors';

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

  yithian(): boolean {
    const {
      deck,
    } = this.props;
    return (deck.slots[BODY_OF_A_YITHIAN] || 0) > 0;
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
    const parsedDeck = parseBasicDeck(deck, cards, previousDeck);
    if (!parsedDeck) {
      return null;
    }
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
            color={COLORS.darkText}
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

  renderContents() {
    const {
      deck,
      deckToCampaign,
      investigator,
      compact,
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
    const campaign = deckToCampaign && deckToCampaign[deck.id];
    return (
      <InvestigatorRow
        investigator={investigator}
        bigImage={!compact}
        noFactionIcon={!compact}
        eliminated={this.killedOrInsane()}
        superTitle={compact ? undefined : deck.name}
        button={(
          <View style={styles.investigatorBlock}>
            <View style={styles.investigatorBlockRow}>
              <View style={[styles.column, styles.titleColumn]}>
                { this.renderDeckDetails(investigator, campaign) }
              </View>
            </View>
            { subDetails }
          </View>
        )}
      />
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
    return (
      <TouchableOpacity onPress={this._onPress}>
        { this.renderContents() }
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
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
    paddingBottom: s,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  loading: {
    marginLeft: 10,
  },
  titleColumn: {
    flex: 1,
  },
});

import React, { ReactNode, useCallback, useContext, useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ngettext, msgid, t } from 'ttag';
import {
  Placeholder,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';

import { Campaign, Deck, ParsedDeck } from '@actions/types';
import Card from '@data/Card';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import InvestigatorRow from '@components/core/InvestigatorRow';
import DeckProblemRow from '@components/core/DeckProblemRow';
import { toRelativeDateString } from '@lib/datetime';
import { parseBasicDeck } from '@lib/parseDeck';
import { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import usePlayerCards from  '@components/core/usePlayerCards';
import { TINY_PHONE } from '@styles/sizes';

interface Props {
  lang: string;
  deck: Deck;
  previousDeck?: Deck;
  deckToCampaign?: { [deck_id: number]: Campaign };
  investigator?: Card;
  onPress?: (deck: Deck, investigator?: Card) => void;
  details?: ReactNode;
  subDetails?: ReactNode;
  compact?: boolean;
  viewDeckButton?: boolean;
  killedOrInsane?: boolean;
}

function deckXpString(parsedDeck: ParsedDeck) {
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

export default function DeckListRow({
  lang,
  deck,
  previousDeck,
  deckToCampaign,
  investigator,
  onPress,
  details,
  subDetails,
  compact,
  viewDeckButton,
  killedOrInsane,
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  const onDeckPress = useCallback(() => {
    onPress && onPress(deck, investigator);
  }, [deck, investigator, onPress]);
  const yithian = useMemo(() => (deck.slots[BODY_OF_A_YITHIAN] || 0) > 0, [deck]);
  const eliminated = useMemo(() => {
    if (killedOrInsane) {
      return true;
    }
    if (!investigator) {
      return false;
    }
    const campaign = deckToCampaign && deckToCampaign[deck.id];
    const traumaData = campaign && campaign.investigatorData[deck.id];
    return investigator.eliminated(traumaData);
  }, [killedOrInsane, investigator, deckToCampaign, deck]);
  const cards = usePlayerCards(deck.taboo_id || 0);
  const renderDeckDetails = useCallback((investigator?: Card, campaign?: Campaign) => {
    if (details) {
      return details;
    }
    const parsedDeck = deck && cards && parseBasicDeck(deck, cards, previousDeck);
    if (!parsedDeck || !investigator) {
      return (
        <Placeholder
          Animation={(props) => <Fade {...props} style={{ backgroundColor: colors.L20 }} duration={1000} />}
        >
          <PlaceholderLine color={colors.L10} height={11} width={80} style={TINY_PHONE ? { marginBottom: 4 } : undefined} />
          <PlaceholderLine color={colors.L10} height={11} width={40} style={TINY_PHONE ? { marginBottom: 4 } : undefined}  />
          <PlaceholderLine color={colors.L10} height={11} style={TINY_PHONE ? { marginBottom: 4 } : undefined} />
          <PlaceholderLine color={colors.L10} height={11} width={60} style={TINY_PHONE ? { marginBottom: 4 } : undefined} />
        </Placeholder>
      );
    }
    const xpString = deckXpString(parsedDeck);
    const date: undefined | string = deck.date_update || deck.date_creation;
    const parsedDate: number | undefined = date ? Date.parse(date) : undefined;
    const scenarioCount = deck.scenarioCount || 0;
    const dateStr = parsedDate ? toRelativeDateString(new Date(parsedDate), lang) : undefined;
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
        { eliminated && (
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
            color={colors.darkText}
          />
        ) }
        { !!dateStr && (
          <Text style={typography.small} >
            { dateStr }
          </Text>
        ) }
      </View>
    );
  }, [deck, previousDeck, eliminated, cards, details, lang, colors, typography, cards]);

  const contents = useMemo(() => {
    if (!deck) {
      return (
        <View style={styles.row}>
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color={colors.lightText}
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
        eliminated={eliminated}
        yithian={yithian}
        superTitle={compact ? undefined : deck.name}
        button={(
          <View style={styles.investigatorBlock}>
            <View style={styles.investigatorBlockRow}>
              <View style={[styles.column, styles.titleColumn]}>
                { renderDeckDetails(investigator, campaign) }
              </View>
            </View>
            { subDetails }
          </View>
        )}
     />
    );
  }, [colors, renderDeckDetails, yithian, eliminated, deck, deckToCampaign, investigator, compact, subDetails]);
  if (!deck) {
    return (
      <View style={styles.row}>
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color={colors.lightText}
        />
      </View>
    );
  }
  if (viewDeckButton || !investigator) {
    return contents;
  }
  return (
    <TouchableOpacity onPress={onDeckPress}>
      { contents }
    </TouchableOpacity>
  );
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

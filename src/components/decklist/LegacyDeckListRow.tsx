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

import { Campaign, Deck, getDeckId, ParsedDeck } from '@actions/types';
import Card from '@data/types/Card';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import InvestigatorRow from '@components/core/InvestigatorRow';
import DeckProblemRow from '@components/core/DeckProblemRow';
import { toRelativeDateString } from '@lib/datetime';
import { parseBasicDeck } from '@lib/parseDeck';
import { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { usePlayerCards } from '@components/core/hooks';
import { TINY_PHONE } from '@styles/sizes';
import LanguageContext from '@lib/i18n/LanguageContext';

interface Props {
  lang: string;
  deck: Deck;
  previousDeck?: Deck;
  deckToCampaign?: { [deck_id: string]: Campaign };
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

interface DetailProps {
  investigator?: Card;
  campaign?: Campaign;
  deck: Deck;
  previousDeck?: Deck;
  details?: ReactNode;
  lang: string;
  eliminated: boolean;
}

function LegacyDeckListRowDetails({
  investigator,
  campaign,
  deck,
  details,
  previousDeck,
  lang,
  eliminated,
}: DetailProps) {
  const { colors, typography } = useContext(StyleContext);
  const { listSeperator } = useContext(LanguageContext);
  const loadingAnimation = useCallback((props: any) => <Fade {...props} style={{ backgroundColor: colors.L20 }} />, [colors]);
  const cards = usePlayerCards(deck.taboo_id || 0);
  const parsedDeck = useMemo(() => !details && deck && cards && parseBasicDeck(deck, cards, previousDeck), [details, deck, cards, previousDeck]);
  if (details) {
    return (
      <>
        { details }
      </>
    );
  }
  if (!parsedDeck || !investigator) {
    return (
      <Placeholder Animation={loadingAnimation}>
        <PlaceholderLine color={colors.L10} height={11} width={80} style={TINY_PHONE ? { marginBottom: 4 } : undefined} />
        <PlaceholderLine color={colors.L10} height={11} width={40} style={TINY_PHONE ? { marginBottom: 4 } : undefined} />
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
  const traumaData = campaign && campaign.investigatorData?.[investigator.code];
  return (
    <View style={styles.column}>
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
          { investigator.traumaString(listSeperator, traumaData) }
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
}

export default function LegacyDeckListRow({
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
  const { colors } = useContext(StyleContext);
  const onDeckPress = useCallback(() => {
    onPress && onPress(deck, investigator);
  }, [deck, investigator, onPress]);
  const yithian = useMemo(() => !!deck.slots && (deck.slots[BODY_OF_A_YITHIAN] || 0) > 0, [deck.slots]);
  const campaign = deck && deckToCampaign && deckToCampaign[getDeckId(deck).uuid];
  const eliminated = useMemo(() => {
    if (killedOrInsane) {
      return true;
    }
    if (!investigator) {
      return false;
    }
    const traumaData = campaign && campaign.investigatorData?.[investigator.code];
    return investigator.eliminated(traumaData);
  }, [killedOrInsane, investigator, campaign]);

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
    return (
      <InvestigatorRow
        investigator={investigator}
        bigImage={!compact}
        noFactionIcon={!compact || TINY_PHONE}
        eliminated={eliminated}
        yithian={yithian}
        superTitle={compact ? undefined : deck.name}
        button={(
          <View style={styles.investigatorBlock}>
            <View style={styles.investigatorBlockRow}>
              <View style={[styles.column, styles.titleColumn]}>
                <LegacyDeckListRowDetails
                  deck={deck}
                  previousDeck={previousDeck}
                  investigator={investigator}
                  campaign={campaign}
                  eliminated={eliminated}
                  lang={lang}
                  details={details}
                />
              </View>
            </View>
            { subDetails }
          </View>
        )}
      />
    );
  }, [colors, previousDeck, yithian, eliminated, deck, campaign, investigator, compact, subDetails, lang, details]);

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
    flex: 1,
  },
  investigatorBlock: {
    paddingBottom: s,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
  },
  loading: {
    marginLeft: 10,
  },
  titleColumn: {
    flex: 1,
  },
});

import React, { useCallback, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { find, filter, map } from 'lodash';
import { t } from 'ttag';

import NonDeckDetailsButton from './NonDeckDetailsButton';
import UpgradeDeckButton from './UpgradeDeckButton';
import { Deck, InvestigatorData, ParsedDeck } from '@actions/types';
import InvestigatorRow from '@components/core/InvestigatorRow';
import Card, { CardsMap } from '@data/Card';
import { parseBasicDeck } from '@lib/parseDeck';
import DeckRow from '../DeckRow';
import { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useToggles } from '@components/core/hooks';

interface Props {
  lang: string;
  showDeckUpgradeDialog: (deck: Deck, investigator?: Card) => void;
  updateInvestigatorXp: (investigator: Card, xp: number) => void;
  investigatorData: InvestigatorData;
  originalDeckIds: Set<number>;
  componentId: string;
  decks: Deck[];
  allInvestigators: Card[];
}

function experienceLine(deck: Deck, parsedDeck: ParsedDeck) {
  const xp = (deck.xp || 0) + (deck.xp_adjustment || 0);
  if (xp > 0) {
    if (parsedDeck.changes && parsedDeck.changes.spentXp > 0) {
      return t`${xp} available experience, (${parsedDeck.changes.spentXp} spent)`;
    }
    return t`${xp} available experience`;
  }
  const totalXp = parsedDeck.experience || 0;
  return t`${totalXp} total`;
}

export default function UpgradeDecksList({
  lang,
  showDeckUpgradeDialog,
  updateInvestigatorXp,
  investigatorData,
  originalDeckIds,
  componentId,
  decks,
  allInvestigators,
}: Props) {
  const { typography } = useContext(StyleContext);
  const [saved, , setSaved] = useToggles({});
  const renderDetails = useCallback((
    deck: Deck,
    cards: CardsMap,
    investigator: Card,
    previousDeck?: Deck
  ) => {

    if (!deck) {
      return null;
    }
    const eliminated = investigator.eliminated(investigatorData[investigator.code]);
    if (eliminated) {
      return null;
    }
    if (!originalDeckIds.has(deck.id)) {
      const parsedDeck = parseBasicDeck(deck, cards, previousDeck);
      if (!parsedDeck) {
        return null;
      }
      return (
        <View style={styles.section}>
          <View style={styles.column}>
            <Text style={typography.text}>
              { experienceLine(parsedDeck.deck, parsedDeck) }
            </Text>
          </View>
        </View>
      );
    }

    return (
      <UpgradeDeckButton
        deck={deck}
        investigator={investigator}
        onPress={showDeckUpgradeDialog}
      />
    );
  }, [investigatorData, originalDeckIds, typography, showDeckUpgradeDialog]);

  const saveXp = useCallback((investigator: Card, xp: number) => {
    updateInvestigatorXp(investigator, xp);
    setSaved(investigator.code, true);
  }, [updateInvestigatorXp, setSaved]);

  const investigators = filter(
    allInvestigators,
    investigator => !investigator.eliminated(investigatorData[investigator.code] || {})
  );

  return (
    <>
      { map(investigators, investigator => {
        const deck = find(decks, deck => deck.investigator_code === investigator.code);
        if (deck) {
          return (
            <DeckRow
              key={deck.id}
              lang={lang}
              componentId={componentId}
              id={deck.id}
              renderDetails={renderDetails}
              compact
              viewDeckButton
            />
          );
        }
        return (
          <InvestigatorRow
            key={investigator.code}
            investigator={investigator}
          >
            <NonDeckDetailsButton
              investigator={investigator}
              saved={saved[investigator.code] || false}
              saveXp={saveXp}
            />
          </InvestigatorRow>
        );
      }) }
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: s,
    marginRight: s,
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
});

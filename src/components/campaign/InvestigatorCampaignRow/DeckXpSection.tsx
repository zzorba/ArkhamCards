import React, { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { Deck } from '@actions/types';
import PickerStyleButton from '@components/core/PickerStyleButton';
import CardSectionHeader from '@components/core/CardSectionHeader';
import { showDeckModal } from '@components/nav/helper';
import Card, { CardsMap } from '@data/Card';
import { AppState, getDeck } from '@reducers';
import { parseBasicDeck } from '@lib/parseDeck';
import StyleContext from '@styles/StyleContext';

interface Props {
  componentId: string;
  deck: Deck;
  cards: CardsMap;
  investigator: Card;
  showDeckUpgrade?: (investigator: Card, deck: Deck) => void;
}

export default function DeckXpSection({ componentId, deck, cards, investigator, showDeckUpgrade }: Props) {
  const { colors } = useContext(StyleContext);
  const previousDeckSelector = useCallback((state: AppState) => {
    return (deck.previous_deck && getDeck(deck.previous_deck)(state)) || undefined;
  }, [deck.previous_deck]);
  const previousDeck = useSelector(previousDeckSelector);

  const showDeckUpgradePress = useCallback(() => {
    if (deck && showDeckUpgrade) {
      showDeckUpgrade(investigator, deck);
    }
  }, [investigator, deck, showDeckUpgrade]);

  const onPress = useCallback(() => {
    showDeckModal(
      componentId,
      deck,
      colors,
      investigator,
      undefined,
      true
    );
  }, [colors, componentId, deck, investigator]);

  const parsedDeck = useMemo(() => {
    if (!previousDeck && !showDeckUpgrade) {
      return undefined;
    }
    return parseBasicDeck(deck, cards, previousDeck);
  }, [previousDeck, showDeckUpgrade, deck, cards]);

  if (!parsedDeck) {
    return null;
  }
  const { changes } = parsedDeck;
  if (!changes && !showDeckUpgrade) {
    return null;
  }
  const availableXp = (deck.xp || 0) + (deck.xp_adjustment || 0);
  return (
    <>
      <CardSectionHeader
        investigator={investigator}
        section={{ superTitle: t`Experience points` }}
      />
      { !!changes && (
        <PickerStyleButton
          id="xp"
          title={`${changes.spentXp} of ${availableXp} spent`}
          onPress={onPress}
          widget="nav"
          settingsStyle
        />
      ) }
      { !!showDeckUpgrade && (
        <BasicButton
          title={t`Upgrade Deck`}
          onPress={showDeckUpgradePress}
        />
      ) }
    </>
  );
}

import React, { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { t } from 'ttag';

import { Deck } from '@actions/types';
import { showDeckModal } from '@components/nav/helper';
import Card, { CardsMap } from '@data/Card';
import { AppState, makeDeckSelector } from '@reducers';
import { parseBasicDeck } from '@lib/parseDeck';
import StyleContext from '@styles/StyleContext';
import MiniPickerStyleButton from '@components/deck/controls/MiniPickerStyleButton';

interface Props {
  componentId: string;
  deck: Deck;
  cards: CardsMap;
  investigator: Card;
  showDeckUpgrade?: (investigator: Card, deck: Deck) => void;
}

export default function DeckXpSection({ componentId, deck, cards, investigator, showDeckUpgrade }: Props) {
  const { colors } = useContext(StyleContext);
  const previousDeckSelector = useMemo(makeDeckSelector, []);
  const previousDeck = useSelector((state: AppState) => {
    return deck.previousDeckId ? previousDeckSelector(state, deck.previousDeckId) : undefined;
  });

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
      { hideCampaign: true }
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
  const spentXp = changes?.spentXp || 0;
  const totalXp = (deck.xp || 0) + (deck.xp_adjustment || 0);
  return (
    <>
      <MiniPickerStyleButton
        title={t`Experience`}
        valueLabel={t`${spentXp} of ${totalXp} spent`}
        first
        editable
        onPress={onPress}
      />
      { !!showDeckUpgrade && (
        <MiniPickerStyleButton
          title={t`Upgrade Deck`}
          valueLabel={t`Add XP from scenario`}
          icon="upgrade"
          onPress={showDeckUpgradePress}
          editable
        />
      ) }
    </>
  );
}

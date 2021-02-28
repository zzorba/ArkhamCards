import React, { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { t } from 'ttag';

import { Deck } from '@actions/types';
import { showDeckModal } from '@components/nav/helper';
import Card, { CardsMap } from '@data/types/Card';
import { AppState, makeDeckSelector } from '@reducers';
import { parseBasicDeck } from '@lib/parseDeck';
import StyleContext from '@styles/StyleContext';
import MiniPickerStyleButton from '@components/deck/controls/MiniPickerStyleButton';

interface Props {
  componentId: string;
  deck?: Deck;
  cards: CardsMap;
  investigator: Card;
  showDeckUpgrade?: (investigator: Card, deck: Deck) => void;
  editXpPressed?: () => void;

  spentXp: number;
  totalXp: number;
  last?: boolean;
}

export default function useXpSection({ componentId, deck, cards, investigator, last, showDeckUpgrade, editXpPressed, spentXp, totalXp }: Props): [React.ReactNode, boolean] {
  const { colors } = useContext(StyleContext);
  const previousDeckSelector = useMemo(makeDeckSelector, []);
  const previousDeck = useSelector((state: AppState) => {
    return deck?.previousDeckId ? previousDeckSelector(state, deck.previousDeckId) : undefined;
  });

  const showDeckUpgradePress = useCallback(() => {
    if (deck && showDeckUpgrade) {
      showDeckUpgrade(investigator, deck);
    }
  }, [investigator, deck, showDeckUpgrade]);

  const onPress = useCallback(() => {
    if (deck) {
      showDeckModal(
        componentId,
        deck,
        colors,
        investigator,
        { hideCampaign: true, initialMode: 'upgrade' }
      );
    }
  }, [colors, componentId, deck, investigator]);

  const parsedDeck = useMemo(() => {
    if (!deck) {
      return undefined;
    }
    if (!previousDeck && !showDeckUpgrade) {
      return undefined;
    }
    return parseBasicDeck(deck, cards, previousDeck);
  }, [previousDeck, showDeckUpgrade, deck, cards]);
  if (deck) {
    if (!parsedDeck) {
      return [null, false];
    }
    const { changes } = parsedDeck;
    if (!changes && !showDeckUpgrade) {
      return [null, false];
    }
    const spentXp = changes?.spentXp || 0;
    const totalXp = (deck.xp || 0) + (deck.xp_adjustment || 0);
    return [(
      <>
        <MiniPickerStyleButton
          title={t`Experience`}
          valueLabel={t`${spentXp} of ${totalXp} spent`}
          last={last && !showDeckUpgrade}
          editable
          onPress={onPress}
        />
        { !!showDeckUpgrade && (
          <MiniPickerStyleButton
            title={t`Upgrade Deck`}
            valueLabel={t`Add XP from scenario`}
            icon="upgrade"
            onPress={showDeckUpgradePress}
            last={last}
            editable
          />
        ) }
      </>
    ), spentXp === 0 && totalXp !== 0];
  }
  if (totalXp === 0) {
    return [null, false];
  }
  return [(
    <MiniPickerStyleButton
      key="xp"
      title={t`Experience`}
      valueLabel={t`${spentXp} of ${totalXp} spent` }
      last={last}
      editable
      onPress={editXpPressed}
    />
  ), false];
}

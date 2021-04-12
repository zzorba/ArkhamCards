import React, { useCallback, useContext, useMemo } from 'react';
import { t } from 'ttag';

import { Deck } from '@actions/types';
import { showDeckModal } from '@components/nav/helper';
import Card, { CardsMap } from '@data/types/Card';
import { parseBasicDeck } from '@lib/parseDeck';
import StyleContext from '@styles/StyleContext';
import MiniPickerStyleButton from '@components/deck/controls/MiniPickerStyleButton';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';

interface Props {
  deck?: LatestDeckT;
  campaign: MiniCampaignT;
  cards: CardsMap;
  investigator: Card;
  showDeckUpgrade?: (investigator: Card, deck: Deck) => void;
  editXpPressed?: () => void;

  spentXp: number;
  totalXp: number;
  last?: boolean;
}

export default function useXpSection({ deck, campaign, cards, investigator, last, showDeckUpgrade, editXpPressed, spentXp, totalXp }: Props): [React.ReactNode, boolean] {
  const { colors } = useContext(StyleContext);
  const { user } = useContext(ArkhamCardsAuthContext);
  const showDeckUpgradePress = useCallback(() => {
    if (deck && showDeckUpgrade) {
      showDeckUpgrade(investigator, deck.deck);
    }
  }, [investigator, deck, showDeckUpgrade]);

  const onPress = useCallback(() => {
    if (deck) {
      showDeckModal(
        deck.id,
        deck.deck,
        campaign?.id,
        colors,
        investigator,
        'upgrade',
      );
    }
  }, [colors, campaign, deck, investigator]);
  const ownerDeck = !deck?.owner || !user || deck.owner.id === user.uid;
  const parsedDeck = useMemo(() => {
    if (!deck) {
      return undefined;
    }
    if (!deck.previousDeck && !showDeckUpgrade) {
      return undefined;
    }
    return parseBasicDeck(deck.deck, cards, deck.previousDeck);
  }, [deck, showDeckUpgrade, cards]);
  if (deck) {
    if (!parsedDeck) {
      return [null, false];
    }
    const { changes } = parsedDeck;
    if (!changes && !showDeckUpgrade) {
      return [null, false];
    }
    const spentXp = changes?.spentXp || 0;
    const totalXp = (deck.deck.xp || 0) + (deck.deck.xp_adjustment || 0);
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
    ), ownerDeck && spentXp === 0 && totalXp !== 0];
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

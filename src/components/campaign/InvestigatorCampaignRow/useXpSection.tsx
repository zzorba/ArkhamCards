import React, { useCallback, useContext, useMemo } from 'react';
import { t } from 'ttag';

import { Deck } from '@actions/types';
import { showDeckModal } from '@components/nav/helper';
import Card from '@data/types/Card';
import { parseBasicDeck } from '@lib/parseDeck';
import StyleContext from '@styles/StyleContext';
import MiniPickerStyleButton from '@components/deck/controls/MiniPickerStyleButton';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useLatestDeckCards } from '@components/core/hooks';

interface Props {
  deck?: LatestDeckT;
  campaign: MiniCampaignT;
  investigator: Card;
  showDeckUpgrade?: (investigator: Card, deck: Deck) => void;
  editXpPressed?: () => void;

  unspentXp: number;
  spentXp: number;
  totalXp: number;
  last?: boolean;
  isDeckOwner: boolean;
  uploading: boolean;
}

export default function useXpSection({
  deck,
  campaign,
  investigator,
  last,
  spentXp,
  totalXp,
  unspentXp,
  isDeckOwner,
  uploading,
  showDeckUpgrade,
  editXpPressed,
}: Props): [React.ReactNode, boolean] {
  const { colors } = useContext(StyleContext);
  const { userId } = useContext(ArkhamCardsAuthContext);
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
  const ownerDeck = !deck?.owner || !userId || deck.owner.id === userId;
  const cards = useLatestDeckCards(deck);
  const parsedDeck = useMemo(() => {
    if (!deck || uploading || !cards) {
      return undefined;
    }
    if (!deck.previousDeck && !showDeckUpgrade) {
      return undefined;
    }
    return parseBasicDeck(deck.deck, cards, deck.previousDeck);
  }, [deck, uploading, showDeckUpgrade, cards]);
  if (deck && !uploading) {
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
          key="xp"
          title={unspentXp > 0 ? t`Available XP` : t`Experience`}
          valueLabel={t`${spentXp} of ${totalXp} spent`}
          last={last && !unspentXp && !showDeckUpgrade}
          editable={isDeckOwner && !uploading}
          onPress={onPress}
        />
        { unspentXp > 0 && (
          <MiniPickerStyleButton
            key="unspent"
            title={t`Unspent XP`}
            valueLabel={t`${unspentXp} saved`}
            last={last && !showDeckUpgrade}
            editable={false}
          />
        )}
        { !!showDeckUpgrade && (
          <MiniPickerStyleButton
            key="upgrade"
            title={t`Upgrade Deck`}
            valueLabel={t`Add XP from scenario`}
            icon="upgrade"
            onPress={showDeckUpgradePress}
            last={last}
            editable={!uploading}
          />
        ) }
      </>
    ), ownerDeck && spentXp === 0 && unspentXp === 0 && totalXp !== 0];
  }
  if (totalXp === 0 && unspentXp === 0) {
    return [null, false];
  }
  return [(
    <>
      { totalXp > 0 && (
        <MiniPickerStyleButton
          key="xp"
          title={unspentXp > 0 ? t`Available XP` : t`Experience`}
          valueLabel={t`${spentXp} of ${totalXp} spent` }
          last={last && !unspentXp}
          editable={!uploading}
          onPress={editXpPressed}
        />
      )}
      { unspentXp > 0 && (
        <MiniPickerStyleButton
          key="unspent"
          title={t`Unspent XP`}
          valueLabel={t`${unspentXp} saved`}
          last={last && !showDeckUpgrade}
          editable={false}
        />
      )}
    </>
  ), false];
}

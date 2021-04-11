import React, { useCallback, useContext } from 'react';
import { t } from 'ttag';

import { DeckId } from '@actions/types';
import { showDeckModal } from '@components/nav/helper';
import { useCampaignDeck } from '@data/hooks';
import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import ArkhamButton from '@components/core/ArkhamButton';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';

interface ShowDeckButtonProps {
  deckId: DeckId;
  investigator: Card;
}

export default function ShowDeckButton({ deckId, investigator }: ShowDeckButtonProps) {
  const { campaign } = useContext(CampaignGuideContext);
  const { colors } = useContext(StyleContext);
  const deck = useCampaignDeck(deckId, campaign.id);
  const onPress = useCallback(() => {
    if (deck) {
      showDeckModal(deck.id, deck.deck, campaign?.id, colors, investigator);
    }
  }, [investigator, deck, campaign, colors]);

  if (!deck) {
    return null;
  }
  return (
    <ArkhamButton
      variant="outline"
      icon="deck"
      grow
      title={t`View deck`}
      onPress={onPress}
    />
  );
}
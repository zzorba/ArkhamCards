import React, { useCallback, useContext } from 'react';
import { t } from 'ttag';

import { DeckId } from '@actions/types';
import { showDeckModal } from '@components/nav/helper';
import { useCampaignDeck } from '@data/hooks';
import Card from '@data/types/Card';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import ActionButton from '@components/campaignguide/prompts/ActionButton';
import { useNavigation } from '@react-navigation/native';

interface ShowDeckButtonProps {
  deckId: DeckId;
  investigator: Card;
}

export default function ShowDeckButton({ deckId, investigator }: ShowDeckButtonProps) {
  const { campaign } = useContext(CampaignGuideContext);
  const deck = useCampaignDeck(deckId, campaign.id);
  const navigation = useNavigation();
  const onPress = useCallback(() => {
    if (deck) {
      showDeckModal(navigation, deck.id, deck.deck, campaign?.id, investigator);
    }
  }, [investigator, deck, campaign, navigation]);

  if (!deck) {
    return null;
  }
  return (
    <ActionButton
      leftIcon="deck"
      color="dark"
      title={t`View deck`}
      onPress={onPress}
    />
  );
}
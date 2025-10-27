import React, { useCallback, useContext, useMemo } from 'react';

import { showDeckModal } from '@components/nav/helper';
import LegacyDeckListRow from '../decklist/LegacyDeckListRow';
import { Deck } from '@actions/types';
import { CardsMap } from '@data/types/Card';
import { useLatestDeckCards, usePressCallback } from '@components/core/hooks';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';
import { useNavigation } from '@react-navigation/native';
import StyleContext from '@styles/StyleContext';

type RenderDeckDetails = (
  deck: Deck,
  cards: CardsMap,
  investigator: CampaignInvestigator,
  previousDeck?: Deck
) => JSX.Element | null;

export interface LegacyDeckRowProps {
  deck: LatestDeckT;
  campaign: MiniCampaignT;
  lang: string;
  renderDetails?: RenderDeckDetails;
  killedOrInsane?: boolean;
  skipRender?: (deck: Deck, investigator: CampaignInvestigator) => boolean;
}

interface Props extends LegacyDeckRowProps {
  compact?: boolean;
  viewDeckButton?: boolean;
  investigator: CampaignInvestigator;
}

export default function LegacyDeckRow({
  deck,
  campaign,
  lang,
  renderDetails,
  killedOrInsane,
  skipRender,
  compact,
  viewDeckButton,
  investigator,
}: Props) {
  const navigation = useNavigation();
  const { colors } = useContext(StyleContext);
  const [cards] = useLatestDeckCards(deck, false);
  const onDeckPressFunction = useCallback(() => {
    showDeckModal(navigation, colors, deck.id, deck.deck, campaign.id, investigator.card);
  }, [navigation, colors, deck, campaign, investigator]);
  const onDeckPress = usePressCallback(onDeckPressFunction);
  const details = useMemo(() => {
    if (!deck || !renderDetails) {
      return null;
    }
    if (!investigator || !cards) {
      return null;
    }
    return renderDetails(deck.deck, cards, investigator, deck.previousDeck);
  }, [deck, cards, investigator, renderDetails]);

  if (!deck) {
    return null;
  }
  if (!investigator) {
    return null;
  }
  if (skipRender && skipRender(deck.deck, investigator)) {
    return null;
  }
  return (
    <LegacyDeckListRow
      deck={deck.deck}
      previousDeck={deck.previousDeck}
      lang={lang}
      onPress={onDeckPress}
      investigator={investigator}
      details={details}
      compact={compact}
      viewDeckButton={viewDeckButton}
      killedOrInsane={killedOrInsane}
    />
  );
}
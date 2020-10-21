import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { showDeckModal } from '@components/nav/helper';
import DeckListRow from '../decklist/DeckListRow';
import { Deck } from '@actions/types';
import Card, { CardsMap } from '@data/Card';
import { fetchPrivateDeck } from '@components/deck/actions';
import { getDeck, AppState } from '@reducers';
import StyleContext from '@styles/StyleContext';
import { useInvestigatorCards, usePlayerCards } from '@components/core/hooks';

type RenderDeckDetails = (
  deck: Deck,
  cards: CardsMap,
  investigator: Card,
  previousDeck?: Deck
) => React.ReactNode | null;

export interface DeckRowProps {
  componentId: string;
  id: number;
  lang: string;
  deckRemoved?: (id: number, deck?: Deck, investigator?: Card) => void;
  renderSubDetails?: RenderDeckDetails;
  renderDetails?: RenderDeckDetails;
  killedOrInsane?: boolean;
  skipRender?: (deck: Deck, investigator: Card) => boolean;
}

interface Props extends DeckRowProps {
  compact?: boolean;
  viewDeckButton?: boolean;
  otherProps?: any;
}

export default function DeckRow({
  componentId,
  id,
  lang,
  deckRemoved,
  renderSubDetails,
  renderDetails,
  killedOrInsane,
  skipRender,
  compact,
  viewDeckButton,
  otherProps,
}: Props) {
  const { colors } = useContext(StyleContext);
  const dispatch = useDispatch();
  const deckSelector = useCallback(getDeck(id), [id]);
  const theDeck = useSelector(deckSelector) || undefined;
  const previousDeckSelector = useCallback((state: AppState) => {
    return theDeck && theDeck.previous_deck && getDeck(theDeck.previous_deck)(state);
  }, [theDeck]);
  const thePreviousDeck = useSelector(previousDeckSelector) || undefined;
  const cards = usePlayerCards(theDeck?.taboo_id);
  const investigators = useInvestigatorCards(theDeck?.taboo_id);
  const investigator = theDeck && investigators && investigators[theDeck.investigator_code] || undefined;
  const onDeckPress = useCallback(() => {
    if (theDeck) {
      showDeckModal(componentId, theDeck, colors, investigator);
    }
  }, [componentId, theDeck, colors, investigator]);
  const onRemove = useCallback(() => {
    deckRemoved && deckRemoved(id, theDeck, investigator);
  }, [deckRemoved, id, theDeck, investigators]);
  useEffect(() => {
    if (!theDeck) {
      dispatch(fetchPrivateDeck(id));
    }
  }, []);
  useEffect(() => {
    if (!thePreviousDeck && theDeck?.previous_deck) {
      dispatch(fetchPrivateDeck(id));
    }
  }, [theDeck]);
  const subDetails = useMemo(() => {
    if (theDeck && renderSubDetails) {
      if (!investigator || !cards) {
        return null;
      }
      return renderSubDetails(
        theDeck,
        cards,
        investigator,
        thePreviousDeck
      );
    }
    return null;
  }, [theDeck, cards, investigator, thePreviousDeck, investigators, renderSubDetails]);
  const details = useMemo(() => {
    if (!theDeck || !renderDetails) {
      return null;
    }
    if (!investigator || !cards) {
      return null;
    }
    return renderDetails(theDeck, cards, investigator, thePreviousDeck);
  }, [theDeck, cards, investigator, thePreviousDeck, investigators, renderDetails]);

  if (!theDeck) {
    return null;
  }
  if (!investigator) {
    return null;
  }
  if (skipRender && skipRender(theDeck, investigator)) {
    return null;
  }
  return (
    <DeckListRow
      deck={theDeck}
      lang={lang}
      previousDeck={thePreviousDeck}
      onPress={onDeckPress}
      investigator={investigator}
      details={details}
      subDetails={subDetails}
      compact={compact}
      viewDeckButton={viewDeckButton}
      killedOrInsane={killedOrInsane}
    />
  );
}
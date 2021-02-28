import React, { useCallback, useContext, useMemo } from 'react';
import { concat, flatMap, findIndex, keys, map, sortBy } from 'lodash';
import { t } from 'ttag';

import { showCard, showCardSwipe } from '@components/nav/helper';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { DeckChanges, ParsedDeck, Slots } from '@actions/types';
import Card, { CardsMap } from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import DeckBubbleHeader from '../section/DeckBubbleHeader';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import DeckSectionBlock from '../section/DeckSectionBlock';

interface Props {
  componentId: string;
  cards: CardsMap;
  parsedDeck: ParsedDeck;
  tabooSetId?: number;
  onTitlePress?: (deck: ParsedDeck) => void;
  singleCardView?: boolean;
  title?: string;
  editable: boolean;
  footerButton?: React.ReactNode;
}

function hasChanges(changes?: DeckChanges): boolean {
  return !!(changes && (
    keys(changes.upgraded).length ||
    keys(changes.added).length ||
    keys(changes.removed).length ||
    keys(changes.exiled).length
  ));
}

export default function ChangesFromPreviousDeck({
  componentId,
  cards,
  parsedDeck,
  tabooSetId,
  onTitlePress,
  singleCardView,
  title,
  editable,
  footerButton,
}: Props) {
  const { colors } = useContext(StyleContext);
  const {
    investigator,
    changes,
  } = parsedDeck;
  const getCards = useCallback((slots: Slots): Card[] => {
    if (!keys(slots).length) {
      return [];
    }
    return sortBy(
      sortBy(
        flatMap(keys(slots), code => cards[code] || []),
        card => card.xp || 0),
      card => card.name
    );
  }, [cards]);

  const allCards = useMemo(() => {
    if (!changes) {
      return [];
    }
    return concat(
      getCards(changes.upgraded),
      getCards(changes.added),
      getCards(changes.removed),
      getCards(changes.exiled)
    );
  }, [changes, getCards]);

  const showCardPressed = useCallback((card: Card) => {
    if (singleCardView) {
      showCard(componentId, card.code, card, colors, true);
    } else {
      showCardSwipe(
        componentId,
        map(allCards, card => card.code),
        findIndex(allCards, c => c.code === card.code),
        colors,
        allCards,
        true,
        tabooSetId,
        parsedDeck.id,
        investigator
      );
    }
  }, [colors, allCards, componentId, investigator, parsedDeck.id, tabooSetId, singleCardView]);

  const faction = parsedDeck.investigator.factionCode();
  const renderSection = useCallback((slots: Slots, id: string, title: string) => {
    const cards = getCards(slots);
    if (!cards.length) {
      return null;
    }

    return (
      <>
        <DeckBubbleHeader title={title} />
        { map(cards, (card, idx) => (
          <CardSearchResult
            onPress={showCardPressed}
            key={card.code}
            card={card}
            control={{
              type: 'count',
              count: slots[card.code],
              deltaCountMode: true,
            }}
            noBorder={idx === (cards.length - 1)}
          />
        )) }
      </>
    );
  }, [showCardPressed, getCards]);

  const handleTitlePress = useCallback(() => {
    if (onTitlePress) {
      onTitlePress(parsedDeck);
    }
  }, [onTitlePress, parsedDeck]);

  const editsSection = useMemo(() => {
    if (changes && hasChanges(changes)) {
      return (
        <>
          { renderSection(changes.upgraded, 'upgrade', t`Upgraded`) }
          { renderSection(changes.added, 'added', t`Added`) }
          { renderSection(changes.removed, 'removed', t`Removed`) }
          { renderSection(changes.exiled, 'exiled', t`Exiled`) }
        </>
      );
    }
    return (
      <DeckBubbleHeader title={t`No Changes` } />
    );
  }, [changes, renderSection]);
  return (
    <DeckSectionBlock
      faction={faction}
      title={title || (editable ? t`Latest upgrade` : t`Card changes`)}
      footerButton={footerButton || (onTitlePress && <RoundedFooterButton title={t`View deck`} icon="deck" onPress={handleTitlePress} />)}
    >
      { editsSection }
    </DeckSectionBlock>
  );
}

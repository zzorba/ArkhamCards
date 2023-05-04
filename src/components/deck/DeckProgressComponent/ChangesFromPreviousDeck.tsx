import React, { useCallback, useContext, useMemo } from 'react';
import { Text, View } from 'react-native';
import { concat, flatMap, findIndex, keys, map, sortBy } from 'lodash';
import { t, msgid, ngettext } from 'ttag';

import { showCard, showCardSwipe } from '@components/nav/helper';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { DeckChanges, DeckId, ParsedDeck, Slots } from '@actions/types';
import Card, { CardsMap } from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import DeckBubbleHeader from '../section/DeckBubbleHeader';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import DeckSectionBlock from '../section/DeckSectionBlock';
import space from '@styles/space';

interface Props {
  componentId: string;
  cards: CardsMap;
  parsedDeck: ParsedDeck;
  tabooSetId?: number;
  deckId: DeckId;
  onTitlePress?: (deckId: DeckId, deck: ParsedDeck) => void;
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
    keys(changes.customized).length ||
    keys(changes.exiled).length
  ));
}

export default function ChangesFromPreviousDeck({
  componentId,
  cards,
  parsedDeck,
  deckId,
  tabooSetId,
  onTitlePress,
  singleCardView,
  title,
  editable,
  footerButton,
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  const {
    investigator,
    changes,
  } = parsedDeck;
  const getCards = useCallback((slots: Slots, id: string): {
    id: string;
    card: Card;
  }[] => {
    if (!keys(slots).length) {
      return [];
    }
    return map(sortBy(
      sortBy(
        flatMap(keys(slots), code => cards[code] || []),
        card => card.xp || 0),
      card => card.name
    ), card => {
      return {
        id,
        card,
      };
    });
  }, [cards]);

  const discountCards = useMemo(() => {
    if (!changes?.specialDiscounts.cards.length) {
      return [];
    }
    return sortBy(flatMap(changes.specialDiscounts.cards, discount => {
      const card = cards[discount.code];
      if (!card) {
        return [];
      }
      return {
        card,
        discount,
      }
    }), card => card.card.name)
  }, [changes?.specialDiscounts, cards])

  const allCards = useMemo(() => {
    if (!changes) {
      return [];
    }
    return concat(
      map(discountCards, card => {
        return {
          id: 'discount',
          card: card.card,
        };
      }),
      getCards(changes.upgraded, 'upgrade'),
      getCards(changes.added, 'added'),
      getCards(changes.removed, 'removed'),
      getCards(changes.customized, 'customized'),
      getCards(changes.exiled, 'exiled'),
    );
  }, [changes, discountCards, getCards]);

  const showCardPressed = useCallback((id: string, card: Card) => {
    console.log(id, card.code, map(allCards, c => c.id));
    if (singleCardView) {
      showCard(componentId, card.code, card, colors, true, parsedDeck.id, parsedDeck.customizations);
    } else {
      showCardSwipe(
        componentId,
        map(allCards, card => card.card.code),
        undefined,
        findIndex(allCards, c => c.id === id && c.card.code === card.code),
        colors,
        map(allCards, c => c.card),
        true,
        tabooSetId,
        parsedDeck.id,
        investigator,
        false,
        parsedDeck.customizations,
        editable
      );
    }
  }, [colors, allCards, investigator, componentId, parsedDeck.id,
    parsedDeck.customizations, tabooSetId, singleCardView, editable]);

  const faction = parsedDeck.investigator.factionCode();
  const renderSection = useCallback((slots: Slots, id: string, title: string) => {
    const cards = getCards(slots, id);
    if (!cards.length) {
      return null;
    }
    return (
      <>
        <DeckBubbleHeader title={title} />
        { map(cards, ({ card }, idx) => (
          <CardSearchResult
            onPressId={showCardPressed}
            key={card.code}
            id={id}
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
      onTitlePress(deckId, parsedDeck);
    }
  }, [onTitlePress, deckId, parsedDeck]);

  const editsSection = useMemo(() => {
    if (changes && hasChanges(changes)) {
      return (
        <>
          { renderSection(changes.upgraded, 'upgrade', t`Upgraded`) }
          { renderSection(changes.added, 'added', t`Added`) }
          { renderSection(changes.removed, 'removed', t`Removed`) }
          { renderSection(changes.customized, 'customized', t`Customization upgrades`) }
          { renderSection(changes.exiled, 'exiled', t`Exiled`) }
        </>
      );
    }
    return (
      <DeckBubbleHeader title={t`No Changes` } />
    );
  }, [changes, renderSection]);
  const remainingFreeCards = changes ? (changes.specialDiscounts.totalFreeCards - changes.specialDiscounts.usedFreeCards) : 0;
  return (
    <DeckSectionBlock
      faction={faction}
      title={title || (editable ? t`Latest upgrade` : t`Card changes`)}
      footerButton={footerButton || (onTitlePress && <RoundedFooterButton title={t`View deck`} icon="deck" onPress={handleTitlePress} />)}
    >
      { !!(discountCards.length || remainingFreeCards) && (
        <>
          <DeckBubbleHeader title={t`Special discounts`} />
          { (remainingFreeCards > 0) && (
            <View style={space.paddingSideS}>
              <Text style={typography.text}>
                { ngettext(
                  msgid`${remainingFreeCards} additional level 0 card may be added to the deck without spending experience.`,
                  `Up to ${remainingFreeCards} level 0 cards may be added to the deck  without spending experience.`,
                  remainingFreeCards
                ) }
              </Text>
            </View>
          ) }
          { map(discountCards, ({ discount, card }, idx) => {
            return (
              <CardSearchResult
                onPressId={showCardPressed}
                key={card.code}
                id="discount"
                card={card}
                control={{
                  type: 'discount',
                  available: discount.available,
                  used: discount.used,
                }}
                noBorder={idx === (discountCards.length - 1)}
              />
            );
          }) }
        </>
      ) }
      { editsSection }
    </DeckSectionBlock>
  );
}

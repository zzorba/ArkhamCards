import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Brackets } from 'typeorm/browser';

import { Deck, DeckMeta, Slots } from '@actions/types';
import { VERSATILE_CODE, ON_YOUR_OWN_CODE } from '@app_constants';
import CardSearchComponent from '@components/cardlist/CardSearchComponent';
import { queryForInvestigator, negativeQueryForInvestigator } from '@lib/InvestigatorRequirements';
import FilterBuilder, { defaultFilterState } from '@lib/filters';
import { STORY_CARDS_QUERY, ON_YOUR_OWN_RESTRICTION, where, combineQueries } from '@data/query';
import { parseDeck } from '@lib/parseDeck';
import DeckNavFooter from '../DeckNavFooter';
import { NavigationProps } from '@components/nav/types';
import { useInvestigatorCards, usePlayerCards, useSlots } from '@components/core/hooks';

export interface EditDeckProps {
  deck: Deck;
  previousDeck?: Deck;
  xpAdjustment?: number;
  storyOnly?: boolean;
  slots: Slots;
  meta: DeckMeta;
  ignoreDeckLimitSlots: Slots;
  updateSlots: (slots: Slots) => void;
  tabooSetOverride?: number;
}

type Props = NavigationProps & EditDeckProps;

export default function DeckEditView({
  componentId,
  deck,
  previousDeck,
  xpAdjustment,
  storyOnly,
  slots,
  meta,
  ignoreDeckLimitSlots,
  updateSlots,
  tabooSetOverride,
}: Props) {
  const [deckCardCounts, updatedDeckCardCounts] = useSlots(slots, updateSlots);
  const investigators = useInvestigatorCards(tabooSetOverride || 0);
  const [hideVersatile, setHideVersatile] = useState(false);
  const investigator = useMemo(() => {
    const investigator_code = meta?.alternate_back || deck?.investigator_code;
    return investigator_code && investigators && investigators[investigator_code];
  }, [deck, meta, investigators]);
  useEffect(() => {
    updatedDeckCardCounts({ type: 'sync', slots });
  }, [slots, updatedDeckCardCounts]);
  const onDeckCountChange = useCallback((code: string, count: number) => {
    updatedDeckCardCounts({ type: 'set-slot', code, value: count });
  }, [updatedDeckCardCounts]);

  const cards = usePlayerCards(deck.taboo_id || 0);
  const renderFooter = useCallback((updatedDeckCardCounts?: Slots, controls?: React.ReactNode) => {
    const slots = updatedDeckCardCounts || deckCardCounts;
    if (!cards) {
      return null;
    }
    const pDeck = parseDeck(
      deck,
      meta,
      slots,
      ignoreDeckLimitSlots,
      cards,
      previousDeck
    );
    if (!pDeck) {
      return null;
    }
    return (
      <DeckNavFooter
        componentId={componentId}
        parsedDeck={pDeck}
        xpAdjustment={xpAdjustment || 0}
        controls={controls}
      />
    );
  }, [
    componentId,
    deck,
    ignoreDeckLimitSlots,
    previousDeck,
    cards,
    xpAdjustment,
    meta,
    deckCardCounts,
  ]);
  const versatile = !hideVersatile && (deckCardCounts[VERSATILE_CODE] > 0);
  const onYourOwn = deckCardCounts[ON_YOUR_OWN_CODE] > 0;
  const queryOpt = useMemo(() => {
    if (storyOnly) {
      return combineQueries(
        STORY_CARDS_QUERY,
        [where(`c.subtype_code != 'basicweakness'`)],
        'and'
      );
    }
    if (!investigator) {
      return undefined;
    }
    const investigatorPart = investigator && queryForInvestigator(investigator, meta);
    const parts: Brackets[] = [
      ...(investigatorPart ? [investigatorPart] : []),
    ];
    if (versatile) {
      const versatileQuery = new FilterBuilder('versatile').filterToQuery({
        ...defaultFilterState,
        factions: ['guardian', 'seeker', 'rogue', 'mystic', 'survivor'],
        level: [0, 0],
        levelEnabled: true,
      });
      if (versatileQuery) {
        const invertedClause = negativeQueryForInvestigator(investigator, meta);
        if (invertedClause) {
          parts.push(
            new Brackets(qb => qb.where(invertedClause).andWhere(versatileQuery))
          );
        } else {
          parts.push(versatileQuery);
        }
      }
    }
    const joinedQuery = combineQueries(
      STORY_CARDS_QUERY,
      parts,
      'or'
    );
    if (onYourOwn) {
      return combineQueries(joinedQuery, [ON_YOUR_OWN_RESTRICTION], 'and');
    }
    return joinedQuery;
  }, [meta, storyOnly, investigator, versatile, onYourOwn]);

  if (!investigator || !queryOpt) {
    return null;
  }
  return (
    <CardSearchComponent
      componentId={componentId}
      tabooSetOverride={deck.taboo_id || 0}
      baseQuery={queryOpt}
      originalDeckSlots={deck.slots}
      investigator={investigator}
      deckCardCounts={deckCardCounts}
      hideVersatile={hideVersatile}
      setHideVersatile={deckCardCounts[VERSATILE_CODE] > 0 ? setHideVersatile : undefined}
      onDeckCountChange={onDeckCountChange}
      renderFooter={renderFooter}
      storyOnly={storyOnly}
      modal
    />
  );
}

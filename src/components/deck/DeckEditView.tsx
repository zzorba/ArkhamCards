import React, { useMemo, useState } from 'react';

import { VERSATILE_CODE } from '@app_constants';
import CardSearchComponent from '@components/cardlist/CardSearchComponent';
import { queryForInvestigator } from '@lib/InvestigatorRequirements';
import { FilterState } from '@lib/filters';
import { STORY_CARDS_QUERY, where, combineQueries, DECK_BUILDING_OPTION_CARDS_QUERY } from '@data/sqlite/query';
import { NavigationProps } from '@components/nav/types';
import { DeckEditState, useSimpleDeckEdits } from '@components/deck/hooks';
import { useDeck } from '@data/hooks';
import { DeckId, EditDeckState, Slots } from '@actions/types';
import { useInvestigatorChoice } from '@components/card/useSingleCard';
import { forEach, map, range } from 'lodash';
import Card from '@data/types/Card';
import { useCardMapFromQuery } from '@components/card/useCardList';

export interface EditDeckProps {
  id: DeckId;
  deckType?: 'side' | 'extra';
  storyOnly?: boolean;
  weaknessOnly?: boolean;
}

type Props = NavigationProps & EditDeckProps;

export default function DeckEditView({
  componentId,
  id,
  deckType,
  storyOnly,
  weaknessOnly,
}: Props) {
  const deck = useDeck(id);
  const deckEdits = useSimpleDeckEdits(id);
  const tabooSetId = (deckEdits?.tabooSetChange !== undefined ? deckEdits.tabooSetChange : deck?.deck.taboo_id) || 0;
  const [hideVersatile, setHideVersatile] = useState(false);
  const [hideSplash, setHideSplash] = useState(false);
  const investigator = useInvestigatorChoice(deck?.deck.investigator_code, deckEdits?.meta, tabooSetId);
  const [specialCards] = useCardMapFromQuery(DECK_BUILDING_OPTION_CARDS_QUERY);
  const hasVersatile = deckType !== 'extra' && (deckEdits && deckEdits.slots[VERSATILE_CODE] > 0);
  const isUpgrade = !!deck?.previousDeck;
  const meta = deckEdits?.meta;
  const queryOpt = useMemo(() => {
    if (weaknessOnly) {
      return () => combineQueries(
        STORY_CARDS_QUERY,
        [where(`c.subtype_code is not null AND c.encounter_code is null`)],
        'and'
      );
    }
    if (storyOnly) {
      return () => combineQueries(
        STORY_CARDS_QUERY,
        [where(`c.subtype_code is null OR c.subtype_code != 'basicweakness'`)],
        'and'
      );
    }
    if (!investigator) {
      return undefined;
    }
    return (filters: FilterState | undefined, slots: Slots | undefined) => {
      const specialDeckCards: Card[] = [];
      forEach(slots, (count, code) => {
        const card = specialCards[code];
        if (card && count > 0) {
          specialDeckCards.push(...map(range(0, count), () => card));
        }
      });
      const investigatorPart = queryForInvestigator(
        investigator,
        // Special deck building won't apply to extra decks, for now...
        deckType === 'extra' ? {} : slots,
        meta,
        specialDeckCards,
        {
          filters,
          isUpgrade,
          hideSplash,
          extraDeck: deckType === 'extra',
          side: deckType === 'side',
          hideVersatile,
          includeStory: true,
        },
      );
      return investigatorPart;
    }
  }, [specialCards, meta, deckType, isUpgrade, hideSplash, storyOnly, weaknessOnly, investigator, hideVersatile]);
  const mode = useMemo(() => {
    if (storyOnly || weaknessOnly) {
      return 'story';
    }
    if (deckType) {
      return deckType;
    }
    return undefined;
  }, [storyOnly, weaknessOnly, deckType]);

  if (!investigator || !queryOpt || !deck || !deckEdits) {
    return null;
  }
  const hasSplash = !!investigator.back.deck_options?.find(option => option.limit);

  return (
    <CardSearchComponent
      componentId={componentId}
      deckId={id}
      baseQuery={queryOpt}
      investigator={investigator}
      hideVersatile={hideVersatile}
      setHideVersatile={mode !== 'story' && hasVersatile ? setHideVersatile : undefined}
      hideSplash={hideSplash}
      setHideSplash={mode !== 'story' && hasSplash ? setHideSplash : undefined}
      mode={mode}
      screenType="deck"
    />
  );
}

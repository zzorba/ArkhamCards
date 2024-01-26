import React, { useMemo, useState } from 'react';
import { Brackets } from 'typeorm/browser';

import { VERSATILE_CODE, ON_YOUR_OWN_CODE } from '@app_constants';
import CardSearchComponent from '@components/cardlist/CardSearchComponent';
import { queryForInvestigator, negativeQueryForInvestigator } from '@lib/InvestigatorRequirements';
import FilterBuilder, { defaultFilterState, FilterState } from '@lib/filters';
import { STORY_CARDS_QUERY, ON_YOUR_OWN_RESTRICTION, where, combineQueries } from '@data/sqlite/query';
import { NavigationProps } from '@components/nav/types';
import { useSimpleDeckEdits } from '@components/deck/hooks';
import { useDeck } from '@data/hooks';
import { DeckId } from '@actions/types';
import useSingleCard from '@components/card/useSingleCard';

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
  const [investigator] = useSingleCard(deckEdits?.meta.alternate_back || deck?.deck.investigator_code, 'player', tabooSetId);

  const hasVersatile = deckType !== 'extra' && (deckEdits && deckEdits.slots[VERSATILE_CODE] > 0);
  const versatile = !hideVersatile && hasVersatile;
  const onYourOwn = deckType !== 'extra' && deckEdits && deckEdits.slots[ON_YOUR_OWN_CODE] > 0;
  const isUpgrade = !!deck?.previousDeck;

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
    return (filters: FilterState | undefined) => {
      const investigatorPart = investigator && queryForInvestigator(
        investigator,
        deckEdits?.meta,
        filters,
        {
          isUpgrade,
          hideSplash,
          extraDeck: deckType === 'extra',
          side: deckType === 'side',
        },
      );
      if (deckType === 'extra') {
        return investigatorPart;
      }
      const parts: Brackets[] = [
        ...(investigatorPart ? [investigatorPart] : []),
      ];

      if (!weaknessOnly && versatile && (!filters?.levelEnabled || filters?.level[0] === 0)) {
        const versatileQuery = new FilterBuilder('versatile').filterToQuery({
          ...defaultFilterState,
          factions: ['guardian', 'seeker', 'rogue', 'mystic', 'survivor'],
          level: [0, 0],
          levelEnabled: true,
        }, false);
        if (versatileQuery) {
          const invertedClause = negativeQueryForInvestigator(investigator, deckEdits?.meta, isUpgrade);
          if (invertedClause) {
            parts.push(
              new Brackets(qb => qb.where(invertedClause).andWhere(versatileQuery))
            );
          } else {
            parts.push(versatileQuery);
          }
        }
      }
      const joinedQuery = combineQueries(STORY_CARDS_QUERY, parts, 'or');
      if (onYourOwn) {
        return combineQueries(joinedQuery, [ON_YOUR_OWN_RESTRICTION], 'and');
      }
      return joinedQuery;
    }
  }, [deckEdits?.meta, deckType, isUpgrade, hideSplash, storyOnly, weaknessOnly, investigator, versatile, onYourOwn]);
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
  const hasSplash = !!investigator.deck_options?.find(option => option.limit);

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

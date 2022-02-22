import React, { useMemo, useState } from 'react';
import { Brackets } from 'typeorm/browser';

import { VERSATILE_CODE, ON_YOUR_OWN_CODE } from '@app_constants';
import CardSearchComponent from '@components/cardlist/CardSearchComponent';
import { queryForInvestigator, negativeQueryForInvestigator } from '@lib/InvestigatorRequirements';
import FilterBuilder, { defaultFilterState } from '@lib/filters';
import { STORY_CARDS_QUERY, ON_YOUR_OWN_RESTRICTION, where, combineQueries } from '@data/sqlite/query';
import { NavigationProps } from '@components/nav/types';
import { useSimpleDeckEdits } from '@components/deck/hooks';
import { useDeck } from '@data/hooks';
import { DeckId } from '@actions/types';
import useSingleCard from '@components/card/useSingleCard';

export interface EditDeckProps {
  id: DeckId;
  side?: boolean;
  storyOnly?: boolean;
  weaknessOnly?: boolean;
}

type Props = NavigationProps & EditDeckProps;

export default function DeckEditView({
  componentId,
  id,
  side,
  storyOnly,
  weaknessOnly,
}: Props) {
  const deck = useDeck(id);
  const deckEdits = useSimpleDeckEdits(id);
  const tabooSetId = (deckEdits?.tabooSetChange !== undefined ? deckEdits.tabooSetChange : deck?.deck.taboo_id) || 0;
  const [hideVersatile, setHideVersatile] = useState(false);
  const [investigator] = useSingleCard(deckEdits?.meta.alternate_back || deck?.deck.investigator_code, 'player', tabooSetId);

  const hasVersatile = (deckEdits && deckEdits.slots[VERSATILE_CODE] > 0);
  const versatile = !hideVersatile && hasVersatile;
  const onYourOwn = deckEdits && deckEdits.slots[ON_YOUR_OWN_CODE] > 0;
  const queryOpt = useMemo(() => {
    if (weaknessOnly) {
      return combineQueries(
        STORY_CARDS_QUERY,
        [where(`c.subtype_code is not null AND c.encounter_code is null`)],
        'and'
      );
    }
    if (storyOnly) {
      return combineQueries(
        STORY_CARDS_QUERY,
        [where(`c.subtype_code is null OR c.subtype_code != 'basicweakness'`)],
        'and'
      );
    }
    if (!investigator) {
      return undefined;
    }
    const investigatorPart = investigator && queryForInvestigator(investigator, deckEdits?.meta);
    const parts: Brackets[] = [
      ...(investigatorPart ? [investigatorPart] : []),
    ];
    if (versatile) {
      const versatileQuery = new FilterBuilder('versatile').filterToQuery({
        ...defaultFilterState,
        factions: ['guardian', 'seeker', 'rogue', 'mystic', 'survivor'],
        level: [0, 0],
        levelEnabled: true,
      }, false);
      if (versatileQuery) {
        const invertedClause = negativeQueryForInvestigator(investigator, deckEdits?.meta);
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
  }, [deckEdits?.meta, storyOnly, weaknessOnly, investigator, versatile, onYourOwn]);
  const mode = useMemo(() => {
    if (storyOnly) {
      return 'story';
    }
    if (side) {
      return 'side';
    }
  }, [storyOnly, side]);

  if (!investigator || !queryOpt || !deck || !deckEdits) {
    return null;
  }
  return (
    <CardSearchComponent
      componentId={componentId}
      deckId={id}
      baseQuery={queryOpt}
      investigator={investigator}
      hideVersatile={hideVersatile}
      setHideVersatile={hasVersatile ? setHideVersatile : undefined}
      mode={mode}
    />
  );
}

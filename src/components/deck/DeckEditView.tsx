import React, { useMemo, useState } from 'react';
import { Brackets } from 'typeorm/browser';

import { VERSATILE_CODE, ON_YOUR_OWN_CODE } from '@app_constants';
import CardSearchComponent from '@components/cardlist/CardSearchComponent';
import { queryForInvestigator, negativeQueryForInvestigator } from '@lib/InvestigatorRequirements';
import FilterBuilder, { defaultFilterState } from '@lib/filters';
import { STORY_CARDS_QUERY, ON_YOUR_OWN_RESTRICTION, where, combineQueries } from '@data/sqlite/query';
import { NavigationProps } from '@components/nav/types';
import { useDeck, useInvestigatorCards } from '@components/core/hooks';
import { useSimpleDeckEdits } from '@components/deck/hooks';
import { DeckId } from '@actions/types';

export interface EditDeckProps {
  id: DeckId;
  storyOnly?: boolean;
}

type Props = NavigationProps & EditDeckProps;

export default function DeckEditView({
  componentId,
  id,
  storyOnly,
}: Props) {
  const [deck] = useDeck(id);
  const deckEdits = useSimpleDeckEdits(id);
  const tabooSetId = (deckEdits?.tabooSetChange !== undefined ? deckEdits.tabooSetChange : deck?.taboo_id) || 0;
  const investigators = useInvestigatorCards(tabooSetId);
  const [hideVersatile, setHideVersatile] = useState(false);
  const investigator = useMemo(() => {
    const investigator_code = deckEdits?.meta.alternate_back || deck?.investigator_code;
    return investigator_code && investigators && investigators[investigator_code];
  }, [deck, deckEdits, investigators]);

  const hasVersatile = (deckEdits && deckEdits.slots[VERSATILE_CODE] > 0);
  const versatile = !hideVersatile && hasVersatile;
  const onYourOwn = deckEdits && deckEdits.slots[ON_YOUR_OWN_CODE] > 0;
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
      }, true);
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
    const joinedQuery = combineQueries(
      STORY_CARDS_QUERY,
      parts,
      'or'
    );
    if (onYourOwn) {
      return combineQueries(joinedQuery, [ON_YOUR_OWN_RESTRICTION], 'and');
    }
    return joinedQuery;
  }, [deckEdits?.meta, storyOnly, investigator, versatile, onYourOwn]);

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
      storyOnly={storyOnly}
    />
  );
}

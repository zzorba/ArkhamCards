import React, { useCallback } from 'react';
import { Brackets } from 'typeorm/browser';

import CardSearchComponent from '../cardlist/CardSearchComponent';
import { NavigationProps } from '@components/nav/types';
import { combineQueries, where } from '@data/sqlite/query';
import { SORT_BY_PACK } from '@actions/types';
import { t } from 'ttag';
import FilterBuilder from '@lib/filters';

export interface PackCardsProps {
  pack_code: string;
  baseQuery?: Brackets;
}

type Props = NavigationProps & PackCardsProps;

export default function PackCardsView({
  componentId,
  pack_code,
  baseQuery,
}: Props) {
  const query = useCallback(() => {
    const filters = new FilterBuilder('packs');
    return combineQueries(
      where(`(c.hidden is null OR not c.hidden)`),
      [
        ...filters.packCodes([pack_code]),
        ...(baseQuery ? [baseQuery] : []),
      ],
      'and'
    );
  }, [pack_code, baseQuery]);
  return (
    <CardSearchComponent
      componentId={componentId}
      baseQuery={query}
      sort={SORT_BY_PACK}
      showNonCollection
      includeDuplicates
      screenType="pack"
    />
  );
}

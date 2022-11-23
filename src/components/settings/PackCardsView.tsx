import React, { useCallback, useMemo } from 'react';
import { Brackets } from 'typeorm/browser';

import CardSearchComponent from '../cardlist/CardSearchComponent';
import { NavigationProps } from '@components/nav/types';
import { combineQueries, where } from '@data/sqlite/query';

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
    return combineQueries(
      where(`c.pack_code = '${pack_code}' AND (c.hidden is null OR not c.hidden)`),
      baseQuery ? [baseQuery] : [],
      'and'
    );
  }, [pack_code, baseQuery]);
  return (
    <CardSearchComponent
      componentId={componentId}
      baseQuery={query}
      sort="pack"
      showNonCollection
      includeDuplicates
    />
  );
}

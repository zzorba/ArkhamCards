import React from 'react';
import { Brackets } from 'typeorm/browser';

import QueryProvider from '@components/data/QueryProvider';
import CardSearchComponent from '../cardlist/CardSearchComponent';
import { NavigationProps } from '@components/nav/types';
import { combineQueries, where } from '@data/query';

export interface PackCardsProps {
  pack_code: string;
  baseQuery?: Brackets;
}

type Props = NavigationProps & PackCardsProps;

type QueryProps = Pick<PackCardsProps, 'pack_code' | 'baseQuery'>;
function getQuery({ pack_code, baseQuery }: QueryProps) {
  return combineQueries(
    where(`c.pack_code = '${pack_code}'`),
    baseQuery ? [baseQuery] : [],
    'and'
  );
}

export default function PackCardsView({
  componentId,
  pack_code,
  baseQuery,
}: Props) {

  return (
    <QueryProvider<QueryProps, Brackets | undefined>
      pack_code={pack_code}
      baseQuery={baseQuery}
      getQuery={getQuery}
    >
      { query => (
        <CardSearchComponent
          componentId={componentId}
          baseQuery={query}
          showNonCollection
          mythosToggle={false}
        />
      ) }
    </QueryProvider>
  );
}

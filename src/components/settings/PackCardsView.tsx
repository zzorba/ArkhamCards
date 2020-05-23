import React from 'react';
import { Brackets } from 'typeorm';

import CardSearchComponent from '../cardlist/CardSearchComponent';
import { NavigationProps } from 'components/nav/types';
import { combineQueries, where } from 'data/query';

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

  return (
    <CardSearchComponent
      componentId={componentId}
      baseQuery={combineQueries(
        where(`c.pack_code = '${pack_code}'`),
        baseQuery ? [baseQuery] : [],
        'and'
      )}
      showNonCollection
    />
  );
}

import React from 'react';

import CardSearchComponent from '../cardlist/CardSearchComponent';
import { NavigationProps } from 'components/nav/types';

export interface PackCardsProps {
  pack_code: string;
  baseQuery?: string;
}

type Props = NavigationProps & PackCardsProps;

export default function PackCardsView({
  componentId,
  pack_code,
  baseQuery,
}: Props) {
  const parts: string[] = [];
  if (baseQuery) {
    parts.push(baseQuery);
  }
  parts.push(`pack_code == '${pack_code}'`);

  return (
    <CardSearchComponent
      componentId={componentId}
      baseQuery={parts.join(' and ')}
      showNonCollection
    />
  );
}

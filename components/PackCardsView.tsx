import React from 'react';
import PropTypes from 'prop-types';

import CardSearchComponent from './CardSearchComponent';

interface Props {
  componentId: string;
  pack_code: string;
  baseQuery?: string;
}

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

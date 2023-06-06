import React from 'react';

import { SortType, SORT_BY_TYPE, BROWSE_CARDS } from '@actions/types';
import CardSearchComponent from './CardSearchComponent';
import withFetchCardsGate from '@components/card/withFetchCardsGate';

interface Props {
  componentId: string;
}

function BrowseCardsView({ componentId }: Props) {
  return (
    <CardSearchComponent
      componentId={componentId}
      mythosToggle
      filterId={BROWSE_CARDS}
    />
  );
}

export default withFetchCardsGate<Props>(
  BrowseCardsView,
  { promptForUpdate: false }
);

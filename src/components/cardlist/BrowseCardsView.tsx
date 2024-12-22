import React from 'react';

import { BROWSE_CARDS } from '@actions/types';
import CardSearchComponent from './CardSearchComponent';
import withFetchCardsGate from '@components/card/withFetchCardsGate';

interface Props extends Record<string, unknown>{
  componentId: string;
}

function BrowseCardsView({ componentId }: Props) {
  return (
    <CardSearchComponent
      componentId={componentId}
      mythosToggle
      filterId={BROWSE_CARDS}
      screenType="browse"
    />
  );
}

export default withFetchCardsGate<Props>(
  BrowseCardsView,
  { promptForUpdate: true }
);

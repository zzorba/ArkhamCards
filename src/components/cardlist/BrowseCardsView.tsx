import React from 'react';

import { BROWSE_CARDS } from '@actions/types';
import CardSearchComponent from './CardSearchComponent';
import withFetchCardsGate from '@components/card/withFetchCardsGate';

function BrowseCardsView() {
  return (
    <CardSearchComponent
      mythosToggle
      filterId={BROWSE_CARDS}
      screenType="browse"
    />
  );
}

export default withFetchCardsGate(
  BrowseCardsView,
  { promptForUpdate: true }
);

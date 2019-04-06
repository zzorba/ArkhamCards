import React from 'react';

import { SortType } from './CardSortDialog/constants';
import CardSearchComponent from './CardSearchComponent';
import withFetchCardsGate from './cards/withFetchCardsGate';

interface Props {
  componentId: string;
  baseQuery?: string;
  sort?: SortType;
}

class CardSearchView extends React.Component<Props> {
  render() {
    const {
      componentId,
      baseQuery,
      sort,
    } = this.props;

    return (
      <CardSearchComponent
        componentId={componentId}
        mythosToggle={!baseQuery}
        baseQuery={baseQuery}
        sort={sort}
      />
    );
  }
}

export default withFetchCardsGate<Props>(
  CardSearchView,
  { promptForUpdate: true }
);

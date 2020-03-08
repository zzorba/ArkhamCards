import React from 'react';

import { SortType } from 'actions/types';
import CardSearchComponent from './CardSearchComponent';
import withFetchCardsGate from 'components/card/withFetchCardsGate';

interface Props {
  componentId: string;
  baseQuery?: string;
  sort?: SortType;
}

class CardSearchView extends React.PureComponent<Props> {
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

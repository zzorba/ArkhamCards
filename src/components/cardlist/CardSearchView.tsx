import React from 'react';

import { SortType, SORT_BY_TYPE } from 'actions/types';
import CardSearchComponent from './CardSearchComponent';
import withFetchCardsGate from '@components/card/withFetchCardsGate';

interface Props {
  componentId: string;
  sort?: SortType;
}

class CardSearchView extends React.PureComponent<Props> {
  render() {
    const {
      componentId,
      sort,
    } = this.props;

    return (
      <CardSearchComponent
        componentId={componentId}
        mythosToggle
        sort={sort || SORT_BY_TYPE}
      />
    );
  }
}

export default withFetchCardsGate<Props>(
  CardSearchView,
  { promptForUpdate: true }
);

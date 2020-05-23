import React from 'react';

import { SortType } from 'actions/types';
import { Brackets } from 'typeorm';
import CardSearchComponent from './CardSearchComponent';
import withFetchCardsGate from 'components/card/withFetchCardsGate';

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
        sort={sort}
      />
    );
  }
}

export default withFetchCardsGate<Props>(
  CardSearchView,
  { promptForUpdate: true }
);

import React from 'react';
import { t } from 'ttag';

import { SortType, SORT_BY_TYPE } from '@actions/types';
import CardSearchComponent, { navigationOptions } from './CardSearchComponent';
import withFetchCardsGate from '@components/card/withFetchCardsGate';
import { Navigation } from 'react-native-navigation';

interface Props {
  componentId: string;
  sort?: SortType;
}

class CardSearchView extends React.Component<Props> {
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

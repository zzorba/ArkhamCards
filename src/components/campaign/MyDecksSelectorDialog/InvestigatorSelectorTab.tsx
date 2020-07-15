import React from 'react';
import { Navigation } from 'react-native-navigation';

import { SortType } from 'actions/types';
import InvestigatorsListComponent from '@components/cardlist/InvestigatorsListComponent';
import Card from '@data/Card';

interface Props {
  componentId: string;
  onInvestigatorSelect: (card: Card) => void;
  customHeader: React.ReactNode;
  sort: SortType;

  onlyDeckIds?: number[];
  filterDeckIds: number[];
  filterInvestigators: string[];
}

export default class InvestigatorSelectorTab extends React.Component<Props> {
  _investigatorSelected = (card: Card) => {
    const {
      onInvestigatorSelect,
      componentId,
    } = this.props;
    onInvestigatorSelect(card);
    Navigation.dismissModal(componentId);
  };

  render() {
    const {
      componentId,
      customHeader,
      filterInvestigators,
      sort,
    } = this.props;

    return (
      <InvestigatorsListComponent
        componentId={componentId}
        hideDeckbuildingRules
        sort={sort}
        customHeader={customHeader}
        onPress={this._investigatorSelected}
        filterInvestigators={filterInvestigators}
      />
    );
  }
}

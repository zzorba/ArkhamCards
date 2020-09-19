import React from 'react';
import { Navigation } from 'react-native-navigation';

import { SortType } from '@actions/types';
import InvestigatorsListComponent from '@components/cardlist/InvestigatorsListComponent';
import Card from '@data/Card';
import { SearchOptions } from '@components/core/CollapsibleSearchBox';

interface Props {
  componentId: string;
  onInvestigatorSelect: (card: Card) => void;
  searchOptions?: SearchOptions;
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
      searchOptions,
      filterInvestigators,
      sort,
    } = this.props;

    return (
      <InvestigatorsListComponent
        componentId={componentId}
        hideDeckbuildingRules
        sort={sort}
        searchOptions={searchOptions}
        onPress={this._investigatorSelected}
        filterInvestigators={filterInvestigators}
      />
    );
  }
}

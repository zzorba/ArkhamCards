import React from 'react';
import { Navigation } from 'react-native-navigation';

import MyDecksComponent from '@components/decklist/MyDecksComponent';
import { Deck } from '@actions/types';
import { SearchOptions } from '@components/core/CollapsibleSearchBox';

interface Props {
  componentId: string;
  onDeckSelect: (deck: Deck) => void;
  searchOptions?: SearchOptions;

  onlyDeckIds?: number[];
  onlyInvestigators?: string[];
  filterDeckIds: number[];
  filterInvestigators: string[];
}

export default class DeckSelectorTab extends React.Component<Props> {
  _deckSelected = (deck: Deck) => {
    const {
      onDeckSelect,
      componentId,
    } = this.props;
    onDeckSelect(deck);
    Navigation.dismissModal(componentId);
  }

  render() {
    const {
      componentId,
      searchOptions,
      filterInvestigators,
      filterDeckIds,
      onlyDeckIds,
      onlyInvestigators,
    } = this.props;

    return (
      <MyDecksComponent
        componentId={componentId}
        searchOptions={searchOptions}
        deckClicked={this._deckSelected}
        onlyDeckIds={onlyDeckIds}
        onlyInvestigators={onlyInvestigators}
        filterDeckIds={filterDeckIds}
        filterInvestigators={filterInvestigators}
      />
    );
  }
}

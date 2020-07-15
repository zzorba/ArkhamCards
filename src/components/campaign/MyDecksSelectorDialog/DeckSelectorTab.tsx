import React from 'react';
import { Navigation } from 'react-native-navigation';

import MyDecksComponent from '@components/decklist/MyDecksComponent';
import { Deck } from 'actions/types';

interface Props {
  componentId: string;
  onDeckSelect: (deck: Deck) => void;
  customHeader: React.ReactNode;

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
      customHeader,
      filterInvestigators,
      filterDeckIds,
      onlyDeckIds,
      onlyInvestigators,
    } = this.props;

    return (
      <MyDecksComponent
        componentId={componentId}
        customHeader={customHeader}
        deckClicked={this._deckSelected}
        onlyDeckIds={onlyDeckIds}
        onlyInvestigators={onlyInvestigators}
        filterDeckIds={filterDeckIds}
        filterInvestigators={filterInvestigators}
      />
    );
  }
}

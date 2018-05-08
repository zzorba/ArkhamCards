import React from 'react';
import PropTypes from 'prop-types';
import { filter } from 'lodash';

import DeckListComponent from './DeckListComponent';

export default class MyDecksComponent extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    deckClicked: PropTypes.func.isRequired,
    filterDeckIds: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      deckIds: [
        147613,
        147630,
        147631,
        147632,
        147633,
        5168,
        5167,
        4922,
        4946,
        4950,
        4519,
        101,
        381,
        180,
        530,
        2932,
        294,
        1179,
        2381,
        132081,
        137338,
      ],
    };
  }

  render() {
    const {
      navigator,
      deckClicked,
      filterDeckIds = [],
    } = this.props;

    const filterDeckIdsSet = new Set(filterDeckIds);

    return (
      <DeckListComponent
        navigator={navigator}
        deckIds={filter(this.state.deckIds, deckId => !filterDeckIdsSet.has(deckId))}
        deckClicked={deckClicked}
      />
    );
  }
}

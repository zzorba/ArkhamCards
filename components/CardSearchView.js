import React from 'react';
import PropTypes from 'prop-types';

import CardSearchComponent from './CardSearchComponent';
import FetchCardsGate from './FetchCardsGate';

export default class CardSearchView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    baseQuery: PropTypes.string,
    sort: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      navigator,
      baseQuery,
      sort,
    } = this.props;

    return (
      <FetchCardsGate>
        <CardSearchComponent
          navigator={navigator}
          baseQuery={baseQuery}
          sort={sort}
        />
      </FetchCardsGate>
    );
  }
}

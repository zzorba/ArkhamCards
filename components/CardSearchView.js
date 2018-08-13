import React from 'react';
import PropTypes from 'prop-types';

import CardSearchComponent from './CardSearchComponent';
import withFetchCardsGate from './cards/withFetchCardsGate';

class CardSearchView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    baseQuery: PropTypes.string,
    sort: PropTypes.string,
  };

  render() {
    const {
      navigator,
      baseQuery,
      sort,
    } = this.props;

    return (
      <CardSearchComponent
        navigator={navigator}
        mythosToggle={!baseQuery}
        baseQuery={baseQuery}
        sort={sort}
      />
    );
  }
}

export default withFetchCardsGate(CardSearchView, { promptForUpdate: true });

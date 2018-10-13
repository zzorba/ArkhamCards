import React from 'react';
import PropTypes from 'prop-types';

import CardSearchComponent from './CardSearchComponent';
import withFetchCardsGate from './cards/withFetchCardsGate';

class CardSearchView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    baseQuery: PropTypes.string,
    sort: PropTypes.string,
  };

  render() {
    const {
      componentId,
      baseQuery,
      sort,
    } = this.props;

    return (
      <CardSearchComponent
        componentId={componentId}
        mythosToggle={!baseQuery}
        baseQuery={baseQuery}
        sort={sort}
      />
    );
  }
}

export default withFetchCardsGate(CardSearchView, { promptForUpdate: true });

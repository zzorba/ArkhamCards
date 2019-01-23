import React from 'react';
import PropTypes from 'prop-types';

import CardSearchComponent from './CardSearchComponent';

export default class PackCardsView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    pack_code: PropTypes.string.isRequired,
    baseQuery: PropTypes.string,
  };

  render() {
    const {
      componentId,
      pack_code,
      baseQuery,
    } = this.props;
    const parts = [];
    if (baseQuery) {
      parts.push(baseQuery);
    }
    parts.push(`pack_code == '${pack_code}'`);

    return (
      <CardSearchComponent
        componentId={componentId}
        baseQuery={parts.join(' and ')}
        showNonCollection
      />
    );
  }
}

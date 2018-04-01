import React from 'react';
import PropTypes from 'prop-types';

import CardSearchComponent from '../cards/CardSearchView/CardSearchComponent';

export default class PackCardsView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    pack_code: PropTypes.string.isRequired,
  };

  render() {
    const {
      navigator,
      pack_code,
    } = this.props;

    return (
      <CardSearchComponent
        navigator={navigator}
        baseQuery={`pack_code == '${pack_code}'`}
      />
    );
  }
}

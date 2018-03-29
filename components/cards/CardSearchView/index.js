import React from 'react';
import PropTypes from 'prop-types';

import CardSearchComponent from './CardSearchComponent';

export default class CardSearchView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
  };

  render() {
    const {
      navigator,
    } = this.props;

    return (
      <CardSearchComponent navigator={navigator}/>
    );
  }
}

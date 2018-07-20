import React from 'react';
import PropTypes from 'prop-types';

import TwoSidedCardComponent from './TwoSidedCardComponent';

export default class SignatureCardItem extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    card: PropTypes.object.isRequired,
  };

  render() {
    const {
      card,
      navigator,
    } = this.props;

    return (
      <TwoSidedCardComponent
        navigator={navigator}
        card={card}
      />
    );
  }
}

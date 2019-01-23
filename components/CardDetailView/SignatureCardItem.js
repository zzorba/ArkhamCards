import React from 'react';
import PropTypes from 'prop-types';

import TwoSidedCardComponent from './TwoSidedCardComponent';

export default class SignatureCardItem extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    card: PropTypes.object.isRequired,
  };

  render() {
    const {
      card,
      componentId,
    } = this.props;

    return (
      <TwoSidedCardComponent
        componentId={componentId}
        card={card}
      />
    );
  }
}

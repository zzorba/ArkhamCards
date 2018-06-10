import React from 'react';
import PropTypes from 'prop-types';

import CardDetailView from './index';

export default class SignatureCardItem extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    card: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      navigator,
      card,
    } = this.props;
    navigator.push({
      screen: 'Card',
      passProps: {
        id: card.code,
        pack_code: card.pack_code,
      },
    });
  }

  render() {
    const {
      card,
      navigator,
    } = this.props;

    return (
      <CardDetailView
        navigator={navigator}
        id={card.code}
        card={card}
        pack_code={card.pack_code}
        linked
      />
    );
  }
}

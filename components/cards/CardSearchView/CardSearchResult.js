import React from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
const {
  Text,
  TouchableOpacity,
} = require('react-native');

import { CardType } from '../types';

export default class CardSearchResult extends React.PureComponent {
  static propTypes = {
    card: CardType,
    onPress: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.card.code);
  }

  render() {
    const {
      card,
    } = this.props;
    if (!card.name) {
      return <Text>No Text</Text>;
    }
    const xpStr = (card.xp && range(0, card.xp).map(() => '•').join('')) || '';
    return (
      <TouchableOpacity onPress={this._onPress}>
        <Text>{ `${card.name}${xpStr}` }</Text>
      </TouchableOpacity>
    );
  }
}

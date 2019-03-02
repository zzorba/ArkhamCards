import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';

import CardSearchResult from '../CardSearchResult';

export default class CardToggleRow extends React.Component {
  static propTypes = {
    card: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    limit: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      one: props.count > 0,
      two: props.count > 1,
    };

    this._syncChange = this.syncChange.bind(this);
    this._onCardOneToggle = this.onCardToggle.bind(this, 'one');
    this._onCardTwoToggle = this.onCardToggle.bind(this, 'two');
  }

  syncChange() {
    const {
      card,
      onChange,
    } = this.props;
    const {
      one,
      two,
    } = this.state;
    onChange(card, (one ? 1 : 0) + (two ? 1 : 0));
  }

  onCardToggle(key) {
    this.setState({
      [key]: !this.state[key],
    }, this._syncChange);
  }

  render() {
    const {
      card,
      limit,
    } = this.props;
    const {
      one,
      two,
    } = this.state;

    if (limit === 0) {
      return null;
    }
    return (
      <View>
        <CardSearchResult
          card={card}
          onToggleChange={this._onCardOneToggle}
          toggleValue={one}
        />
        { (limit > 1) && (
          <CardSearchResult
            card={card}
            onToggleChange={this._onCardTwoToggle}
            toggleValue={two}
          />
        ) }
      </View>
    );
  }
}

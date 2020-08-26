import React from 'react';
import {
  View,
} from 'react-native';

import CardSearchResult from '../../cardlist/CardSearchResult';
import Card from '@data/Card';

interface Props {
  card: Card;
  count: number;
  fontScale: number;
  onChange: (card: Card, count: number) => void;
  onPress?: (card: Card) => void;
  limit: number;
  value?: number;
}

interface State {
  one: boolean;
  two: boolean;
  three: boolean;
}

export default class CardToggleRow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      one: props.count > 0,
      two: props.count > 1,
      three: props.count > 2,
    };
  }

  _syncChange = () => {
    const {
      card,
      onChange,
    } = this.props;
    const {
      one,
      two,
      three,
    } = this.state;
    onChange(card, (one ? 1 : 0) + (two ? 1 : 0) + (three ? 1 : 0));
  };

  _onCardOneToggle = () => {
    this.setState({
      one: !this.state.one,
    }, this._syncChange);
  };

  _onCardTwoToggle = () => {
    this.setState({
      two: !this.state.two,
    }, this._syncChange);
  };

  _onCardThreeToggle = () => {
    this.setState({
      three: !this.state.three,
    }, this._syncChange);
  };

  render() {
    const {
      card,
      limit,
      onPress,
      fontScale,
      value,
    } = this.props;
    const {
      one,
      two,
      three,
    } = this.state;

    if (limit === 0) {
      return null;
    }
    return (
      <View>
        <CardSearchResult
          card={card}
          count={value}
          onToggleChange={this._onCardOneToggle}
          onPress={onPress}
          toggleValue={one}
          fontScale={fontScale}
          backgroundColor="transparent"
        />
        { (limit > 1) && (
          <CardSearchResult
            card={card}
            count={value}
            onToggleChange={this._onCardTwoToggle}
            onPress={onPress}
            toggleValue={two}
            fontScale={fontScale}
            backgroundColor="transparent"
          />
        ) }
        { (limit > 2) && (
          <CardSearchResult
            card={card}
            count={value}
            onToggleChange={this._onCardThreeToggle}
            onPress={onPress}
            toggleValue={three}
            fontScale={fontScale}
            backgroundColor="transparent"
          />
        ) }
      </View>
    );
  }
}

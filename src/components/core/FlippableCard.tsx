import React, { ReactNode } from 'react';
import {
  ViewStyle,
} from 'react-native';
import FlipCard from 'react-native-flip-card';

interface Props {
  style?: ViewStyle;
  backSide: ReactNode;
  frontSide: ReactNode;
  flipped?: boolean;
  onFlip: () => void;
}
export default class FlippableCard extends React.Component<Props> {
  _onFlip = () => {
    const {
      onFlip,
    } = this.props;

    onFlip && onFlip();
  };

  render() {
    const {
      style,
      backSide,
      frontSide,
      flipped,
    } = this.props;
    return (
      <FlipCard
        style={style}
        friction={10}
        perspective={1000}
        flipHorizontal
        flipVertical={false}
        flip={flipped}
        clickable
        onFlipEnd={this._onFlip}
      >
        { backSide }
        { frontSide }
      </FlipCard>
    );
  }
}

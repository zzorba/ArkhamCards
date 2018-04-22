import React from 'react';
import PropTypes from 'prop-types';
import {
  ViewPropTypes,
} from 'react-native';
import FlipCard from 'react-native-flip-card';

export default class FlippableCard extends React.Component {
  static propTypes = {
    style: ViewPropTypes.style,
    backSide: PropTypes.node.isRequired,
    frontSide: PropTypes.node.isRequired,
    flipped: PropTypes.bool,
    onFlip: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this._onFlip = this.onFlip.bind(this);
  }

  onFlip() {
    const {
      onFlip,
    } = this.props;

    onFlip && onFlip();
  }

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

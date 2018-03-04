import React from 'react';
import PropTypes from 'prop-types';
const {
  Image,
  Text,
  View,
} = require('react-native');
import FlipCard from 'react-native-flip-card';

export default class FlippableCard extends React.Component {
  static propTypes = {
    style: View.propTypes.style,
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
        friction={6}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
        flip={flipped}
        clickable={true}
        onFlipEnd={this._onFlip}
      >
        {/* Face Side */}
        { backSide }
        {/* Back Side */}
        { frontSide }
      </FlipCard>
    );
  }
}

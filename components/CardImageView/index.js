import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';
import { CachedImage } from 'react-native-cached-image';
import PinchZoomView from 'react-native-pinch-zoom-view';

import { iconsMap } from '../../app/NavIcons';

const HEADER_SIZE = 48;

export default class CardImageView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    card: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const {
      height,
      width,
    } = Dimensions.get('window');

    this.state = {
      flipped: props.card.type_code === 'investigator' ||
        props.card.type_code === 'act' ||
        props.card.type_code === 'agenda' ||
        (props.card.double_sided && !props.card.spoiler),
      width,
      height,
    };

    this._flip = this.flip.bind(this);

    if (props.card.double_sided) {
      props.navigator.setButtons({
        rightButtons: [
          {
            id: 'flip',
            icon: iconsMap.flip_card,
          },
        ],
      });
    }
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'flip') {
        this.flip();
      }
    }
  }

  flip() {
    this.setState({
      flipped: !this.state.flipped,
    });
  }

  renderImage() {
    const {
      card,
    } = this.props;
    const {
      flipped,
      height,
      width,
    } = this.state;
    const cardRatio = 68.0 / 88;
    const cardHeight = height * cardRatio;
    const cardWidth = width - 16;
    if (card.double_sided) {
      if (flipped) {
        return (
          <CachedImage
            style={[styles.bigCard, { height: cardHeight, width: cardWidth }]}
            resizeMode="contain"
            source={{
              uri: `https://arkhamdb.com${card.imagesrc}`,
            }}
          />
        );
      }
      return (
        <CachedImage
          style={[styles.bigCard, { height: cardHeight, width: cardWidth }]}
          resizeMode="contain"
          source={{
            uri: `https://arkhamdb.com${card.backimagesrc}`,
          }}
        />
      );
    }

    return (
      <CachedImage
        style={[styles.bigCard, { height: cardHeight, width: cardWidth }]}
        resizeMode="contain"
        source={{
          uri: `https://arkhamdb.com${card.imagesrc}`,
        }}
      />
    );
  }

  render() {
    return (
      <PinchZoomView>
        { this.renderImage() }
      </PinchZoomView>
    );
  }
}


const styles = StyleSheet.create({
  bigCard: {
    marginTop: Platform.OS === 'ios' ? 0 : HEADER_SIZE,
    marginLeft: 8,
    marginRight: 8,
  },
});

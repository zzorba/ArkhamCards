import React from 'react';
import PropTypes from 'prop-types';
import { head } from 'lodash';
import {
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';
import { CachedImage } from 'react-native-cached-image';
import { connectRealm } from 'react-native-realm';
import ViewControl from 'react-native-zoom-view';

import { iconsMap } from '../../app/NavIcons';

const HEADER_SIZE = 48;

class CardImageView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    card: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const {
      height,
      width,
    } = Dimensions.get('window');

    const doubleCard = props.card.double_sided ||
      (props.card.linked_card && props.card.linked_card.imagesrc);

    this.state = {
      flipped: props.card.type_code === 'investigator' ||
        props.card.type_code === 'act' ||
        props.card.type_code === 'agenda' ||
        (doubleCard && props.card.hidden),
      width,
      height,
    };

    this._flip = this.flip.bind(this);

    if (doubleCard) {
      props.navigator.setButtons({
        rightButtons: [
          {
            id: 'flip',
            icon: iconsMap['flip_card'],
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

  render() {
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
    if (card.double_sided || (card.linked_card && card.linked_card.imagesrc)) {
      if (flipped) {
        return (
          <ViewControl
            cropWidth={width}
            cropHeight={height}
            imageWidth={cardWidth}
            imageHeight={cardHeight}
          >
            <CachedImage
              style={[styles.bigCard, { height: cardHeight, width: cardWidth }]}
              resizeMode="contain"
              source={{
                uri: `https://arkhamdb.com${card.imagesrc}`,
              }}
            />
          </ViewControl>
        );
      }
      return (
        <ViewControl
          cropWidth={width}
          cropHeight={height}
          imageWidth={cardWidth}
          imageHeight={cardHeight}
        >
          <CachedImage
            style={[styles.bigCard, { height: cardHeight, width: cardWidth }]}
            resizeMode="contain"
            source={{
              uri: `https://arkhamdb.com${card.double_sided ? card.backimagesrc : card.linked_card.imagesrc}`,
            }}
          />
        </ViewControl>
      );
    }

    return (
      <ViewControl
        cropWidth={width}
        cropHeight={height}
        imageWidth={cardWidth}
        imageHeight={cardHeight}
      >
        <CachedImage
          style={[styles.bigCard, { height: cardHeight, width: cardWidth }]}
          resizeMode="contain"
          source={{
            uri: `https://arkhamdb.com${card.imagesrc}`,
          }}
        />
      </ViewControl>
    );
  }
}

export default connectRealm(CardImageView, {
  schemas: ['Card'],
  mapToProps(results, realm, props) {
    const card =
      head(results.cards.filtered(`code == "${props.id}"`));
    return {
      card,
    };
  },
});

const styles = StyleSheet.create({
  bigCard: {
    marginTop: Platform.OS === 'ios' ? 0 : HEADER_SIZE,
  },
});

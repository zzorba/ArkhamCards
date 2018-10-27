import React from 'react';
import PropTypes from 'prop-types';
import { head, throttle } from 'lodash';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import { CachedImage } from 'react-native-cached-image';
import { connectRealm } from 'react-native-realm';
import ViewControl from 'react-native-zoom-view';
import { Navigation } from 'react-native-navigation';

import { iconsMap } from '../../app/NavIcons';
import { HEADER_HEIGHT } from '../../styles/sizes';

class CardImageView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    /* eslint-disable react/no-unused-prop-types */
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
      height: height - HEADER_HEIGHT,
    };

    this._flip = throttle(this.flip.bind(this), 200);

    if (doubleCard) {
      Navigation.mergeOptions(props.componentId, {
        topBar: {
          rightButtons: [{
            id: 'flip',
            icon: iconsMap.flip_card,
          }],
        },
      });
    }
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'flip') {
      this._flip();
    }
  }

  flip() {
    this.setState({
      flipped: !this.state.flipped,
    });
  }

  renderContent() {
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
            style={styles.pinchZoom}
          >
            <CachedImage
              style={{ height: cardHeight, width: cardWidth }}
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
          style={styles.pinchZoom}
        >
          <CachedImage
            style={{ height: cardHeight, width: cardWidth }}
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
        style={styles.pinchZoom}
      >
        <CachedImage
          style={{ height: cardHeight, width: cardWidth }}
          resizeMode="contain"
          source={{
            uri: `https://arkhamdb.com${card.imagesrc}`,
          }}
        />
      </ViewControl>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        { this.renderContent() }
      </View>
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
  container: {
    flex: 1,
  },
  pinchZoom: {
    flex: 1,
    backgroundColor: 'white',
  },
});

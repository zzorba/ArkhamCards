import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Lightbox from 'react-native-lightbox';
import FlipCard from 'react-native-flip-card';
import { Button } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { createFactionIcons, FACTION_COLORS } from '../../constants';

const FACTION_ICONS = createFactionIcons(55, '#FFF');
const HEADER_SIZE = 48;

export default class PlayerCardImage extends React.Component {
  static propTypes = {
    card: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const {
      height,
      width,
    } = Dimensions.get('window');

    this.state = {
      flipped: false,
      width,
      height,
    };
    this._flip = this.flip.bind(this);
    this._renderLightboxHeader = this.renderLightboxHeader.bind(this);
    this._renderFullsize = this.renderFullsize.bind(this);
  }

  flip() {
    this.setState({
      flipped: !this.state.flipped,
    });
  }

  renderLightboxHeader(close) {
    const {
      card,
    } = this.props;
    const {
      flipped,
    } = this.state;

    return (
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={close}>
          <MaterialCommunityIcons name="close" size={32} color="#888" />
        </TouchableOpacity>
        { card.double_sided &&
          <Button
            style={{ marginRight: 4 }}
            onPress={this._flip}
            text={flipped ? 'Show Back' : 'Show Front'}
          />
        }
      </View>
    );
  }
  renderFullsize() {
    const {
      card,
    } = this.props;
    const {
      flipped,
      height,
    } = this.state;
    const cardRatio = 68.0 / 88;
    const cardHeight = height * cardRatio;
    const cardMarginTop = (height + HEADER_SIZE - cardHeight) / 2;
    if (card.double_sided) {
      return (
        <View style={[styles.flipCardLightbox, { height }]}>
          <FlipCard
            friction={10}
            perspective={1000}
            flipHorizontal
            flipVertical={false}
            flip={flipped}
          >
            <Image
              style={{
                marginTop: cardMarginTop,
                height: cardHeight,
              }}
              resizeMode="contain"
              source={{ uri: `https://arkhamdb.com/${card.backimagesrc}` }}
            />
            <Image
              style={{
                marginTop: cardMarginTop,
                height: cardHeight,
              }}
              resizeMode="contain"
              source={{ uri: `https://arkhamdb.com/${card.imagesrc}` }}
            />
          </FlipCard>
        </View>
      );
    }

    return (
      <Image
        style={{ height: '100%' }}
        resizeMode="contain"
        source={{ uri: `https://arkhamdb.com/${card.imagesrc}` }}
      />
    );
  }

  render() {
    const {
      card,
    } = this.props;
    return (
      <View style={styles.container}>
        { !card.imagesrc ?
          <View style={[
            styles.placeholder,
            { backgroundColor: FACTION_COLORS[card.faction_code] },
          ]}>
            <Text style={styles.placeholderIcon}>
              { FACTION_ICONS[card.faction_code] }
            </Text>
          </View>
          :
          <Lightbox
            swipeToDismiss
            backgroundColor="white"
            renderHeader={this._renderLightboxHeader}
            renderContent={this._renderFullsize}
          >
            <Image
              style={styles.image}
              source={{ uri: `https://arkhamdb.com/${card.imagesrc}` }}
              resizeMode="contain"
            />
          </Lightbox>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 6,
    width: 90,
    height: 90,
  },
  image: {
    position: 'absolute',
    top: -22,
    left: -26,
    width: 142,
    height: 198,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    textAlign: 'center',
  },
  flipCardLightbox: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  buttonRow: {
    width: '100%',
    height: HEADER_SIZE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

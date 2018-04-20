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
      flipped: props.card.type_code === 'investigator' ||
        props.card.type_code === 'act' ||
        props.card.type_code === 'agenda' ||
        (props.card.double_sided && !props.card.spoiler),
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
        { card.double_sided && card.backimagesrc &&
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

  containerStyle() {
    const {
      card,
    } = this.props;
    switch (card.type_code) {
      case 'investigator': return styles.investigatorContainer;
      default: return {};
    }
  }

  imageStyle() {
    const {
      card,
    } = this.props;
    switch (card.type_code) {
      case 'investigator': return styles.investigatorImage;
      case 'agenda': return styles.agendaImage;
      case 'act': return styles.actImage;
      case 'location': return styles.locationImage;
      default: return {};
    }
  }

  render() {
    const {
      card,
    } = this.props;
    const isInvestigator = card.type_code === 'investigator';
    const filename = (card.type_code === 'location' && card.double_sided) ?
      card.backimagesrc :
      card.imagesrc;

    return (
      <View style={[styles.container, this.containerStyle()]}>
        <View style={[
          styles.placeholder,
          { backgroundColor: FACTION_COLORS[card.faction_code] },
        ]}>
          <Text style={styles.placeholderIcon}>
            { FACTION_ICONS[card.faction_code] }
          </Text>
        </View>
        { card.imagesrc && (
          <Lightbox
            swipeToDismiss
            backgroundColor="white"
            renderHeader={this._renderLightboxHeader}
            renderContent={this._renderFullsize}
          >
            <Image
              style={[styles.image, this.imageStyle()]}
              source={{ uri: `https://arkhamdb.com/${filename}` }}
              resizeMode="contain"
            />
          </Lightbox>
        ) }
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
  investigatorContainer: {
    width: 90,
    height: 90,
  },
  image: {
    position: 'absolute',
    top: -25,
    left: -30,
    width: 142 * 1.1,
    height: 198 * 1.1,
  },
  locationImage: {
    position: 'absolute',
    top: -35,
    left: -45,
    width: 142 * 1.4,
    height: 198 * 1.4,
  },
  investigatorImage: {
    top: -32,
    left: -10,
    width: 166 + 44,
    height: 136 + 34,
  },
  agendaImage: {
    top: -35,
    left: 0,
    height: 136 * 1.35,
    width: 166 * 1.35,
  },
  actImage: {
    top: -35,
    left: -130,
    height: 136 * 1.35,
    width: 166 * 1.35,
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 90,
    height: 90,
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

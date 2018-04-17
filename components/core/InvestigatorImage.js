import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { createFactionIcons, FACTION_COLORS } from '../../constants';
import PlayerCardImage from './PlayerCardImage';

const FACTION_ICONS = createFactionIcons(55, '#FFF');

export default class InvestigatorImage extends React.Component {
  static propTypes = {
    card: PropTypes.object.isRequired,
    navigator: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      card,
      navigator,
    } = this.props;
    navigator.push({
      screen: 'Card',
      passProps: {
        id: card.code,
        pack_code: card.pack_code,
        showSpoilers: true,
      },
    });
  }

  renderImage() {
    const {
      card,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={[
          styles.placeholder,
          { backgroundColor: FACTION_COLORS[card.faction_code] },
        ]}>
          <Text style={styles.placeholderIcon}>
            { FACTION_ICONS[card.faction_code] }
          </Text>
        </View>
        { card.imagesrc && (
          <Image
            style={styles.image}
            source={{ uri: `https://arkhamdb.com/${card.imagesrc}` }}
            resizeMode="contain"
          />
        ) }
      </View>
    );
  }

  render() {
    const {
      card,
      clickable,
    } = this.props;
    if (clickable) {
      return (
        <TouchableOpacity onPress={this._onPress}>
          { this.renderImage() }
        </TouchableOpacity>
      );
    }
    return this.renderImage();
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 6,
    width: 80,
    height: 80,
  },
  image: {
    position: 'absolute',
    top: -34,
    left: -10,
    width: 166 + 44,
    height: 136 + 34,
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
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
});

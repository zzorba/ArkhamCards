import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CachedImage } from 'react-native-cached-image';
import { Navigation } from 'react-native-navigation';

import L from '../../app/i18n';
import { createFactionIcons, FACTION_COLORS } from '../../constants';

const FACTION_ICONS = createFactionIcons(55, '#FFF');
const SMALL_FACTION_ICONS = createFactionIcons(40, '#FFF');

export default class InvestigatorImage extends React.Component {
  static propTypes = {
    card: PropTypes.object.isRequired,
    componentId: PropTypes.string,
    small: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      card,
      componentId,
    } = this.props;
    Navigation.push(componentId, {
      component: {
        name: 'Card',
        passProps: {
          id: card.code,
          pack_code: card.pack_code,
          showSpoilers: true,
        },
        options: {
          topBar: {
            backButton: {
              title: L('Back'),
            },
          },
        },
      },
    });
  }

  renderImage() {
    const {
      card,
      small,
    } = this.props;
    const size = small ? 65 : 80;
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <View style={styles.relative}>
          <View style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              backgroundColor: FACTION_COLORS[card.faction_code],
            },
          ]}>
            <Text style={styles.placeholderIcon}>
              { (small ? SMALL_FACTION_ICONS : FACTION_ICONS)[card.faction_code] }
            </Text>
          </View>
        </View>

        { !!card.imagesrc && (
          <View style={styles.relative}>
            <CachedImage
              style={styles.image}
              source={{
                uri: `https://arkhamdb.com/${card.imagesrc}`,
              }}
              resizeMode="contain"
            />
          </View>
        ) }
      </View>
    );
  }

  render() {
    if (this.props.componentId) {
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
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 6,
  },
  relative: {
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: -17,
    left: -10,
    width: 166 + 44,
    height: 136 + 34,
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    textAlign: 'center',
  },
});

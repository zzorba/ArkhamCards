import React from 'react';
import PropTypes from 'prop-types';
import {
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { CachedImage } from 'react-native-cached-image';

import { showCard } from '../navHelper';
import { createFactionIcons, FACTION_COLORS } from '../../constants';
import Card from '../../data/Card';

const FACTION_ICONS = createFactionIcons(55, '#FFF');
const SMALL_FACTION_ICONS = createFactionIcons(40, '#FFF');

interface Props {
  card: Card;
  componentId: string;
  small?: boolean;
}
export default class InvestigatorImage extends React.Component<Props> {
  _onPress = () => {
    const {
      card,
      componentId,
    } = this.props;
    showCard(componentId, card.code, card, true);
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
              backgroundColor: FACTION_COLORS[card.faction_code || 'neutral'],
            },
          ]}>
            <Text style={styles.placeholderIcon} allowFontScaling={false}>
              { (small ? SMALL_FACTION_ICONS : FACTION_ICONS)[card.faction_code || 'neutral'] }
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

interface Styles {
  container: ViewStyle;
  relative: ViewStyle;
  image: ImageStyle;
  placeholder: ViewStyle;
  placeholderIcon: TextStyle;
}

const styles = StyleSheet.create<Styles>({
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

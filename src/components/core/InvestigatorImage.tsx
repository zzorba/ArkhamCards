import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Sepia } from 'react-native-color-matrix-image-filters';

import { showCard } from 'components/nav/helper';
import { createFactionIcons, FACTION_COLORS } from 'constants';
import Card from 'data/Card';
import { isBig } from 'styles/space';

const FACTION_ICONS = createFactionIcons('#FFF');

const scaleFactor = isBig ? 1.2 : 1.0;

interface Props {
  card: Card;
  componentId?: string;
  small?: boolean;
  killedOrInsane?: boolean;
}

export default class InvestigatorImage extends React.Component<Props> {
  _onPress = () => {
    const {
      card,
      componentId,
    } = this.props;
    if (componentId) {
      showCard(componentId, card.code, card, true);
    }
  };

  renderInvestigatorImage() {
    const {
      card,
      small,
    } = this.props;
    return (
      <FastImage
        style={small ? styles.image : styles.bigImage}
        source={{
          uri: `https://arkhamdb.com/${card.imagesrc}`,
        }}
        resizeMode="contain"
      />
    );
  }

  renderImage() {
    const {
      card,
      small,
      killedOrInsane,
    } = this.props;
    const size = (small ? 65 : 110) * scaleFactor;
    const faction_icon = FACTION_ICONS[card.factionCode()];
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        { !!faction_icon && (
          <View style={styles.relative}>
            <View style={[
              styles.placeholder,
              {
                width: size,
                height: size,
                backgroundColor: FACTION_COLORS[killedOrInsane ? 'dead' : card.factionCode()],
              },
            ]}>
              <Text style={styles.placeholderIcon} allowFontScaling={false}>
                { faction_icon(small ? 40 : 55) }
              </Text>
            </View>
          </View>
        ) }
        { !!card.imagesrc && (
          <View style={styles.relative}>
            { killedOrInsane ? (
              <Sepia>
                { this.renderInvestigatorImage() }
              </Sepia>
            ) : this.renderInvestigatorImage() }
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
    top: -36 * scaleFactor,
    left: -20 * scaleFactor,
    width: (166 + 44) * scaleFactor,
    height: (136 + 34) * scaleFactor,
  },
  bigImage: {
    position: 'absolute',
    top: -44 * scaleFactor,
    left: -20 * scaleFactor,
    width: (166 + 44) * 1.25 * scaleFactor,
    height: (136 + 34) * 1.25 * scaleFactor,
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

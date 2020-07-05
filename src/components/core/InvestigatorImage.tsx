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
import { createFactionIcons } from 'constants';
import Card from 'data/Card';
import { isBig } from 'styles/space';
import COLORS from 'styles/colors';

const FACTION_ICONS = createFactionIcons({ defaultColor: '#FFF' });

const scaleFactor = isBig ? 1.2 : 1.0;

interface Props {
  card: Card;
  componentId?: string;
  border?: boolean;
  small?: boolean;
  killedOrInsane?: boolean;
  yithian?: boolean;
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

  imageStyle() {
    const {
      small,
      yithian,
    } = this.props;
    if (yithian) {
      return small ? styles.smallYithianImage : styles.bigImage;
    }
    return small ? styles.image : styles.bigImage;
  }

  renderInvestigatorImage() {
    const {
      card,
      yithian,
    } = this.props;
    return (
      <FastImage
        style={this.imageStyle()}
        source={{
          uri: `https://arkhamdb.com/${yithian ? 'bundles/cards/04244.jpg' : card.imagesrc}`,
        }}
        resizeMode="contain"
      />
    );
  }

  renderStyledImage() {
    const {
      killedOrInsane,
    } = this.props;
    if (killedOrInsane) {
      return (
        <Sepia>
          { this.renderInvestigatorImage() }
        </Sepia>
      );
    }
    return this.renderInvestigatorImage();
  }

  renderImage() {
    const {
      card,
      small,
      killedOrInsane,
      border,
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
                backgroundColor: COLORS.faction[killedOrInsane ? 'dead' : card.factionCode()].background,
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
            { this.renderStyledImage() }
          </View>
        ) }
        <View style={styles.relative}>
          { !!border && (
            <View style={[
              styles.border,
              {
                borderColor: COLORS.faction[killedOrInsane ? 'dead' : card.factionCode()].background,
                width: size,
                height: size,
              },
            ]} />
          ) }
        </View>
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
  smallYithianImage: {
    position: 'absolute',
    top: -36 * scaleFactor,
    left: -20 * scaleFactor,
    width: (166 + 24) * scaleFactor,
    height: (136 + 14) * scaleFactor,
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
  border: {
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  placeholderIcon: {
    textAlign: 'center',
  },
});

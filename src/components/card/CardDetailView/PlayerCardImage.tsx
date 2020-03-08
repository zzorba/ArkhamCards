import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Navigation } from 'react-native-navigation';

import { CardImageProps } from 'components/card/CardImageView';
import EncounterIcon from 'icons/EncounterIcon';
import { createFactionIcons, FACTION_COLORS } from 'constants';
import Card from 'data/Card';
import { isBig } from 'styles/space';

const FACTION_ICONS = createFactionIcons('#FFF');
const SCALE_FACTOR = isBig ? 1.2 : 1.0;

interface Props {
  componentId?: string;
  card: Card;
}

export default class PlayerCardImage extends React.Component<Props> {
  _onPress = () => {
    const {
      componentId,
      card,
    } = this.props;
    if (componentId) {
      Navigation.push<CardImageProps>(componentId, {
        component: {
          name: 'Card.Image',
          passProps: {
            id: card.code,
          },
          options: {
            bottomTabs: {
              visible: false,
              drawBehind: true,
              animate: true,
            },
          },
        },
      });
    }
  };

  imageStyle() {
    const {
      card,
    } = this.props;
    switch (card.type_code) {
      case 'enemy': return styles.enemyImage;
      case 'investigator': return styles.investigatorImage;
      case 'agenda': return styles.agendaImage;
      case 'act': return styles.actImage;
      case 'location': return styles.locationImage;
      case 'treachery': return styles.treacheryImage;
      default: return {};
    }
  }

  renderPlaceholder() {
    const {
      card,
    } = this.props;

    const faction_icon = card.faction2_code ?
      FACTION_ICONS.dual :
      FACTION_ICONS[card.factionCode()];
    if (faction_icon) {
      return (
        <View style={[
          styles.placeholder,
          { backgroundColor: card.faction2_code ?
            FACTION_COLORS.dual :
            FACTION_COLORS[card.factionCode()],
          },
        ]}>
          <Text style={styles.placeholderIcon}>
            { faction_icon(55) }
          </Text>
        </View>
      );
    }
    if (card.encounter_code) {
      return (
        <View style={[
          styles.placeholder,
          { backgroundColor: '#444' },
        ]}>
          <Text style={styles.placeholderIcon}>
            <EncounterIcon encounter_code={card.encounter_code} size={55} color="#FFF" />
          </Text>
        </View>
      );
    }
    return null;
  }

  renderContent() {
    const {
      card,
    } = this.props;
    const filename = (card.type_code === 'location' && card.double_sided) ?
      card.backimagesrc :
      card.imagesrc;

    const horizontal = card.type_code === 'act' ||
      card.type_code === 'investigator' ||
      card.type_code === 'agenda';

    if (isBig && !horizontal) {
      return (
        <View style={styles.verticalContainer}>
          <FastImage
            style={styles.verticalContainer}
            source={{
              uri: `https://arkhamdb.com${filename}`,
            }}
            resizeMode="contain"
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        { this.renderPlaceholder() }
        <View style={styles.container}>
          <FastImage
            style={[styles.image, this.imageStyle()]}
            source={{
              uri: `https://arkhamdb.com${filename}`,
            }}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }

  render() {
    const {
      card,
      componentId,
    } = this.props;
    if (!card.imagesrc) {
      return (
        <View style={styles.container}>
          { this.renderPlaceholder() }
        </View>
      );
    }

    if (componentId) {
      return (
        <TouchableOpacity onPress={this._onPress}>
          { this.renderContent() }
        </TouchableOpacity>
      );
    }
    return this.renderContent();
  }
}

const styles = StyleSheet.create({
  verticalContainer: {
    width: 215,
    height: 300,
  },
  container: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 6,
    width: 90 * SCALE_FACTOR,
    height: 90 * SCALE_FACTOR,
  },
  image: {
    position: 'absolute',
    top: -25 * SCALE_FACTOR,
    left: -25 * SCALE_FACTOR,
    width: 142 * 1.1 * SCALE_FACTOR,
    height: 198 * 1.1 * SCALE_FACTOR,
  },
  treacheryImage: {
    position: 'absolute',
    top: -0 * SCALE_FACTOR,
    left: -30 * SCALE_FACTOR,
    width: 142 * 1.1 * SCALE_FACTOR,
    height: 198 * 1.1 * SCALE_FACTOR,
  },
  enemyImage: {
    position: 'absolute',
    top: -160 * SCALE_FACTOR,
    left: -35 * SCALE_FACTOR,
    width: 142 * 1.3 * SCALE_FACTOR,
    height: 198 * 1.3 * SCALE_FACTOR,
  },
  locationImage: {
    position: 'absolute',
    top: -35 * SCALE_FACTOR,
    left: -40 * SCALE_FACTOR,
    width: 142 * 1.4 * SCALE_FACTOR,
    height: 198 * 1.4 * SCALE_FACTOR,
  },
  investigatorImage: {
    top: -40 * SCALE_FACTOR,
    left: -15 * SCALE_FACTOR,
    width: (166 + 64) * SCALE_FACTOR,
    height: (136 + 54) * SCALE_FACTOR,
  },
  agendaImage: {
    top: -35 * SCALE_FACTOR,
    left: 0,
    height: 136 * 1.35 * SCALE_FACTOR,
    width: 166 * 1.35 * SCALE_FACTOR,
  },
  actImage: {
    top: -25 * SCALE_FACTOR,
    left: -130 * SCALE_FACTOR,
    height: 136 * 1.35 * SCALE_FACTOR,
    width: 166 * 1.35 * SCALE_FACTOR,
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 90 * SCALE_FACTOR,
    height: 90 * SCALE_FACTOR,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    textAlign: 'center',
  },
});

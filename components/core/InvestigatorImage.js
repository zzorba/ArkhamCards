import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { createFactionIcons, FACTION_COLORS } from '../../constants';

const FACTION_ICONS = createFactionIcons(55, '#FFF');

export default class InvestigatorImage extends React.Component {
  static propTypes = {
    card: PropTypes.object.isRequired,
  };

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
          <Image
            style={styles.image}
            source={{ uri: `https://arkhamdb.com/${card.imagesrc}` }}
            resizeMode="contain"
          />
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

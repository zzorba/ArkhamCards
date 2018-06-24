import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FACTION_BACKGROUND_COLORS } from '../constants';
import ArkhamIcon from '../assets/ArkhamIcon';

export default class DeckTitleBarComponent extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    investigator: PropTypes.object,
  };

  render() {
    const {
      name,
      investigator,
    } = this.props;

    const factionColor = investigator &&
      investigator.faction_code &&
      FACTION_BACKGROUND_COLORS[investigator.faction_code];
    const iconName = investigator &&
      (investigator.faction_code === 'neutral' ? 'elder_sign' : investigator.faction_code);
    return (
      <View style={[styles.titleBar, { backgroundColor: factionColor || '#FFFFFF' }]}>
        <Text
          style={[styles.title, { color: factionColor ? '#FFFFFF' : '#000000' }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          { name }
        </Text>
        { !!iconName && <ArkhamIcon name={iconName} size={28} color="#FFFFFF" /> }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  titleBar: {
    width: '100%',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: 22,
    flex: 1,
  },
});

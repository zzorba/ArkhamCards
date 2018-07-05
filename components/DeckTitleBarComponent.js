import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { FACTION_DARK_GRADIENTS } from '../constants';
import ArkhamIcon from '../assets/ArkhamIcon';

export default class DeckTitleBarComponent extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    investigator: PropTypes.object,
    compact: PropTypes.bool,
  };

  render() {
    const {
      name,
      investigator,
      compact,
    } = this.props;

    const hasFactionColor = !!(investigator &&
      investigator.faction_code &&
      FACTION_DARK_GRADIENTS[investigator.faction_code]);
    const iconName = investigator &&
      (investigator.faction_code === 'neutral' ? 'elder_sign' : investigator.faction_code);
    return (
      <LinearGradient
        colors={FACTION_DARK_GRADIENTS[investigator.faction_code]}
        style={styles.titleBar}
      >
        <Text
          style={[styles.title, { color: hasFactionColor ? '#FFFFFF' : '#000000' }]}
          numberOfLines={compact ? 1 : 2}
          ellipsizeMode="tail"
        >
          { name }
        </Text>
        { !!iconName && <ArkhamIcon name={iconName} size={28} color="#FFFFFF" /> }
      </LinearGradient>
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

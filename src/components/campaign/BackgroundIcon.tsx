import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import EncounterIcon from 'icons/EncounterIcon';

interface Props {
  code: string;
  color: string;
  style?: ViewStyle,
}

export default class BackgroundIcon extends React.Component<Props> {
  render() {
    const {
      code,
      color,
      style,
    } = this.props;
    return (
      <View style={[styles.backgroundIcon, style || {}]}>
        <EncounterIcon
          encounter_code={code}
          size={84}
          color={color}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundIcon: {
    position: 'absolute',
    right: 22,
    top: 10,
    width: 110,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

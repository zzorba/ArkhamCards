import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import EncounterIcon from '@icons/EncounterIcon';
import { s } from '@styles/space';

interface Props {
  code: string;
  color: string;
  style?: ViewStyle;
  small?: boolean;
}

export default class BackgroundIcon extends React.Component<Props> {
  render() {
    const {
      code,
      color,
      style,
      small,
    } = this.props;
    return (
      <View style={[styles.backgroundIcon, style || {}]}>
        <EncounterIcon
          encounter_code={code}
          size={small ? 75 : 100}
          color={color}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundIcon: {
    position: 'absolute',
    right: s,
    top: 10,
    width: 125,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

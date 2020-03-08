import React from 'react';
import { StyleSheet, View } from 'react-native';

import EncounterIcon from 'icons/EncounterIcon';

interface Props {
  code: string;
  color: string;
}

export default class BackgroundIcon extends React.Component<Props> {
  render() {
    const {
      code,
      color,
    } = this.props;
    return (
      <View style={styles.backgroundIcon}>
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

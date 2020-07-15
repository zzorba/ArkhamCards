import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

import ArkhamIcon from '@icons/ArkhamIcon';
import TextStroke from './TextStroke';

export function costIconSize(fontScale: number) {
  const scaleFactor = ((fontScale - 1) / 2 + 1);
  return 48 * scaleFactor;
}

interface Props {
  count: number | null;
  type: 'health' | 'sanity';
  fontScale: number;
}

function num(value: number | null) {
  if (value === null) {
    return '-';
  }
  if (value < 0) {
    return 'X';
  }
  return value;
}

export default class HealthSanityIcon extends React.PureComponent<Props> {
  color(dark: boolean) {
    const {
      type,
    } = this.props;
    switch (type) {
      case 'health': return dark ? '#911017' : '#a74045';
      case 'sanity': return dark ? '#0c2445' : '#3d506a';
    }
  }

  render() {
    const {
      type,
      fontScale,
      count,
    } = this.props;
    const scaleFactor = ((fontScale - 1) / 2 + 1);
    const ICON_SIZE = 46 * scaleFactor;
    const style = {
      width: costIconSize(fontScale) * 1.4,
      height: costIconSize(fontScale),
    };
    return (
      <View style={[styles.wrapper, style]}>
        <View style={[styles.icon, style]}>
          <ArkhamIcon
            name={type}
            size={ICON_SIZE}
            color={this.color(false)}
          />
        </View>
        <View style={[styles.icon, type === 'health' ? styles.healthText : styles.sanityText, style]}>
          <TextStroke color={this.color(true)} stroke={3}>
            <Text style={styles.count}>{ num(count) }</Text>
          </TextStroke>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthText: {
    left: -2,
  },
  sanityText: {
    top: -2,
  },
  count: {
    fontFamily: 'Teutonic',
    fontWeight: '600',
    fontSize: 36,
    color: '#FFF',
  },
});

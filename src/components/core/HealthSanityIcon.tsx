import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import CardIcon from '@icons/CardIcon';
import StyleContext from '@styles/StyleContext';

interface Props {
  type: 'health' | 'sanity';
  size?: number;
}

export default function HealthSanityIcon({ type, size = 24 }: Props) {
  const { colors } = useContext(StyleContext);
  if (type === 'health') {
    return (
      <View style={{ width: size, height: size }}>
        <View style={styles.icon}>
          <CardIcon
            name="health_inverted"
            size={size}
            color="#FFFFFF"
          />
        </View>
        <View style={styles.icon}>
          <CardIcon
            name="health"
            size={size}
            color={colors.health}
          />
        </View>
      </View>
    );
  }
  return (
    <View style={{ width: size * 1.25, height: size }}>
      <View style={styles.icon}>
        <CardIcon
          name="sanity_inverted"
          size={size}
          color="#FFFFFF"
        />
      </View>
      <View style={styles.icon}>
        <CardIcon
          name="sanity"
          size={size}
          color={colors.sanity}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ArkhamIcon from '@icons/ArkhamIcon';
import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';

interface Props {
  type: 'health' | 'sanity';
}

export default function HealthSanityIcon({ type }: Props) {
  const { colors } = useContext(StyleContext);
  if (type === 'health') {
    return (
      <View style={styles.healthWrapper}>
        <View style={styles.icon}>
          <ArkhamIcon
            name="health_inverted"
            size={24}
            color="#FFFFFF"
          />
        </View>
        <View style={styles.icon}>
          <ArkhamIcon
            name="health"
            size={24}
            color={colors.health}
          />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.sanityWrapper}>
      <View style={styles.icon}>
        <ArkhamIcon
          name="sanity_inverted"
          size={24}
          color="#FFFFFF"
        />
      </View>
      <View style={styles.icon}>
        <ArkhamIcon
          name="sanity"
          size={24}
          color={colors.sanity}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  healthWrapper: {
    width: 24,
    height: 24,
  },
  sanityWrapper: {
    width: 30,
    height: 24,
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

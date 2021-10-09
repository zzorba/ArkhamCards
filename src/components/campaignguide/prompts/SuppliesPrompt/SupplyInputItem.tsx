import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import StyleContext from '@styles/StyleContext';
import space, { xs } from '@styles/space';
import AppIcon from '@icons/AppIcon';

interface Props {
  supply: string;
  name: string;
  description: string;
  cost: number;
  children: React.ReactNode;
}

export default function SupplyInputItem({ name, cost, supply, description, children }: Props) {
  const { colors, shadow, typography } = useContext(StyleContext);
  return (
    <View style={[styles.wrapper, { backgroundColor: colors.L15 }, shadow.small]}>
      <View style={styles.icon}>
        <AppIcon name={supply} size={48} color={colors.M} />
      </View>
      <View style={[styles.content, space.paddingSideS, { borderColor: colors.L10, flex: 1 }]}>
        <View style={styles.contentRow}>
          <Text style={[typography.subHeaderText, { color: colors.D20 }]}>
            { name }
          </Text>
          <Text style={[typography.button, { color: colors.D10 }, space.marginSideXs]}>·</Text>
          <AppIcon name="resource" size={18} color={colors.D20} />
          <Text style={[typography.button, { color: colors.D20 }]}>
            { cost }
          </Text>
        </View>
        <View style={styles.contentRow}>
          <Text style={[typography.smallButtonLabel, { color: colors.D20 }]}>
            { description }
          </Text>
        </View>
      </View>
      <View style={styles.control}>
        { children }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 4,
    padding: xs,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRightWidth: 1,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  control: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

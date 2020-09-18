import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import ArkhamIcon from '@icons/ArkhamIcon';
import AppIcon from '@icons/AppIcon';

interface Props {
  onPressFaq: () => void;
  onPressTaboo?: () => void;
}

export default function CardFooterButton({ onPressFaq, onPressTaboo }: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const height = 18 * fontScale + 20;
  if (onPressTaboo) {
    return (
      <View style={[
        styles.buttonStyle,
        {
          backgroundColor: colors.L10,
          height,
          paddingLeft: 0,
        },
      ]}>
        <Ripple
          style={[
            styles.buttonStyle,
            {
              flex: 1,
              borderBottomRightRadius: 0,
              backgroundColor: colors.L10,
              height,
            },
          ]}
          rippleColor={colors.L20}
          onPress={onPressFaq}
        >
          <View pointerEvents="box-none" style={styles.row}>
            <ArkhamIcon name="wild" size={18 * fontScale} color={colors.D20} />
            <Text style={[typography.cardButton, { marginLeft: height / 4, color: colors.D20 }]}>
              { t`FAQ` }
            </Text>
          </View>
        </Ripple>
        <View style={[styles.divider, { height: height - 16, backgroundColor: colors.background }]} />
        <Ripple
          style={[
            styles.buttonStyle,
            {
              flex: 1,
              borderBottomLeftRadius: 0,
              backgroundColor: colors.L10,
              height,
            },
          ]}
          rippleColor={colors.L20}
          onPress={onPressTaboo}
        >
          <View pointerEvents="box-none" style={styles.row}>
            <AppIcon name="taboo" size={18 * fontScale} color={colors.D20} />
            <Text style={[typography.cardButton, { marginLeft: height / 4, color: colors.D20 }]}>
              { t`Taboo` }
            </Text>
          </View>
        </Ripple>
      </View>
    )
  }
  return (
    <Ripple
      style={[
        styles.buttonStyle,
        {
          backgroundColor: colors.L10,
          height,
        },
      ]}
      rippleColor={colors.L20}
      onPress={onPressFaq}
    >
      <View pointerEvents="box-none" style={styles.row}>
        <ArkhamIcon name="wild" size={18 * fontScale} color={colors.D20} />
        <Text style={[typography.cardButton, { marginLeft: height / 4, color: colors.D20 }]}>
          { t`FAQ` }
        </Text>
      </View>
    </Ripple>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    paddingLeft: 14,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  divider: {
    width: 1,
  },
});

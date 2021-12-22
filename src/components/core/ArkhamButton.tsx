import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Ripple from '@lib/react-native-material-ripple';
import ArkhamButtonIcon, { ArkhamButtonIconType } from '@icons/ArkhamButtonIcon';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import LanguageContext from '@lib/i18n/LanguageContext';

interface Props {
  icon: ArkhamButtonIconType;
  title: string;
  onPress: () => void;
  grow?: boolean;
  variant?: 'outline' | 'fill';
  noShadow?: boolean;
}

const computeHeight = (fontScale: number, lang: string) => {
  return (fontScale * (lang === 'zh' ? 22 : 20)) + 20 + 20;
};
function ArkhamButton({ icon, title, onPress, grow, variant = 'fill', noShadow }: Props) {
  const { colors, fontScale, shadow, typography } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const height = ((lang === 'zh' ? 22 : 20) * fontScale) + 20;
  const shadowClass = variant === 'fill' ? shadow.medium : shadow.small;
  return (
    <View style={[styles.wrapper, grow ? { flexDirection: 'row' } : styles.inline]}>
      <Ripple
        style={[
          noShadow ? undefined : shadowClass,
          grow ? styles.grow : undefined,
          {
            backgroundColor: variant === 'fill' ? colors.M : colors.background,
            height,
            borderWidth: variant === 'outline' ? 1 : 0,
            borderColor: colors.M,
            borderRadius: height / 2,
            paddingLeft: height / 4,
          },
        ]}
        rippleColor={colors.L10}
        onPress={onPress}
      >
        <View pointerEvents="box-none" style={styles.row}>
          <View style={[{ width: 24 * fontScale, height: 20 * fontScale }, space.marginRightXs]}>
            <ArkhamButtonIcon icon={icon} color={variant === 'fill' ? 'light' : 'dark'} />
          </View>
          <Text style={[typography.button, { color: variant === 'fill' ? colors.L30 : colors.D20 }]}>
            { title }
          </Text>
        </View>
      </Ripple>
    </View>
  );
}

ArkhamButton.computeHeight = computeHeight;
export default ArkhamButton;

const styles = StyleSheet.create({
  wrapper: {
    paddingRight: 12,
    paddingTop: 10,
    paddingBottom: 10,
  },
  grow: {
    flex: 1,
  },
  inline: {
    paddingLeft: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
});

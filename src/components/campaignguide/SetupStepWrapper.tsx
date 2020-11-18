import React, { useContext, useMemo } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import ArkhamIcon from '@icons/ArkhamIcon';
import { BulletType } from '@data/scenario/types';
import space, { s, m, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  bulletType?: BulletType;
  reverseSpacing?: boolean;
  children: React.ReactNode | React.ReactNode[];
  border?: boolean;
  hasTitle?: boolean;
}

export default function SetupStepWrapper({ bulletType, reverseSpacing, children, border, hasTitle }: Props) {
  const { colors } = useContext(StyleContext);

  const balancedSpacing = useMemo(() => {
    switch (bulletType) {
      case 'small':
        return s + m + 20;
      case 'none':
        return s;
      default:
        return s + 22;
    }
  }, [bulletType]);

  const bulletNode = useMemo(() => {
    switch (bulletType) {
      case 'none':
        return <View style={styles.bullet} />;
      case 'small':
        return (
          <View style={[styles.smallBullet, { width: 20 }]}>
            <ArkhamIcon
              name="bullet"
              size={20}
              color={colors.darkText}
            />
          </View>
        );
      default:
        return (
          <View style={styles.bullet}>
            <ArkhamIcon
              name="guide_bullet"
              size={22}
              color={colors.scenarioGreen}
            />
          </View>
        );
    }
  }, [bulletType, colors]);

  if (reverseSpacing) {
    return (
      <View style={[
        styles.step,
        {
          alignItems: 'center',
          justifyContent: 'center',
          paddingRight: balancedSpacing,
        },
      ]}>
        { children }
      </View>
    );
  }

  return (
    <View style={[
      styles.step,
      space.paddingS,
      space.paddingSideM,
      border ? {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.divider,
        backgroundColor: colors.background,
      } : {},
      hasTitle ? { paddingTop: 0, paddingBottom: 0 } : {},
    ]}>
      { bulletNode }
      <View style={styles.mainText}>
        { children }
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    marginRight: s,
    marginTop: xs,
  },
  smallBullet: {
    marginLeft: s + m,
    marginRight: s,
    marginTop: 0,
  },
  mainText: {
    flex: 1,
    flexDirection: 'column',
  },
});

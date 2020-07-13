import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import ArkhamIcon from 'icons/ArkhamIcon';
import { BulletType } from 'data/scenario/types';
import COLORS from 'styles/colors';
import space, { s, m, xs } from 'styles/space';

interface Props {
  bulletType?: BulletType;
  reverseSpacing?: boolean;
  children: React.ReactNode | React.ReactNode[];
  border?: boolean;
  hasTitle?: boolean;
}

export default class SetupStepWrapper extends React.Component<Props> {
  renderBalancedSpacing() {
    const { bulletType } = this.props;
    switch (bulletType) {
      case 'small':
        return s + m + 20;
      case 'none':
        return s;
      default:
        return s + 22;
    }
  }
  renderBullet() {
    const { bulletType } = this.props;
    switch (bulletType) {
      case 'none':
        return <View style={styles.bullet} />;
      case 'small':
        return (
          <View style={[styles.smallBullet, { width: 20 }]}>
            <ArkhamIcon
              name="bullet"
              size={20}
              color={COLORS.darkText}
            />
          </View>
        );
      default:
        return (
          <View style={styles.bullet}>
            <ArkhamIcon
              name="guide_bullet"
              size={22}
              color={COLORS.scenarioGreen}
            />
          </View>
        );
    }
  }

  render() {
    const {
      children,
      border,
      hasTitle,
      reverseSpacing,
    } = this.props;

    if (reverseSpacing) {
      return (
        <View style={[
          styles.step,
          {
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: this.renderBalancedSpacing(),
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
        border ? styles.border : {},
        hasTitle ? { paddingTop: 0, paddingBottom: 0 } : {},
      ]}>
        { this.renderBullet() }
        <View style={styles.mainText}>
          { children }
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  border: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
    backgroundColor: COLORS.background,
  },
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

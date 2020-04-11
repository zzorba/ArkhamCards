import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import ArkhamIcon from 'icons/ArkhamIcon';
import { BulletType } from 'data/scenario/types';
import { COLORS } from 'styles/colors';
import space, { s, m, xs } from 'styles/space';

interface Props {
  bulletType?: BulletType;
  children: React.ReactNode | React.ReactNode[];
  border?: boolean;
  hasTitle?: boolean;
}

export default class SetupStepWrapper extends React.Component<Props> {
  renderBullet() {
    const { bulletType } = this.props;
    switch (bulletType) {
      case 'right':
      case 'none':
        return <View style={styles.bullet} />;
      case 'small':
        return (
          <View style={styles.smallBullet}>
            <ArkhamIcon
              name="bullet"
              size={20}
              color={'#222'}
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
      bulletType,
      hasTitle,
    } = this.props;

    return (
      <View style={[
        styles.step,
        space.paddingS,
        space.paddingSideM,
        border ? styles.border : {},
        hasTitle ? { paddingTop: 0, paddingBottom: 0 } : {},
      ]}>
        { this.renderBullet() }
        <View style={[
          styles.mainText,
          bulletType === 'right' ? styles.right : {},
        ]}>
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
    borderColor: '#888',
    backgroundColor: COLORS.white,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  right: {
    alignItems: 'flex-end',
    paddingLeft: 48,
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

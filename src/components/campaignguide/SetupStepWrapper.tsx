import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import ArkhamIcon from 'icons/ArkhamIcon';
import { BulletType } from 'data/scenario/types';
import { COLORS } from 'styles/colors';

interface Props {
  bulletType?: BulletType;
  children: React.ReactNode | React.ReactNode[];
  border?: boolean;
}

export default class SetupStepWrapper extends React.Component<Props> {
  renderBullet() {
    const { bulletType } = this.props;
    switch (bulletType) {
      case 'none': return <View style={styles.bullet} />;
      case 'small':
        return (
          <View style={styles.smallBullet}>
            <ArkhamIcon
              name="bullet"
              size={24}
              color="#2E5344"
            />
          </View>
        );
      default:
        return (
          <View style={styles.bullet}>
            <ArkhamIcon
              name="guide_bullet"
              size={20}
              color="#2E5344"
            />
          </View>
        );
    }
  }
  render() {
    const {
      children,
      border,
    } = this.props;

    return (
      <View style={[styles.step, border ? styles.border : {}]}>
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
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#888',
    backgroundColor: COLORS.white,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  bullet: {
    marginRight: 8,
    marginTop: 4,
  },
  smallBullet: {
    marginLeft: 32,
    marginRight: 8,
    marginTop: 0,
  },
  mainText: {
    flex: 1,
  },
});

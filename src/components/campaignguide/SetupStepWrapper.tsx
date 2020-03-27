import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import ArkhamIcon from 'icons/ArkhamIcon';
import { BulletType } from 'data/scenario/types';

interface Props {
  bulletType?: BulletType;
  children: React.ReactNode | React.ReactNode[];
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
              size={24}
              color="#2E5344"
            />
          </View>
        );
    }
  }
  render() {
    const {
      children,
    } = this.props;

    return (
      <View style={styles.step}>
        { this.renderBullet() }
        <View style={styles.mainText}>
          { children }
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
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

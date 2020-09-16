import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { ChaosTokenType } from '@app_constants';
import ChaosTokenIcon from '@components/core/ChaosTokenIcon';
import { iconSizeScale } from '@styles/space';
import COLORS from '@styles/colors';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

const CHAOS_TOKEN_BACKGROUND = require('../../../assets/chaos-token-background.jpg');

interface OwnProps {
  iconKey?: ChaosTokenType;
  small?: boolean;
}

type Props = OwnProps;

export default class ChaosToken extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  renderIcon() {
    const { iconKey, small } = this.props;
    const { fontScale } = this.context;
    const size = small ? 25 : 50;
    const scale = ((fontScale - 1) / 4 + 1);
    if (iconKey) {
      return (
        <ChaosTokenIcon
          icon={iconKey}
          size={size * scale * iconSizeScale}
          color="#fff"
          fontFamily="Teutonic"
        />
      );
    }
    return null;
  }

  render() {
    const { small } = this.props;
    const circleStyle = small ? [styles.circle, styles.circleSmall] : [styles.circle, styles.circleLarge];

    return (
      <View style={circleStyle}>
        <ImageBackground source={CHAOS_TOKEN_BACKGROUND} style={styles.token}>
          { this.renderIcon() }
        </ImageBackground>
      </View>
    );
  }
}

const circleLarge = 150 * iconSizeScale;
const circleSmall = 75 * iconSizeScale;

const styles = StyleSheet.create({
  circle: {
    backgroundColor: COLORS.gray,
    borderWidth: 3,
    borderColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    overflow: 'hidden',
  },
  circleSmall: {
    width: circleSmall,
    height: circleSmall,
    borderRadius: circleSmall / 2,
    margin: 6,
  },
  token: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleLarge: {
    width: circleLarge,
    height: circleLarge,
    borderRadius: circleLarge / 2,
  },
});

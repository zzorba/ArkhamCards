import React, { useContext, useMemo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { ChaosTokenType } from '@app_constants';
import ChaosTokenIcon from '@components/core/ChaosTokenIcon';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';

const CHAOS_TOKEN_BACKGROUND = require('../../../assets/chaos-token-background.jpg');

interface OwnProps {
  iconKey?: ChaosTokenType;
  small?: boolean;
}

type Props = OwnProps;

export default function ChaosToken({ iconKey, small }: Props) {
  const { fontScale } = useContext(StyleContext);

  const icon = useMemo(() => {
    const size = small ? 25 : 50;
    const scale = ((fontScale - 1) / 4 + 1);
    if (iconKey) {
      return (
        <ChaosTokenIcon
          icon={iconKey}
          size={size * scale}
          color="#FFF"
          fontFamily="Teutonic"
        />
      );
    }
    return null;
  }, [iconKey, small, fontScale]);

  const circleStyle = small ? [styles.circle, styles.circleSmall] : [styles.circle, styles.circleLarge];
  return (
    <View style={circleStyle}>
      <ImageBackground source={CHAOS_TOKEN_BACKGROUND} style={styles.token}>
        { icon }
      </ImageBackground>
    </View>
  );
}

const circleLarge = 150;
const circleSmall = 75;

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

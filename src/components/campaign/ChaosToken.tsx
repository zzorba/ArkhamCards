import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import RadialGradient from 'react-native-radial-gradient';
import { t } from 'ttag';

import { ChaosTokenType } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import TokenIcon from '@icons/TokenIcon';
import AppIcon from '@icons/AppIcon';
import { TINY_PHONE } from '@styles/sizes';

interface OwnProps {
  iconKey?: ChaosTokenType | 'tap' | 'another' | 'return';
  small?: boolean;
  tiny?: boolean;
  sealed?: boolean;
  shadow?: boolean;
}

type Props = OwnProps;

const CIRCLE_LARGE = TINY_PHONE ? 100 : 150;
export const SMALL_TOKEN_SIZE = TINY_PHONE ? 48 : 64;
export const TINY_TOKEN_SIZE = 48;

const GRADIENTS: { [token: string]: {
  colors: string[];
  stops: string[];
} | undefined } = {
  auto_fail: {
    colors: ['#8D181E', '#6A0B10'],
    stops: ['0.75', '1.0'],
  },
  elder_sign: {
    colors: ['#33A1FB', '#3C8AC9', '#457398'],
    stops: ['0.0', '0.5', '1.0'],
  },
  bless: {
    colors: ['#9C702A', '#695823'],
    stops: ['0.25', '1.0'],
  },
  curse: {
    colors: ['#362330', '#3B224A'],
    stops: ['0.25', '1.0'],
  },
};

function ChaosTokenPart({ name, size, color }: { name: string; size: number; color: string }) {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, width: size, height: size }}>
      { name === 'plus-thin' ? <AppIcon name={name} size={size / 4} color={color} /> : <TokenIcon name={name} size={size} color={color} /> }
    </View>
  );
}

function NormalChaosToken({ iconKey, size, shadowStyle }: { iconKey: ChaosTokenType | 'another' | 'return'; size: number; shadowStyle?: ViewStyle }) {
  const icon = useMemo(() => {
    if (iconKey) {
      switch (iconKey) {
        case 'another':
          return (
            <>
              <ChaosTokenPart name="token_symbol_fill" color="#394852" size={size} />
              <ChaosTokenPart name="token_plus_highlight" color="#FFFBF2" size={size} />
            </>
          );
        case 'return':
          return (
            <>
              <ChaosTokenPart name="token_symbol_fill" color="#394852" size={size} />
              <ChaosTokenPart name="token_dismiss_highlight" color="#FC2323" size={size} />
            </>
          );
        case '+1':
          return (
            <>
              <ChaosTokenPart name="token_symbol_fill" color="#394852" size={size} />
              <ChaosTokenPart name="token_number_overlay" color="#ECBA59" size={size} />
              <ChaosTokenPart name="token_1_highlight" color="#FFFBF2" size={size} />
            </>
          );
        case '0':
        case '-1':
        case '-2':
        case '-3':
        case '-4':
        case '-5':
        case '-6':
        case '-7':
        case '-8':
          return (
            <>
              <ChaosTokenPart name="token_symbol_fill" color="#394852" size={size} />
              <ChaosTokenPart name="token_number_overlay" color="#E6E1D3" size={size} />
              <ChaosTokenPart name={`token_${iconKey}_highlight`} color="#FFFBF2" size={size} />
            </>
          );
        case 'skull':
        case 'cultist':
        case 'tablet':
        case 'elder_thing':
          return (
            <>
              <ChaosTokenPart name={`token_${iconKey === 'skull' ? 'symbol' : iconKey}_fill`} color={SPECIAL_COLORS[iconKey] || '#000000'} size={size} />
              <ChaosTokenPart name={`token_${iconKey}_overlay`} color="#E6E1D3" size={size} />
              <ChaosTokenPart name={`token_${iconKey}_highlight`} color="#FFFBF2" size={size} />
            </>
          );
        case 'auto_fail':
          return (
            <>
              <ChaosTokenPart name="token_auto_fail_overlay" color="#E6E1D3" size={size} />
              <ChaosTokenPart name="token_auto_fail_highlight" color="#8D181E" size={size} />
            </>
          );
        case 'elder_sign':
          return (
            <>
              <ChaosTokenPart name="token_elder_sign_overlay" color="#E6E1D3" size={size} />
              <ChaosTokenPart name="token_elder_sign_fill" color="#427DAD" size={size} />
              <ChaosTokenPart name="token_elder_sign_highlight" color="#E6E1D3" size={size} />
            </>
          );

        case 'bless':
          return (
            <>
              <ChaosTokenPart name="token_bless_fill" color="#9D702A" size={size} />
              <ChaosTokenPart name="token_bless_overlay" color="#E6E1D3" size={size} />
            </>
          );
        case 'curse':
          return (
            <>
              <ChaosTokenPart name="token_curse_fill" color="#35232F" size={size} />
              <ChaosTokenPart name="token_curse_overlay" color="#E6E1D3" size={size} />
            </>
          );
      }
    }
    return null;
  }, [iconKey, size]);

  const gradientParams = iconKey && GRADIENTS[iconKey];

  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2 }, shadowStyle]}>
      <View style={[
        { width: size, height: size, borderRadius: size / 2, overflow: 'hidden' },
      ]}>
        <RadialGradient style={{ width: size, height: size, borderRadius: size / 2, position: 'relative' }}
          colors={gradientParams?.colors || ['#FFFBF2', '#D6CFB9']}
          stops={gradientParams?.stops || [0.6, 1.0]}
          center={[size / 2, size / 2]}
          radius={size / 2}
        >
          { icon }
        </RadialGradient>
      </View>
    </View>
  );
}

function SealedChaosToken({ iconKey, size }: { iconKey: ChaosTokenType; size: number }) {
  const { colors } = useContext(StyleContext);
  const color = colors.token[iconKey] || colors.D20;
  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <ChaosTokenPart name="token_sealed_outline" color={color} size={size} />
      <ChaosTokenPart name={`token_${iconKey === '+1' ? 1 : iconKey}_sealed`} color={color} size={size} />
    </View>
  );
}


const SPECIAL_COLORS: { [token: string]: string | undefined } = {
  skull: '#552D2D',
  cultist: '#314629',
  tablet: '#294146',
  elder_thing: '#442946',
  auto_fail: '#7D1318',
  elder_sign: '#4477A1',
  bless: '#9D702A',
  curse: '#3A2342',
};

function getSize(small?: boolean, tiny?: boolean) {
  if (tiny) {
    return TINY_TOKEN_SIZE;
  }
  return small ? SMALL_TOKEN_SIZE : CIRCLE_LARGE;
}

export default function ChaosToken({ iconKey, small, tiny, sealed, shadow: useShadow }: Props) {
  const { colors, typography, shadow } = useContext(StyleContext);
  const size = getSize(small, tiny);
  if (!iconKey) {
    return <View style={[{ width: size, height: size }, styles.tapCircle]} />;
  }
  if (iconKey === 'tap') {
    return (
      <View style={[{ width: size, height: size }, styles.tapCircle]}>
        <ChaosTokenPart name="tap_circle" color={colors.M} size={size} />
        <Text style={[typography.small, typography.italic, typography.center, typography.light]}>{t`Tap to draw`}</Text>
      </View>
    );
  }
  if (iconKey === 'another' || iconKey === 'return') {
    return <NormalChaosToken iconKey={iconKey} size={size} shadowStyle={shadow.small} />;
  }

  if (sealed) {
    return (
      <SealedChaosToken iconKey={iconKey} size={size} />
    );
  }
  return (
    <NormalChaosToken iconKey={iconKey} size={size} shadowStyle={useShadow ? shadow.drop : undefined} />
  );
}

const styles = StyleSheet.create({
  tapCircle: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

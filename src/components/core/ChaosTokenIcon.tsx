import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
} from 'react-native';

import { SPECIAL_TOKENS, ChaosTokenType } from 'constants';
import ArkhamIcon from 'icons/ArkhamIcon';

const SPECIAL_TOKENS_SET: Set<ChaosTokenType> = new Set(SPECIAL_TOKENS);

interface Props {
  icon: ChaosTokenType;
  size: number;
  color?: string;
  fontFamily?: string;
}

export default function ChaosTokenIcon({ icon, size, color, fontFamily }: Props) {
  if (SPECIAL_TOKENS_SET.has(icon)) {
    return (
      <ArkhamIcon
        name={icon}
        size={size}
        color={color || '#000'}
      />
    );
  }
  const textStyle: TextStyle = {
    fontSize: size,
    color: color || '#000',
    fontFamily: fontFamily || 'System',
  };
  return (
    <Text
      style={[styles.label, textStyle]}
      allowFontScaling={false}
    >
      { icon }
    </Text>
  );
}

interface Styles {
  label: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  label: {
    fontSize: 28,
  },
});

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import ChaosTokenIcon from './ChaosTokenIcon';
import { ChaosTokenType } from 'constants';
import { iconSizeScale } from 'styles/space';

interface Props {
  id: ChaosTokenType;
  fontScale: number;
  status?: 'added' | 'removed';
}
export default function ChaosToken({ id, status, fontScale }: Props) {
  let color = '#eeeeee';
  switch (status) {
    case 'added': color = '#cfe3d0'; break;
    case 'removed': color = '#f5d6d7'; break;
  }
  const SCALE = ((fontScale - 1) / 4 + 1);
  const SIZE = 36 * SCALE * iconSizeScale;

  return (
    <View style={[styles.button, {
      width: SIZE,
      height: SIZE,
      backgroundColor: color,
    }]}>
      <ChaosTokenIcon icon={id} size={28 * SCALE * iconSizeScale} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 8,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: 1,
  },
});

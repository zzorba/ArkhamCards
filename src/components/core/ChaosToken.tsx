import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import ChaosTokenIcon from './ChaosTokenIcon';
import { ChaosTokenType } from '@app_constants';
import space, { iconSizeScale } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  id: ChaosTokenType;
  status?: 'added' | 'removed';
}
export default function ChaosToken({ id, status }: Props) {
  const { colors, fontScale } = useContext(StyleContext);
  let color = colors.L20;
  switch (status) {
    case 'added': color = colors.faction.rogue.lightBackground; break;
    case 'removed': color = colors.faction.survivor.lightBackground; break;
  }
  const SCALE = ((fontScale - 1) / 4 + 1);
  const SIZE = 36 * SCALE * iconSizeScale;

  return (
    <View style={[
      styles.button,
      space.marginRightS,
      {
        width: SIZE,
        height: SIZE,
        backgroundColor: color,
        borderColor: colors.D30,
      },
    ]}>
      <ChaosTokenIcon icon={id} size={28 * SCALE * iconSizeScale} color={colors.darkText} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});

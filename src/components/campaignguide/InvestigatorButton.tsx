import React, { useCallback, useContext } from 'react';
import { Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import space, { s } from '@styles/space';
import COLORS from '@styles/colors';
import { TouchableShrink } from '@components/core/Touchables';

interface Props {
  investigator: Card;
  value: string | undefined;
  widget?: 'shuffle';
  disabled?: boolean;
  color?: 'dark' | 'light';
  onPress: (investigator: Card) => void;
  gameFont?: boolean,
}

export default function InvestigatorButton({
  investigator,
  value,
  widget,
  onPress,
  color,
  gameFont,
  disabled,
}: Props) {
  const { typography, width } = useContext(StyleContext);
  const onTouchablePress = useCallback(() => {
    onPress(investigator);
  }, [onPress, investigator]);
  return (
    <TouchableShrink onPress={onTouchablePress} disabled={disabled}>
      <CompactInvestigatorRow
        investigator={investigator}
        color={color}
        width={width - s * (disabled ? 2 : 4)}
      >
        { !!value && <Text style={[gameFont ? typography.gameFont : typography.text, typography.white]}>{value}</Text>}
        { widget === 'shuffle' && !disabled && (
          <View style={[space.marginRightS, space.marginLeftS]}>
            <MaterialCommunityIcons
              name="shuffle-variant"
              size={24}
              color={COLORS.white}
            />
          </View>
        ) }
      </CompactInvestigatorRow>
    </TouchableShrink>
  );
}

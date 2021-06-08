import React, { useCallback, useContext, useMemo } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import space, { s } from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  investigator: Card;
  value: string;
  widget?: 'shuffle';
  disabled?: boolean;
  onPress: (code: string) => void;
}

export default function InvestigatorButton({
  investigator,
  value,
  widget,
  onPress,
  disabled,
}: Props) {
  const { typography, width } = useContext(StyleContext);
  const onTouchablePress = useCallback(() => {
    onPress(investigator.code);
  }, [onPress, investigator.code]);
  const widgetIcon = useMemo(() => {
    if (!widget || disabled) {
      return null;
    }
    switch (widget) {
      case 'shuffle':
        return (
          <View style={[space.marginRightS, space.marginLeftS]}>
            <MaterialCommunityIcons
              name="shuffle-variant"
              size={24}
              color={COLORS.white}
            />
          </View>
        );
      default:
        return null;
    }
  }, [widget, disabled]);
  return (
    <View style={space.paddingXs}>
      <TouchableOpacity onPress={onTouchablePress} disabled={disabled}>
        <CompactInvestigatorRow
          investigator={investigator}
          width={width - s * (disabled ? 2 : 4)}
        >
          { !!value && <Text style={[typography.text, typography.white]}>{value}</Text>}
          { widgetIcon }
        </CompactInvestigatorRow>
      </TouchableOpacity>
    </View>
  );
}

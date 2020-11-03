import React, { useCallback, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import Switch from '@components/core/Switch';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  code: string;
  name: string;
  color?: string;
  selected: boolean;
  onChoiceToggle: (code: string, value: boolean) => void;
  editable: boolean;
}

export default function CheckListItemComponent({
  code,
  name,
  color,
  selected,
  onChoiceToggle,
  editable,
}: Props) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
  const toggle = useCallback((value: boolean) => {
    onChoiceToggle(code, value);
  }, [onChoiceToggle, code]);
  if (!editable && !selected) {
    return null;
  }
  return (
    <View style={[
      styles.row,
      borderStyle,
      space.paddingS,
      space.paddingSideM,
      color ? { backgroundColor: color } : {},
    ]}>
      <Text style={[
        typography.mediumGameFont,
        styles.nameText,
        color ? { color: 'white' } : {},
      ]}>
        { name }
      </Text>
      { editable ? (
        <Switch
          onValueChange={toggle}
          customColor="white"
          customTrackColor={color ? '#ccc' : undefined}
          value={selected}
        />
      ) : (
        <MaterialCommunityIcons
          name="check"
          size={18}
          color={color ? 'white' : colors.darkText}
        />
      ) }
    </View>
  );
}

const styles = StyleSheet.create({
  nameText: {
    fontWeight: '600',
  },
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

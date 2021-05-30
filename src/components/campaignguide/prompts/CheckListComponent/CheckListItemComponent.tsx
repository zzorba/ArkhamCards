import React, { useCallback, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Switch from '@components/core/Switch';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import Card from '@data/types/Card';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import ArkhamSwitch from '@components/core/ArkhamSwitch';

interface Props {
  code: string;
  investigator?: Card;
  name: string;
  color?: string;
  selected: boolean;
  onChoiceToggle: (code: string, value: boolean) => void;
  editable: boolean;
}

export default function CheckListItemComponent({
  code,
  investigator,
  name,
  color,
  selected,
  onChoiceToggle,
  editable,
}: Props) {
  const { borderStyle, colors, typography, width } = useContext(StyleContext);
  const toggle = useCallback((value: boolean) => {
    onChoiceToggle(code, value);
  }, [onChoiceToggle, code]);
  const onPress = useCallback(() => toggle(!selected), [selected, toggle]);
  if (!editable && !selected) {
    return null;
  }
  if (investigator) {
    return (
      <View style={space.paddingBottomXs}>
        <TouchableOpacity onPress={onPress}>
          <CompactInvestigatorRow
            width={width - (editable ? s * 4 : 2)}
            leftContent={editable && (
              <View style={[{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }]}>
                <ArkhamSwitch
                  onValueChange={toggle}
                  value={selected}
                  large
                  color="light"
                />
              </View>
            )}
            investigator={investigator}
            transparent={editable && !selected}
          />
        </TouchableOpacity>
      </View>
    );
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

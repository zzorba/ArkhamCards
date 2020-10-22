import React, { useCallback, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ChooseOneListComponent from '../ChooseOneListComponent';
import SinglePickerComponent from '@components/core/SinglePickerComponent';
import { DisplayChoice } from '@data/scenario';
import { BulletType } from '@data/scenario/types';
import space from '@styles/space';
import COLORS from '@styles/colors';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface Props {
  code: string;
  name: string;
  color?: string;
  choices: DisplayChoice[];
  choice?: number;
  optional: boolean;
  onChoiceChange: (code: string, index: number) => void;
  editable: boolean;
  detailed?: boolean;
  firstItem: boolean;
}

export default function ChoiceListItemComponent({
  code,
  name,
  color,
  choices,
  choice,
  optional,
  onChoiceChange,
  editable,
  detailed,
  firstItem,
}: Props) {
  const { borderStyle, typography } = useContext(StyleContext);

  const onSelect = useCallback((idx: number) => {
    onChoiceChange(code, idx);
  }, [onChoiceChange, code]);

  if (detailed) {
    return (
      <>
        <View style={[
          styles.headerRow,
          borderStyle,
          space.paddingS,
          space.paddingLeftM,
          color ? { backgroundColor: color } : {},
        ]}>
          <View>
            <Text style={[
              typography.mediumGameFont,
              styles.nameText,
              color ? { color: COLORS.white } : {},
            ]}>
              { name }
            </Text>
          </View>
          <View />
        </View>
        <ChooseOneListComponent
          choices={choices}
          selectedIndex={choice}
          editable={editable}
          onSelect={onSelect}
          color={color}
          noBullet
        />
      </>
    );
  }
  return (
    <SinglePickerComponent
      choices={choices}
      selectedIndex={choice === undefined ? -1 : choice}
      editable={editable}
      optional={optional}
      title={name}
      onChoiceChange={onSelect}
      colors={color ? {
        backgroundColor: color,
        textColor: 'white',
        modalColor: color,
        modalTextColor: 'white',
      } : undefined}
      topBorder={firstItem}
    />
  );
}

const styles = StyleSheet.create({
  nameText: {
    fontWeight: '600',
    color: '#000',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

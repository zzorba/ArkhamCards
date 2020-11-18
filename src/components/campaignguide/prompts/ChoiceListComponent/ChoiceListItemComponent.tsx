import React, { useCallback, useContext, useMemo } from 'react';
import { map } from 'lodash';
import { StyleSheet, Text, View } from 'react-native';

import ChooseOneListComponent from '../ChooseOneListComponent';
import SinglePickerComponent from '@components/core/SinglePickerComponent';
import { DisplayChoice } from '@data/scenario';
import space from '@styles/space';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';

interface Props {
  code: string;
  name: string;
  color?: string;
  masculine?: boolean;
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
  masculine,
  choices,
  choice,
  optional,
  onChoiceChange,
  editable,
  detailed,
  firstItem,
}: Props) {
  const { borderStyle, typography } = useContext(StyleContext);

  const onSelect = useCallback((idx: number | null) => {
    if (idx === null) {
      return;
    }
    onChoiceChange(code, idx);
  }, [onChoiceChange, code]);
  const genderedChoices = useMemo(() => {
    return map(choices, choice => {
      if (choice.masculine_text && choice.feminine_text) {
        return {
          ...choice,
          text: masculine ? choice.masculine_text : choice.feminine_text,
        };
      }
      return choice;
    });
  }, [choices, masculine]);

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
          choices={genderedChoices}
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
      choices={genderedChoices}
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

import React, { useCallback, useContext, useMemo } from 'react';
import { map } from 'lodash';
import { StyleSheet, Text, View } from 'react-native';

import ChooseOneListComponent from '../ChooseOneListComponent';
import SinglePickerComponent from '../SinglePickerComponent';
import { DisplayChoice, DisplayChoiceWithId } from '@data/scenario';
import space from '@styles/space';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import { Gender_Enum } from '@generated/graphql/apollo-schema';
import ListItem from './ListItem';

interface Props extends ListItem {
  noInvestigatorItems?: boolean;
  choices: DisplayChoice[];
  choice?: number;
  optional: boolean;
  onChoiceChange: (code: string, index: number) => void;
  editable: boolean;
  detailed?: boolean;
  firstItem: boolean;
  width: number;
}

export default function ChoiceListItemComponent({
  code,
  investigator,
  component,
  noInvestigatorItems,
  name,
  color,
  gender,
  choices,
  choice,
  optional,
  onChoiceChange,
  editable,
  detailed,
  firstItem,
  width,
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
      if (choice.masculine_text && choice.feminine_text && gender) {
        switch (gender) {
          case Gender_Enum.M: {
            return {
              ...choice,
              text: choice.masculine_text,
            }
          }
          case Gender_Enum.F: {
            return {
              ...choice,
              text: choice.feminine_text,
            };
          }
          case Gender_Enum.Nb: {
            return {
              ...choice,
              text: choice.nonbinary_text || choice.masculine_text,
            };
          }
        }
      }
      return choice;
    });
  }, [choices, gender]);
  if (detailed) {
    return (
      <>
        { !noInvestigatorItems && (investigator ? (
          <CompactInvestigatorRow investigator={investigator} width={width} />
        ) : (
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
          </View>
        )) }
        <ChooseOneListComponent
          choices={genderedChoices}
          selectedIndex={choice}
          editable={editable}
          onSelect={onSelect}
        />
      </>
    );
  }
  return (
    <SinglePickerComponent
      investigator={investigator}
      component={component}
      choices={genderedChoices}
      selectedIndex={choice === undefined ? -1 : choice}
      editable={editable}
      optional={optional}
      title={name}
      onChoiceChange={onSelect}
      width={width}
      firstItem={firstItem}
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

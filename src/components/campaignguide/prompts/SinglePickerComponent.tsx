import React, { useCallback, useContext, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { t } from 'ttag';

import { usePickerDialog, Item } from '@components/deck/dialogs';
import Card from '@data/types/Card';
import { map } from 'lodash';
import PickerStyleButton from '@components/core/PickerStyleButton';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import { DisplayChoice } from '@data/scenario';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { ChoiceIcon } from '@data/scenario/types';
import RadioButton from './RadioButton';

interface Props {
  title: string;
  description?: string;
  choices: DisplayChoice[];
  formatLabel?: (index: number) => string;
  onChoiceChange: (index: number | null) => void;
  investigator?: Card;
  selectedIndex?: number;
  width: number;
  editable: boolean;
  defaultLabel?: string;
  optional?: boolean;
  firstItem?: boolean;
}

function getIcon(icon?: ChoiceIcon): React.ReactNode {
  if (!icon) {
    return null;
  }

  return (
    <RadioButton icon={icon} color="dark" selected />
  );
}

export default function SinglePickerComponent({
  onChoiceChange,
  investigator,
  selectedIndex,
  width,
  title,
  description,
  choices,
  editable,
  optional,
  firstItem,
  ...props
}: Props) {
  const defaultLabel = props.defaultLabel || t`None`;
  const { typography } = useContext(StyleContext);
  const items: Item<number>[] = useMemo(() => {
    return [
      ...(optional ? [{ value: -1, title: defaultLabel }] : []),
      ...map(choices, (c, idx) => {
        return {
          title: c.text || '',
          iconNode: getIcon(c.icon),
          value: idx,
        };
      }),
    ];
  }, [optional, defaultLabel, choices]);
  const onValueChange = useCallback((idx: number) => {
    onChoiceChange(idx);
  }, [onChoiceChange]);
  const { dialog, showDialog } = usePickerDialog({
    title,
    investigator,
    description,
    items,
    onValueChange,
    selectedValue: selectedIndex,
  });
  const selectedLabel = (selectedIndex === undefined || selectedIndex === -1) ? defaultLabel : choices[selectedIndex].selected_text;
  const selectedIcon = (selectedIndex === undefined || selectedIndex === -1) ? undefined : choices[selectedIndex].icon;
  const selection = useMemo(() => {
    return (
      <View style={[{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }]}>
        <Text numberOfLines={2} ellipsizeMode="head" style={[typography.button, investigator ? typography.white : undefined]} >
          { selectedLabel }
        </Text>
        { !!selectedIcon && <View style={space.paddingLeftS}>{ getIcon(selectedIcon) }</View> }
      </View>
    );
  }, [typography, investigator, selectedLabel, selectedIcon]);
  const button = useMemo(() => {
    if (investigator) {
      return (
        <View style={[
          editable && !firstItem ? space.paddingTopXs : undefined,
          editable ? undefined : space.paddingBottomXs,
        ]}>
          <TouchableOpacity
            onPress={showDialog}
            disabled={!editable}
          >
            <CompactInvestigatorRow
              investigator={investigator}
              width={width}
            >
              { selection }
            </CompactInvestigatorRow>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <PickerStyleButton
        id="0"
        onPress={showDialog}
        title={title}
        disabled={!editable}
        value={selectedLabel}
      />
    );
  }, [investigator, showDialog, firstItem, selection, title, editable, width, selectedLabel]);
  return (
    <>
      { button }
      { dialog }
    </>
  );
}

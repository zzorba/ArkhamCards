import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Ripple from '@lib/react-native-material-ripple';
import { useEffectUpdate, useFlag } from '@components/core/hooks';
import StyleContext from '@styles/StyleContext';
import space, { s } from '@styles/space';
import AppIcon from '@icons/AppIcon';
import { SettingsPickerModal } from '@lib/react-native-settings-components';
import { FactionCodeType } from '@app_constants';
import { PickerItem } from '@lib/react-native-settings-components/picker/picker.modal';
import DeckPickerStyleButton from './DeckPickerStyleButton';

interface Props {
  icon: string;
  title: string;
  selectedValue?: number;
  valueLabel: string;
  valueLabelDescription?: string;
  faction: FactionCodeType,
  modalDescription?: string;
  first?: boolean;
  last?: boolean;
  options: PickerItem[];
  editable: boolean;
  onChoiceChange: (index: number | null) => void;
  open?: boolean;
}

function iconSize(icon: string) {
  switch (icon) {
    case 'card-outline':
      return 34;
    case 'parallel':
    case 'taboo_thin':
      return 26;
    default:
      return 28;
  }
}

export default function DeckPickerButton({
  icon,
  faction,
  title,
  selectedValue,
  valueLabel,
  valueLabelDescription,
  modalDescription,
  first,
  last,
  options,
  editable,
  onChoiceChange,
  open: propsOpen,
}: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const modalColor = colors.faction[faction].background;
  const [open, toggleOpen, setOpen] = useFlag(propsOpen || false);
  const onSelectionChange = useCallback((index: number | null) => {
    onChoiceChange(index);
    setOpen(false);
  }, [onChoiceChange, setOpen]);
  useEffectUpdate(() => {
    if (propsOpen) {
      setOpen(propsOpen);
    }
  }, [propsOpen, setOpen]);
  return (
    <>
      <DeckPickerStyleButton
        title={title}
        icon={icon}
        valueLabel={valueLabel}
        editable={editable}
        valueLabelDescription={valueLabelDescription}
        onPress={toggleOpen}
        first={first}
        last={last}
      />
      <SettingsPickerModal
        closeModal={toggleOpen}
        pickerOpen={open}
        pickerValue={selectedValue !== undefined ? [selectedValue] : []}
        onSelectItem={onSelectionChange}
        options={options}
        title={title}
        dialogDescription={modalDescription}
        modalStyle={{
          header: {
            wrapper: { backgroundColor: modalColor },
            title: { color: '#FFF' },
            description: { color: '#FFF' },
          },
          list: {
            scrollView: {
              backgroundColor: colors.L20,
            },
            itemWrapper: {
              backgroundColor: colors.background,
            },
            itemColor: modalColor,
            itemText: {
              color: colors.darkText,
            },
          },
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: s,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    width: 32,
    height: 32,
    marginLeft: s,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundTop: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  roundBottom: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});

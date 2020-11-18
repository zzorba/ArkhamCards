import React, { useCallback, useContext } from 'react';

import { useEffectUpdate, useFlag } from '@components/core/hooks';
import StyleContext from '@styles/StyleContext';
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
  const { colors } = useContext(StyleContext);
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

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, TextInput, View } from 'react-native';
import { t } from 'ttag';

import NewDialog from '@components/core/NewDialog';
import { useFlag } from '@components/core/hooks';
import { useDialog } from '@components/deck/dialogs';
import space, { s } from '@styles/space';
import ArkhamSwitch from '@components/core/ArkhamSwitch';

export type AddSectionFunction = (
  name: string,
  perInvestigator: boolean,
  isCount: boolean
) => void;

export default function useAddCampaignNoteSectionDialog(): [React.ReactNode, (addSection: AddSectionFunction) => void] {
  const addSectionRef = useRef<AddSectionFunction | null>(null);
  const textInputRef = useRef<TextInput>(null);
  const [name, setName] = useState('');
  const [perInvestigator, toggleInvestigator, setPerInvestigator] = useFlag(false);
  const [isCount, toggleCount, setIsCount] = useFlag(false);
  const resetForm = useCallback(() => {
    setName('');
    setPerInvestigator(false);
    setIsCount(false);
  }, [setName, setPerInvestigator, setIsCount]);
  const onAddPress = useCallback(() => {
    addSectionRef.current && addSectionRef.current(name, isCount, perInvestigator);
    resetForm();
  }, [name, perInvestigator, isCount, resetForm]);

  const onCancelPress = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const content = useMemo(() => {
    return (
      <>
        <View style={space.paddingBottomS}>
          <NewDialog.TextInput
            value={name}
            textInputRef={textInputRef}
            placeholder={t`Section Name`}
            onChangeText={setName}
          />
        </View>
        <NewDialog.ContentLine
          icon="slider"
          text={t`Count`}
          paddingBottom={s}
          control={(
            <ArkhamSwitch
              value={isCount}
              onValueChange={toggleCount}
            />
          )}
        />
        <NewDialog.ContentLine
          icon="investigator"
          text={t`Per Investigator`}
          paddingBottom={s}
          control={(
            <ArkhamSwitch
              value={perInvestigator}
              onValueChange={toggleInvestigator}
            />
          )}
        />
      </>
    );
  }, [name, setName, isCount, toggleCount, perInvestigator, toggleInvestigator]);

  const { dialog, showDialog, visible } = useDialog({
    title: t`Add Campaign Log Section`,
    content,
    confirm: {
      title: t`Add`,
      disabled: !name,
      onPress: onAddPress,
    },
    dismiss: {
      title: t`Cancel`,
      onPress: onCancelPress,
    },
  });

  useEffect(() => {
    if (visible && Platform.OS === 'android') {
      setTimeout(() => textInputRef.current?.focus(), 100);
    }
  }, [visible]);

  const showAddSectionDialog = useCallback((addSection: AddSectionFunction) => {
    addSectionRef.current = addSection;
    showDialog();
  }, [showDialog]);
  return [dialog, showAddSectionDialog];
}

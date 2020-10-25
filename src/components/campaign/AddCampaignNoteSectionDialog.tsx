import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Platform,
  TextInput,
  View,
} from 'react-native';
import DialogComponent from '@lib/react-native-dialog';
import { t } from 'ttag';

import Dialog from '@components/core/Dialog';
import StyleContext from '@styles/StyleContext';
import { useFlag } from '@components/core/hooks';

export type AddSectionFunction = (
  name: string,
  perInvestigator: boolean,
  isCount: boolean
) => void;

interface Props {
  viewRef?: View;
  visible: boolean;
  addSection?: AddSectionFunction;
  toggleVisible: () => void;
}

export default function AddCampaignNoteSectionDialog({ viewRef, visible, addSection, toggleVisible }: Props) {
  const { typography } = useContext(StyleContext);
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
    addSection && addSection(name, isCount, perInvestigator);
    resetForm();
    toggleVisible();
  }, [name, perInvestigator, isCount, addSection, toggleVisible, resetForm]);

  const onCancelPress = useCallback(() => {
    resetForm();
    toggleVisible();
  }, [resetForm, toggleVisible]);

  useEffect(() => {
    if (visible) {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }
  }, [visible]);

  const buttonColor = Platform.OS === 'ios' ? '#007ff9' : '#169689';
  return (
    <Dialog
      title={t`Add Campaign Log Section`}
      visible={visible}
      viewRef={viewRef}
    >
      <DialogComponent.Input
        value={name}
        textInputRef={textInputRef}
        placeholder={t`Section Name`}
        onChangeText={setName}
      />
      <DialogComponent.Switch
        label={t`Count`}
        labelStyle={typography.dialogLabel}
        value={isCount}
        onValueChange={toggleCount}
      />
      <DialogComponent.Switch
        label={t`Per Investigator`}
        labelStyle={typography.dialogLabel}
        value={perInvestigator}
        onValueChange={toggleInvestigator}
      />
      <DialogComponent.Button
        label={t`Cancel`}
        onPress={onCancelPress}
      />
      <DialogComponent.Button
        label={t`Add`}
        color={name ? buttonColor : '#666666'}
        disabled={!name}
        onPress={onAddPress}
      />
    </Dialog>
  );
}

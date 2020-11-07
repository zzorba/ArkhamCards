import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Platform,
  TextInput,
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
  visible: boolean;
  addSection?: AddSectionFunction;
  hide: () => void;
}

export default function AddCampaignNoteSectionDialog(props: Props) {
  const { visible, addSection, hide } = props;
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
    hide();
  }, [name, perInvestigator, isCount, addSection, hide, resetForm]);

  const onCancelPress = useCallback(() => {
    resetForm();
    hide();
  }, [resetForm, hide]);

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

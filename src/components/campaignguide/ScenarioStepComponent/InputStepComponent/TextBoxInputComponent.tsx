import React, { useCallback, useContext, useMemo, useState } from 'react';
import { NativeSyntheticEvent, TextInput, TextInputSubmitEditingEventData, StyleSheet } from 'react-native';
import { throttle } from 'lodash';
import { t } from 'ttag';

import { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import InputWrapper from '@components/campaignguide/prompts/InputWrapper';
import ActionButton from '@components/campaignguide/prompts/ActionButton';

interface Props {
  id: string;
  showUndo: boolean;
  prompt?: string;
}

export default function TextBoxInputComponent({ id, prompt, showUndo }: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { borderStyle, colors, typography } = useContext(StyleContext);
  const [text, setText] = useState('');

  const undo = useMemo(() => throttle(() => {
    scenarioState.undo();
  }, 300, { leading: true, trailing: false }), [scenarioState]);

  const saveText = useCallback((text: string) => {
    if (text) {
      scenarioState.setText(id, text);
    }
  }, [id, scenarioState]);

  const onSubmit = useCallback((
    { nativeEvent: { text } }: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    saveText(text);
  }, [saveText]);
  const onSavePress = useCallback(() => {
    saveText(text);
  }, [saveText, text]);

  const textDecision = scenarioState.text(id);
  if (textDecision !== undefined) {
    return null;
  }
  return (
    <InputWrapper
      title={prompt}
      titleStyle="setup"
      titleButton={showUndo ? (
        <ActionButton
          color="light"
          leftIcon="undo"
          title={t`Undo`}
          onPress={undo}
        />
      ) : undefined}
      onSubmit={onSavePress}
      disabledText={!text ? t`Continue` : undefined}
      editable
    >
      <TextInput
        style={[styles.textInput, borderStyle, typography.dark, { backgroundColor: colors.L30 }]}
        onChangeText={setText}
        onSubmitEditing={onSubmit}
        returnKeyType="done"
      />
    </InputWrapper>
  );
}

const styles = StyleSheet.create({
  textInput: {
    marginTop: s,
    marginRight: m,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    paddingTop: 12,
    paddingBottom: 12,
  },
});

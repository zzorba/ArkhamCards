import React, { useCallback, useContext, useMemo, useState } from 'react';
import { NativeSyntheticEvent, TextInput, TextInputSubmitEditingEventData, StyleSheet } from 'react-native';
import { throttle } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';

interface Props {
  id: string;
  showUndo: boolean;
  prompt?: string;
}

export default function TextBoxInputComponent({ id, prompt, showUndo }: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { borderStyle, typography } = useContext(StyleContext);
  const [text, setText] = useState('');

  const undo = useMemo(() => throttle(() => {
    scenarioState.undo();
  }, 500, { leading: true, trailing: false }), [scenarioState]);

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
    <>
      <SetupStepWrapper>
        { !!prompt && <CampaignGuideTextComponent text={prompt} /> }
        <TextInput
          style={[styles.textInput, borderStyle, typography.dark]}
          onChangeText={setText}
          onSubmitEditing={onSubmit}
          returnKeyType="done"
        />
      </SetupStepWrapper>
      <BasicButton
        title={t`Proceed`}
        onPress={onSavePress}
        disabled={!text}
      />
      { showUndo && (
        <BasicButton
          title={t`Cancel`}
          onPress={undo}
        />
      ) }
    </>
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

import React, { useCallback, useContext, useMemo, useState } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import SinglePickerComponent from '@components/core/SinglePickerComponent';
import ChooseOneListComponent from './ChooseOneListComponent';
import ScenarioGuideContext from '../ScenarioGuideContext';
import SetupStepWrapper from '../SetupStepWrapper';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { BulletType } from '@data/scenario/types';
import { DisplayChoice } from '@data/scenario';
import space from '@styles/space';
import { throttle } from 'lodash';
import InputWrapper from './InputWrapper';

interface Props {
  id: string;
  bulletType?: BulletType;
  text?: string;
  showUndo?: boolean;
  choices: DisplayChoice[];
  picker?: boolean;
}

interface State {
  selectedChoice?: number;
}

export default function ChooseOnePrompt({
  id,
  bulletType,
  text,
  choices,
  picker,
  showUndo,
}: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const [currentSelectedChoice, setSelectedChoice] = useState<number | undefined>();

  const undo = useMemo(() => throttle(() => {
    scenarioState.undo();
  }, 500, { leading: true, trailing: false }), [scenarioState]);

  const onChoiceChange = useCallback((index: number | null) => {
    if (index === null) {
      return;
    }
    setSelectedChoice(index);
  }, [setSelectedChoice]);

  const save = useCallback(() => {
    if (currentSelectedChoice !== undefined) {
      scenarioState.setChoice(id, currentSelectedChoice);
    }
  }, [id, currentSelectedChoice, scenarioState]);

  const decision = scenarioState.choice(id);
  const selectedChoice = decision !== undefined ? decision : currentSelectedChoice;
  return (
    <>
      { picker ? (
        <>
          <SinglePickerComponent
            title={selectedChoice === undefined ? (text || '') : ''}
            choices={choices}
            selectedIndex={selectedChoice}
            onChoiceChange={onChoiceChange}
            editable={decision === undefined}
            topBorder
          />
          { decision === undefined && (
            <BasicButton
              title={t`Proceed`}
              onPress={save}
              disabled={selectedChoice === undefined}
            />
          ) }
        </>
      ) : (
        <InputWrapper
          titleNode={
            <SetupStepWrapper bulletType={bulletType}>
              <CampaignGuideTextComponent
                text={text || t`The investigators must decide (choose one):`}
              />
            </SetupStepWrapper>
          }
          editable={decision === undefined}
          disabledText={selectedChoice === undefined ? t`Continue` : undefined} onSubmit={save}
        >
          <View style={[space.paddingTopS, space.paddingBottomS]}>
            <ChooseOneListComponent
              choices={choices}
              selectedIndex={selectedChoice}
              onSelect={setSelectedChoice}
              editable={decision === undefined}
            />
          </View>
        </InputWrapper>
      ) }
      { !!showUndo && decision === undefined && (
        <BasicButton
          title={t`Cancel`}
          onPress={undo}
        />
      ) }
    </>
  );
}

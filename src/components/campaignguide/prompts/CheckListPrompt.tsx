import React, { useCallback, useContext, useMemo, useReducer } from 'react';

import { BulletType, ChecklistInput } from '@data/scenario/types';
import { chooseOneInputChoices } from '@data/scenario/inputHelper';
import CheckListComponent from './CheckListComponent';
import ScenarioStepContext from '../ScenarioStepContext';
import { filter, find, forEach, head, keys, map, range, shuffle } from 'lodash';
import BinaryPrompt from './BinaryPrompt';
import { t } from 'ttag';
import { DisplayChoiceWithId } from '@data/scenario';
import ScenarioGuideContext from '../ScenarioGuideContext';
import PickerStyleButton from '@components/core/PickerStyleButton';
import InputWrapper from './InputWrapper';
import { StringChoices } from '@actions/types';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import SetupStepWrapper from '../SetupStepWrapper';

interface Props {
  id: string;
  bulletType?: BulletType;
  text?: string;
  input: ChecklistInput;
}

function RandomCheckListButton({ index, choice, onPress, editable }: { editable: boolean; index: number; choice?: DisplayChoiceWithId; onPress: (index: number) => void }) {
  const onRandom = useCallback(() => onPress(index), [onPress, index]);
  return (
    <PickerStyleButton
      id={`choice_${index}`}
      noBorder
      title={!choice ? t`Tap to draw` : ''}
      value={choice?.text || ''}
      onPress={onRandom}
      widget={editable ? 'shuffle' : undefined}
      disabled={!editable}
    />
  );
}

export default function CheckListPrompt({ id, bulletType, text, input }: Props) {
  const { campaignLog, } = useContext(ScenarioStepContext);
  const { scenarioState } = useContext(ScenarioGuideContext);
  const choices = chooseOneInputChoices(input.choices, campaignLog);
  const decision = scenarioState.stringChoices(id);
  const hasDecision = decision !== undefined;
  const firstDecisionId = `${id}_use_app`;
  const firstPrompt = useMemo(() => {
    if (!input.random) {
      return null;
    }
    return (
      <>
        { !!text && (
          <SetupStepWrapper bulletType={bulletType}>
            <CampaignGuideTextComponent text={text} />
          </SetupStepWrapper>
        ) }
        <BinaryPrompt
          key="first"
          id={firstDecisionId}
          bulletType="small"
          text={t`Do you want to use the app to randomize choices?`}
        />
      </>
    );
  }, [input.random, firstDecisionId, text]);
  const [liveChoices, updateLiveChoices] = useReducer((choices: string[], { index, options }: { index: number; options: DisplayChoiceWithId[] }) => {
    const newChoices = [...choices];
    while (newChoices.length <= index) {
      newChoices.push('');
    }
    const alreadyChosen = new Set(filter(newChoices, value => value !== ''));
    const eligibleOptions = filter(options, o => !alreadyChosen.has(o.id));
    if (eligibleOptions.length) {
      newChoices[index] = head(shuffle(eligibleOptions))?.id || '';
    }
    return newChoices;
  }, []);

  const drawRandomOption = useCallback((index: number) => {
    updateLiveChoices({ index, options: choices });
  }, [choices, updateLiveChoices]);
  const submit = useCallback(() => {
    const stringChoices: StringChoices = {};
    forEach(liveChoices, id => {
      stringChoices[id] = ['checked'];
    });
    scenarioState.setStringChoices(id, stringChoices);
  }, [liveChoices, id, scenarioState]);
  const secondPrompt = useMemo(() => {
    const firstDecision = scenarioState.decision(firstDecisionId);
    if (!input.random || firstDecision === false) {
      return (
        <CheckListComponent
          key="second"
          id={id}
          choiceId="checked"
          text={text}
          bulletType={bulletType}
          min={input.min}
          max={input.max}
          items={map(choices, choice => {
            return {
              code: choice.id,
              name: choice.text || '',
              description: choice.description,
            };
          })}
          checkText={input.text}
        />
      );
    }
    if (firstDecision === undefined) {
      return null;
    }
    const theChoices = hasDecision ? keys(decision) : liveChoices;
    const quantity = Math.min(choices.length, input.max || 1);
    return (
      <InputWrapper
        bulletType={bulletType}
        editable={!hasDecision}
        disabledText={filter(liveChoices, id => !!id).length < (quantity || 0) ? t`Select more` : undefined}
        onSubmit={submit}
      >
        <>
          { map(range(0, quantity), index => (
            <RandomCheckListButton
              key={index}
              onPress={drawRandomOption}
              index={index}
              editable={!hasDecision}
              choice={theChoices.length > index ? find(choices, o => o.id === theChoices[index]) : undefined}
            />
          )) }
        </>
      </InputWrapper>
    );
  }, [firstDecisionId, drawRandomOption, choices, input, bulletType, text, id]);
  return (
    <>
      { firstPrompt }
      { secondPrompt }
    </>
  );
}

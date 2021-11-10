import React, { useContext, useMemo, useCallback, useReducer, useState } from 'react';
import { flatMap, filter, range, map, keys, head, shuffle, find, forEach } from 'lodash';
import { t } from 'ttag';

import { Partner, PartnerChoiceInput } from '@data/scenario/types';
import useCardList from '@components/card/useCardList';
import { UniversalChoices } from '@data/scenario';
import InvestigatorChoicePrompt from '@components/campaignguide/prompts/InvestigatorChoicePrompt';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import { ActivityIndicator } from 'react-native';
import InputWrapper from '@components/campaignguide/prompts/InputWrapper';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import { getOperand, partnerStatusConditionResult } from '@data/scenario/conditionHelper';
import BinaryPrompt from '@components/campaignguide/prompts/BinaryPrompt';
import PickerStyleButton from '@components/core/PickerStyleButton';
import CheckListComponent, { ListItem } from '@components/campaignguide/prompts/CheckListComponent';
import StyleContext from '@styles/StyleContext';
import { StringChoices } from '@actions/types';

interface Props {
  id: string;
  input: PartnerChoiceInput;
}

function RandomPartnerButton({ index, partner, onPress, editable }: { editable: boolean; index: number; partner?: Partner; onPress: (index: number) => void }) {
  const drawPartner = useCallback(() => onPress(index), [onPress, index]);
  return (
    <PickerStyleButton
      id={`partner_${index}`}
      noBorder
      title={!partner ? t`Tap to draw` : ''}
      value={partner?.name || ''}
      onPress={drawPartner}
      widget={editable ? 'shuffle' : undefined}
      disabled={!editable}
    />
  );
}

export default function PartnerChoiceComponent({ id, input }: Props) {
  const { campaignLog } = useContext(ScenarioStepContext);
  const [partners, quantity, codes] = useMemo(() => {
    const conditionPartners = partnerStatusConditionResult(input.condition, campaignLog);
    const selection = keys(conditionPartners.investigatorChoices);
    const selectionSet = new Set(selection);
    const selectedPartners = filter(campaignLog.campaignGuide.campaignLogPartners(input.condition.section), p => selectionSet.has(p.code));
    const quantity = getOperand(input.quantity, campaignLog);
    return [selectedPartners, Math.min(quantity, selectedPartners.length), selection];
  }, [input, campaignLog]);
  const [cards, loading] = useCardList(codes, 'encounter');

  const items: ListItem[] = useMemo(() => map(partners, p => {
    return {
      code: p.code,
      name: p.name,
      description: p.description,
      investigator: find(cards, c => c.code === p.code),
    };
  }), [partners, cards]);
  const { scenarioState } = useContext(ScenarioGuideContext);
  const decision = scenarioState.stringChoices(id);
  const hasDecision = decision !== undefined;

  const [liveChoices, updateLiveChoices] = useReducer((choices: string[], { index, partners }: { index: number; partners: Partner[] }) => {
    const newChoices = [...choices];
    while (newChoices.length <= index) {
      newChoices.push('');
    }
    const alreadyChosen = new Set(filter(newChoices, value => value !== ''));
    const eligiblePartners = filter(partners, p => !alreadyChosen.has(p.code));
    if (eligiblePartners.length) {
      newChoices[index] = head(shuffle(eligiblePartners))?.code || '';
    }
    return newChoices;
  }, []);
  const drawRandomPartner = useCallback((index: number) => {
    updateLiveChoices({ index, partners });
  }, [partners]);

  const firstDecisionId = `${id}_use_app`;

  const firstPrompt = useMemo(() => {
    if (!input.random) {
      return null;
    }
    return (
      <BinaryPrompt
        id={firstDecisionId}
        bulletType="small"
        text={t`Do you want to use the app to choose a random partner?`}
      />
    );
  }, [input.random, firstDecisionId]);
  const hasFirstDecision = !input.random || scenarioState.decision(firstDecisionId) !== undefined;
  const useAppRandomizer = input.random && scenarioState.decision(firstDecisionId);
  const submit = useCallback(() => {
    const stringChoices: StringChoices = {};
    forEach(liveChoices, code => {
      stringChoices[code] = ['1'];
    });
    scenarioState.setStringChoices(id, stringChoices);
  }, [liveChoices, id, scenarioState]);
  const secondPrompt = useMemo(() => {
    if (!hasFirstDecision) {
      return null;
    }
    if (!useAppRandomizer) {
      return (
        <CheckListComponent
          checkText={`${input.prompt} (choose ${quantity})`}
          min={quantity}
          max={quantity}
          id={id}
          choiceId="1"
          items={items}
        />
      );
    }
    const theChoices = hasDecision ? keys(decision) : liveChoices;
    return (
      <InputWrapper
        title={input.prompt}
        editable={!hasDecision}
        disabledText={find(liveChoices, code => !code) ? t`Select more` : undefined}
        onSubmit={submit}
      >
        <>
          { map(range(0, quantity), index => (
            <RandomPartnerButton
              key={index}
              onPress={drawRandomPartner}
              index={index}
              editable={!hasDecision}
              partner={theChoices.length > index ? find(partners, p => p.code === theChoices[index]) : undefined}
            />
          )) }
        </>
      </InputWrapper>
    );
  }, [hasFirstDecision, useAppRandomizer, id, input.prompt, quantity, items, hasDecision, drawRandomPartner, decision, submit, liveChoices, partners]);
  return (
    <>
      { firstPrompt }
      { secondPrompt }
    </>
  );
}
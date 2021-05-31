import React, { useCallback, useContext, useMemo, useState } from 'react';
import { View } from 'react-native';
import { filter, findIndex, map, keys } from 'lodash';
import { t } from 'ttag';

import Card from '@data/types/Card';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import StyleContext from '@styles/StyleContext';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import InputWrapper from '../InputWrapper';
import InvestigatorRadioChoice from './InvestigatorRadioChoice';
import { s } from '@styles/space';

interface Props {
  id: string;
  title: string;
  choiceId: string;
  description?: string;
  defaultLabel?: string;
  required?: boolean;
  investigators?: string[];
  investigatorToValue?: (card: Card) => string;
  renderResults?: (investigator?: Card) => React.ReactNode;
}

export default function ChooseInvestigatorPrompt({
  id,
  title,
  choiceId,
  description,
  defaultLabel,
  required,
  investigators,
  investigatorToValue,
  renderResults,
}: Props): JSX.Element {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { scenarioInvestigators } = useContext(ScenarioStepContext);
  const { borderStyle, width } = useContext(StyleContext);
  const [selectedInvestigator, setSelectedInvestigator] = useState(required && scenarioInvestigators.length > 0 ? scenarioInvestigators[0].code : undefined);
  const theInvestigators = useMemo(() => {
    const investigatorSet = investigators && new Set(investigators);
    return filter(
      scenarioInvestigators,
      investigator => !investigatorSet || investigatorSet.has(investigator.code)
    );
  }, [investigators, scenarioInvestigators]);

  const onChoiceChange = useCallback((
    index: number | null
  ) => {
    if (index === null) {
      // No choice
      return;
    }
    const selectedInvestigator = index === -1 ?
      undefined :
      theInvestigators[index].code;
    setSelectedInvestigator(selectedInvestigator);
  }, [theInvestigators, setSelectedInvestigator]);

  const save = useCallback(() => {
    scenarioState.setStringChoices(
      id,
      selectedInvestigator === undefined ? {} : {
        [selectedInvestigator]: [choiceId],
      }
    );
  }, [id, choiceId, selectedInvestigator, scenarioState]);

  const choice = scenarioState.stringChoices(id);
  const selectedIndex = useMemo(() => {
    if (choice !== undefined) {
      const investigators = keys(choice);
      if (!investigators.length) {
        return -1;
      }
      const code = investigators[0];
      return findIndex(
        theInvestigators,
        investigator => investigator.code === code
      );
    }
    return findIndex(
      theInvestigators,
      investigator => investigator.code === selectedInvestigator
    );
  }, [selectedInvestigator, choice, theInvestigators]);
  return (
    <InputWrapper
      title={title}
      onSubmit={save}
      editable={choice === undefined}
      disabledText={required && selectedInvestigator === undefined ? t`Continue` : undefined}
    >
      <View style={{ flexDirection: 'column' }}>
        { map(theInvestigators, (investigator, index) => (
          <InvestigatorRadioChoice
            key={investigator.code}
            type="investigator"
            investigator={investigator}
            index={index}
            onSelect={onChoiceChange}
            editable={choice === undefined}
            selected={selectedIndex === index}
            width={width - s * (choice === undefined ? 4 : 2)}
          />
        )) }
        { !required && (
          <InvestigatorRadioChoice
            key="default"
            type="placeholder"
            label={defaultLabel || ''}
            index={-1}
            onSelect={onChoiceChange}
            selected={selectedIndex === -1}
            editable={choice === undefined}
            width={width - s * (choice === undefined ? 4 : 2)}
          />
        ) }
      </View>
      { choice !== undefined && (
        // TODO: need to handle no-choice here?
        !!renderResults && renderResults(
          selectedIndex === -1 ? undefined : theInvestigators[selectedIndex]
        ))
      }
    </InputWrapper>
  );
}

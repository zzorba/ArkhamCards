import React, { useCallback, useContext, useMemo, useState } from 'react';
import { View } from 'react-native';
import { filter, findIndex, map, keys, find } from 'lodash';
import { t } from 'ttag';

import Card from '@data/types/Card';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import StyleContext from '@styles/StyleContext';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import InputWrapper from '../InputWrapper';
import InvestigatorRadioChoice from './InvestigatorRadioChoice';
import { s } from '@styles/space';
import { BulletType } from '@data/scenario/types';
import { BODY_OF_A_YITHIAN } from '@app_constants';

interface Props {
  id: string;
  title: string;
  titleStyle?: 'setup' | 'header';
  bulletType?: BulletType;
  choiceId: string;
  defaultLabel?: string;
  required?: boolean;
  investigators?: string[];
  investigatorToValue?: (card: Card) => string;
  renderResults?: (investigator?: Card) => React.ReactNode;
}

export default function ChooseInvestigatorPrompt({
  id,
  title,
  titleStyle,
  bulletType,
  choiceId,
  defaultLabel,
  required,
  investigators,
  investigatorToValue,
  renderResults,
}: Props): JSX.Element {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { scenarioInvestigators, campaignLog } = useContext(ScenarioStepContext);
  const { width } = useContext(StyleContext);
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
      titleStyle={titleStyle}
      bulletType={bulletType}
      onSubmit={save}
      editable={choice === undefined}
      disabledText={required && selectedInvestigator === undefined ? t`Continue` : undefined}
    >
      <View style={{ flexDirection: 'column' }}>
        { map(theInvestigators, (investigator, index) => {
          const yithian = !!find(campaignLog.traumaAndCardData(investigator.code)?.storyAssets, x => x === BODY_OF_A_YITHIAN);
          return (
            <InvestigatorRadioChoice
              key={investigator.code}
              type="investigator"
              yithian={yithian}
              investigator={investigator}
              description={investigatorToValue?.(investigator)}
              index={index}
              onSelect={onChoiceChange}
              editable={choice === undefined}
              selected={selectedIndex === index}
              width={width - s * (choice === undefined ? 4 : 2)}
            />
          );
        }) }
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

import React, { useCallback, useContext, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { filter, findIndex, map, keys } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import SinglePickerComponent from '@components/core/SinglePickerComponent';
import Card from '@data/types/Card';
import ScenarioStepContext from '../ScenarioStepContext';
import StyleContext from '@styles/StyleContext';
import ScenarioGuideContext from '../ScenarioGuideContext';

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
  const { borderStyle } = useContext(StyleContext);
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
    <>
      <View style={[
        styles.wrapper,
        borderStyle,
        id !== '$lead_investigator' ? styles.topBorder : {},
      ]}>
        <SinglePickerComponent
          title={title}
          description={description}
          defaultLabel={defaultLabel}
          choices={
            map(theInvestigators, investigator => {
              return {
                text: investigatorToValue ? investigatorToValue(investigator) : investigator.name,
                effects: [],
              };
            })
          }
          optional={!required}
          selectedIndex={selectedIndex === -1 ? undefined : selectedIndex}
          editable={choice === undefined}
          onChoiceChange={onChoiceChange}
          topBorder
        />
      </View>
      { choice !== undefined ?
        // TODO: need to handle no-choice here?
        (!!renderResults && renderResults(
          selectedIndex === -1 ? undefined : theInvestigators[selectedIndex]
        )) : (
          <BasicButton
            title={t`Proceed`}
            onPress={save}
            disabled={required && selectedInvestigator === undefined}
          />
        )
      }
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

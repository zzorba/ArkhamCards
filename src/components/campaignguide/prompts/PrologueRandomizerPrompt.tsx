import React, { useCallback, useContext, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { head, find, forEach, map, shuffle, values, filter } from 'lodash';
import { t } from 'ttag';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { chooseOneInputChoices } from '@data/scenario/inputHelper';
import { PrologueRandomizer, StringOption } from '@data/scenario/types';
import ScenarioGuideContext from '../ScenarioGuideContext';
import ScenarioStepContext from '../ScenarioStepContext';
import InputWrapper from './InputWrapper';
import { DisplayChoiceWithId } from '@data/scenario';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import useSingleCard from '@components/card/useSingleCard';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import COLORS from '@styles/colors';
import { StringChoices } from '@actions/types';

interface Props {
  id: string;
  input: PrologueRandomizer;
}

interface Results {
  [id: string]: string | undefined;
}

function PrologueRow({ item, setChoice, options, decision, editable }: {
  item: DisplayChoiceWithId;
  setChoice: (id: string) => void;
  options: StringOption[];
  decision: undefined | string;
  editable: boolean;
}) {
  const { typography, width } = useContext(StyleContext);
  const [card] = useSingleCard(item.id, 'encounter');
  const onPress = useCallback(() => {
    setChoice(item.id);
  }, [item.id, setChoice]);
  const selection = useMemo(() => decision && find(options, o => o.condition === decision), [decision, options]);
  if (!card) {
    return null;
  }
  return (
    <View style={space.paddingVerticalXs}>
      <TouchableOpacity onPress={onPress} disabled={!editable}>
        <CompactInvestigatorRow
          investigator={card}
          color="dark"
          width={width - s * (editable ? 4 : 2)}
        >
          { !!selection && <Text style={[typography.gameFont, typography.white]} >{selection.prompt}</Text>}
          { editable && (
            <View style={space.marginLeftXs}>
              <MaterialCommunityIcons
                name="shuffle-variant"
                size={24}
                color={COLORS.white}
              />
            </View>
          )}
        </CompactInvestigatorRow>
      </TouchableOpacity>
    </View>
  );
}

export default function PrologueRandomizerPrompt({ id, input }: Props) {
  const { campaignLog } = useContext(ScenarioStepContext);
  const { scenarioState } = useContext(ScenarioGuideContext);
  const choices = chooseOneInputChoices(input.choices, campaignLog);
  const decision = scenarioState.stringChoices(id);

  const [liveChoices, setChoices] = useState<Results>({});
  const setChoice = useCallback((id: string) => {
    const alreadyChosen = new Set(values(liveChoices));
    const choice = head(shuffle(filter(input.options, o => !alreadyChosen.has(o.condition))))?.condition;
    setChoices({
      ...liveChoices,
      [id]: choice,
    });
  }, [setChoices, input.options, liveChoices]);

  const results: Results = useMemo(() => {
    if (decision) {
      const results: Results = {};
      forEach(decision, (values, key) => {
        if (values.length) {
          results[key] = values[0];
        }
      });
      return results;
    }
    return liveChoices;
  }, [liveChoices, decision])


  const save = useCallback(() => {
    const toSave: StringChoices = {};
    forEach(liveChoices, (result, code) => {
      if (result) {
        toSave[code] = [result];
      }
    });
    scenarioState.setStringChoices(id, toSave);
  }, [liveChoices, scenarioState, id]);
  const disabled = useMemo(() => !!find(choices, c => !results[c.id]), [choices, results]);
  return (
    <InputWrapper
      title={input.prompt}
      editable={decision === undefined}
      onSubmit={save}
      disabledText={disabled ? t`Continue` : undefined}
    >
      { map(choices, c => (
        <PrologueRow
          key={c.id}
          item={c}
          editable={decision === undefined}
          setChoice={setChoice}
          options={input.options}
          decision={results[c.id]}
        />
      )) }
    </InputWrapper>
  );
}
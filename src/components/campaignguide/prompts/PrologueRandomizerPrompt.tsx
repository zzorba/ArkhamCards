import React, { useCallback, useContext, useMemo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { head, find, forEach, map, shuffle, values, filter } from 'lodash';
import { t } from 'ttag';

import { chooseOneInputChoices } from '@data/scenario/inputHelper';
import { PrologueRandomizer, StringOption } from '@data/scenario/types';
import ScenarioGuideContext from '../ScenarioGuideContext';
import ScenarioStepContext from '../ScenarioStepContext';
import InputWrapper from './InputWrapper';
import { DisplayChoiceWithId } from '@data/scenario';
import space, { m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { StringChoices } from '@actions/types';
import useCardList from '@components/card/useCardList';
import Card from '@data/types/Card';
import InvestigatorButton from '../InvestigatorButton';
import BinaryPrompt from './BinaryPrompt';
import { usePickerDialog } from '@components/deck/dialogs';

interface Props {
  id: string;
  input: PrologueRandomizer;
}

interface Results {
  [id: string]: string | undefined;
}

function PrologueRow({ item, setChoice, options, decision, editable, card, random }: {
  item: DisplayChoiceWithId;
  card?: Card;
  setChoice: (id: DisplayChoiceWithId) => void;
  options: StringOption[];
  decision: undefined | string;
  editable: boolean;
  random?: boolean;
}) {
  const onPress = useCallback(() => {
    setChoice(item);
  }, [item, setChoice]);
  const selection = useMemo(() => (decision && find(options, o => o.condition === decision)) || undefined, [decision, options]);
  if (!card) {
    return null;
  }
  return (
    <View style={space.paddingVerticalXs}>
      <InvestigatorButton
        investigator={card}
        color="dark"
        onPress={onPress}
        disabled={!editable}
        value={selection?.prompt}
        widget={random ? 'shuffle' : undefined}
      />
    </View>
  );
}

export default function PrologueRandomizerPrompt({ id, input }: Props) {
  const { campaignLog } = useContext(ScenarioStepContext);
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { colors } = useContext(StyleContext);
  const choices = useMemo(() => chooseOneInputChoices(input.choices, campaignLog), [input.choices, campaignLog]);
  const decision = scenarioState.stringChoices(id);
  const codes = useMemo(() => map(choices, c => c.id), [choices]);
  const [cards, loading] = useCardList(codes, 'encounter');
  const [liveChoices, setChoices] = useState<Results>({});
  const setRandomChoice = useCallback((item: DisplayChoiceWithId) => {
    const alreadyChosen = new Set(values(liveChoices));
    const choice = head(shuffle(filter(input.options, o => !alreadyChosen.has(o.condition))))?.condition;
    setChoices({
      ...liveChoices,
      [item.id]: choice,
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
  }, [liveChoices, decision]);

  const firstDecisionId = `${id}_use_app`;
  const firstDecision = scenarioState.decision(firstDecisionId);
  const firstPrompt = useMemo(() => {
    if (input.random_only) {
      return null;
    }
    return (
      <BinaryPrompt
        id={firstDecisionId}
        bulletType="small"
        text={t`Do you want to use the app to draw random tarot cards?`}
      />
    );
  }, [input.random_only, firstDecisionId]);

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
  const [dialogInvestigator, setDialogInvestigator] = useState<Card | undefined>();
  const items = useMemo(() => {
    return map(input.options, o => {
      return {
        title: o.prompt || '???',
        value: o.condition,
      };
    });
  }, [input.options]);
  const onDialogChange = useCallback((id: string) => {
    if (dialogInvestigator) {
      setChoices({
        ...liveChoices,
        [dialogInvestigator.code]: id,
      });
    }
  }, [dialogInvestigator, setChoices, liveChoices]);
  const [dialog, showDialog] = usePickerDialog({
    title: t`Choose tarot card`,
    items,
    investigator: dialogInvestigator,
    onValueChange: onDialogChange,
  })
  const showInvestigatorDialog = useCallback((item: DisplayChoiceWithId) => {
    setDialogInvestigator(find(cards, card => card.code === item.id));
    showDialog();
  }, [setDialogInvestigator, cards, showDialog]);
  return (
    <>
      {firstPrompt}
      { (!!input.random_only || firstDecision !== undefined) && (
        <InputWrapper
          title={input.prompt}
          editable={decision === undefined}
          onSubmit={save}
          disabledText={disabled ? t`Continue` : undefined}
        >
          { loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" animating color={colors.lightText} />
            </View>
          ) }
          { map(choices, c => (
            <PrologueRow
              key={c.id}
              item={c}
              card={find(cards, card => card.code === c.id)}
              editable={decision === undefined}
              random={input.random_only || firstDecision}
              setChoice={(input.random_only || firstDecision) ? setRandomChoice : showInvestigatorDialog }
              options={input.options}
              decision={results[c.id]}
            />
          )) }
        </InputWrapper>
      ) }
      { dialog }
    </>
  );
}


const styles = StyleSheet.create({
  loadingRow: {
    flexDirection: 'row',
    padding: m,
    justifyContent: 'center',
  },
});

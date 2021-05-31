import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { every, findIndex, forEach, flatMap, map } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import ChoiceListItemComponent from './ChoiceListItemComponent';
import ScenarioGuideContext from '../../ScenarioGuideContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import { StringChoices } from '@actions/types';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import { BulletType } from '@data/scenario/types';
import { Choices, DisplayChoiceWithId } from '@data/scenario';
import space, { m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import Card from '@data/types/Card';
import InputWrapper from '../InputWrapper';

export interface ListItem {
  code: string;
  investigator?: Card;
  name: string;
  color?: string;
  masculine?: boolean;
}

export interface ChoiceListComponentProps {
  id: string;
  bulletType?: BulletType;
  text?: string;
  optional?: boolean;
  detailed?: boolean;
  options: Choices;
  loading?: boolean;
}
interface Props extends ChoiceListComponentProps {
  items: ListItem[];
}

export default function InvestigatorChoicePrompt({ id, bulletType, text, optional, detailed, options, loading, items }: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { borderStyle, colors } = useContext(StyleContext);
  const [selectedChoice, setSelectedChoice] = useState(() => {
    const selectedChoice: {
      [code: string]: number | undefined;
    } = {};
    if (!optional) {
      forEach(items, item => {
        if (options.type === 'universal') {
          selectedChoice[item.code] = 0;
        } else {
          const personalized = options.perCode[item.code];
          if (personalized && personalized.length) {
            selectedChoice[item.code] = 0;
          }
        }
      });
    }
    return selectedChoice;
  });
  const onChoiceChange = useCallback((code: string, choice: number) => {
    setSelectedChoice({
      ...selectedChoice,
      [code]: choice === -1 ? undefined : choice,
    });
  }, [selectedChoice, setSelectedChoice]);

  const save = useCallback(() => {
    const choices: StringChoices = {};
    forEach(selectedChoice, (idx, code) => {
      if (idx !== undefined && idx !== -1) {
        if (options.type === 'universal') {
          choices[code] = [options.choices[idx].id];
        } else {
          const realIdx = options.perCode[code][idx];
          choices[code] = [options.choices[realIdx].id];
        }
      }
    });
    scenarioState.setStringChoices(
      id,
      choices
    );
  }, [id, options, scenarioState, selectedChoice]);
  const inputChoices = scenarioState.stringChoices(id);
  const hasDecision = inputChoices !== undefined;

  const getChoice = useCallback((
    code: string,
    choices: DisplayChoiceWithId[],
    inputChoices?: StringChoices
  ): number | undefined => {
    if (inputChoices === undefined) {
      const choice = selectedChoice[code];
      if (choice !== undefined) {
        return choice;
      }
    } else {
      const investigatorChoice = inputChoices[code];
      if (investigatorChoice && investigatorChoice.length) {
        return findIndex(choices, option => option.id === investigatorChoice[0]);
      }
    }
    return detailed ? undefined : -1;
  }, [detailed, selectedChoice]);

  const choicesComponent = useMemo(() => {
    const results = flatMap(items, (item, idx) => {
      const choices = options.type === 'universal' ?
        options.choices :
        map(options.perCode[item.code] || [], index => options.choices[index]);
      if (choices.length === 0) {
        return null;
      }
      return (
        <ChoiceListItemComponent
          key={idx}
          {...item}
          choices={choices}
          choice={getChoice(item.code, choices, inputChoices)}
          onChoiceChange={onChoiceChange}
          optional={!!optional}
          editable={inputChoices === undefined}
          detailed={detailed}
          firstItem={idx === 0}
        />
      );
    });

    if (results.length === 0) {
      return (
        <ChoiceListItemComponent
          code="dummy"
          name={t`None`}
          choices={[]}
          editable={false}
          optional={false}
          onChoiceChange={onChoiceChange}
          firstItem
        />
      );
    }
    return results;
  }, [inputChoices, items, detailed, options, optional, getChoice, onChoiceChange]);

  return (
    <InputWrapper
      editable={!hasDecision}
      onSubmit={save}
      disabledText={detailed && !every(
        items,
        item => selectedChoice[item.code] !== undefined) ? t`Continue` : undefined}
      title={text}
      titleStyle="setup"
      bulletType={bulletType}
    >
      { loading ? (
        <View style={[styles.loadingRow, borderStyle]}>
          <ActivityIndicator size="small" animating color={colors.lightText} />
        </View>
      ) : choicesComponent }
    </InputWrapper>
  );
}

const styles = StyleSheet.create({
  loadingRow: {
    flexDirection: 'row',
    padding: m,
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

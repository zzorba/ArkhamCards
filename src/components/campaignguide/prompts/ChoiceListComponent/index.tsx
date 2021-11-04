import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { every, findIndex, forEach, flatMap, map, filter, uniqBy } from 'lodash';
import { t } from 'ttag';

import ChoiceListItemComponent from './ChoiceListItemComponent';
import ScenarioGuideContext from '../../ScenarioGuideContext';
import { StringChoices } from '@actions/types';
import { BulletType } from '@data/scenario/types';
import { Choices, DisplayChoiceWithId } from '@data/scenario';
import { m, s } from '@styles/space';
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
  hideInvestigatorSection?: boolean;
  investigator?: Card;
  bulletType?: BulletType;
  promptType?: 'header' | 'setup';
  text?: string;
  confirmText?: string;
  optional?: boolean;
  detailed?: boolean;
  options: Choices;
  loading?: boolean;
  unique?: boolean;
}
interface Props extends ChoiceListComponentProps {
  items: ListItem[];
}

export default function ChoiceListComponent({ id, promptType, investigator, bulletType, unique, text, confirmText, optional, detailed, options, loading, items, hideInvestigatorSection }: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { borderStyle, colors, width } = useContext(StyleContext);
  const [selectedChoice, setSelectedChoice] = useState(() => {
    const selectedChoice: {
      [code: string]: number | undefined;
    } = {};
    if (!optional) {
      forEach(items, (item, idx) => {
        if (options.type === 'universal') {
          if (unique && idx < options.choices.length) {
            selectedChoice[item.code] = idx;
          } else {
            selectedChoice[item.code] = 0;
          }
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
          noInvestigatorItems={hideInvestigatorSection || !detailed}
          optional={!!optional}
          editable={inputChoices === undefined}
          detailed={detailed}
          firstItem={idx === 0}
          width={width - s * (inputChoices === undefined ? 4 : 2)}
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
          width={width - s * (inputChoices === undefined ? 4 : 2)}
          firstItem
        />
      );
    }
    return results;
  }, [inputChoices, hideInvestigatorSection, items, detailed, options, optional, width, getChoice, onChoiceChange]);
  const disabledText = useMemo(() => {
    if (detailed && !every(items, item => selectedChoice[item.code] !== undefined)) {
      return t`Continue`;
    }
    if (unique) {
      const nonNone = filter(items, item => selectedChoice[item.code] !== undefined);
      if (nonNone.length !== uniqBy(nonNone, item => selectedChoice[item.code]).length) {
        return t`Fix duplicates`;
      }
    }
    return undefined;
  }, [detailed, items, unique, selectedChoice])
  return (
    <InputWrapper
      editable={!hasDecision}
      investigator={investigator}
      onSubmit={save}
      disabledText={disabledText}
      title={(inputChoices !== undefined ? confirmText : undefined) || text}
      titleStyle={promptType || 'setup'}
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

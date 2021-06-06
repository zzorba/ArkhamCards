import React, { useMemo } from 'react';
import { View } from 'react-native';
import { findIndex, flatMap, forEach } from 'lodash';

import { InvestigatorCardResult, BoolOptionWithId } from '@data/scenario/conditionHelper';
import Card from '@data/types/Card';
import { BoolOption } from '@data/scenario/types';
import useCardList from '@components/card/useCardList';

interface Props<T> {
  result: InvestigatorCardResult;
  extraArg: T;
  renderOption: (investigators: Card[], option: BoolOption, extraArg: T) => Element | null;
}

function InvestigatorResultConditionOption<T>({ result, option, renderOption, extraArg }: Props<T> & { option: BoolOptionWithId }) {
  const investigators: string[] = useMemo(() => {
    const investigators: string[] = [];
    forEach(result.investigatorChoices, (choices, code) => {
      if (findIndex(choices, choice => option.id === choice) !== -1) {
        investigators.push(code);
      }
    });
    return investigators;
  }, [result.investigatorChoices, option.id]);
  const [cards, loading] = useCardList(investigators, 'player');
  if (!investigators.length || loading) {
    return null;
  }
  return (
    <View>
      { renderOption(cards, option, extraArg) }
    </View>
  );
}

export default function InvestigatorResultConditionWrapper<T>({ result, extraArg, renderOption }: Props<T>) {
  return (
    <>
      { flatMap(result.options, (option, index) => (
        <InvestigatorResultConditionOption
          key={index}
          result={result}
          extraArg={extraArg}
          option={option}
          renderOption={renderOption}
        />
      )) }
    </>
  );
}

import React, { useMemo } from 'react';
import { View } from 'react-native';
import { find, map } from 'lodash';

import ParallelInvestigatorPicker from './ParallelInvestigatorPicker';
import InvestigatorOption from './InvestigatorOption';
import { DeckMeta } from '@actions/types';
import Card from '@data/types/Card';

interface Props {
  investigator: Card;
  meta: DeckMeta;
  parallelInvestigators: Card[];
  setMeta: (key: keyof DeckMeta, value?: string) => void;
  setParallel: (front: string, back: string) => void;
  editWarning: boolean;
  disabled?: boolean;
  first: boolean;
}

export function hasInvestigatorOptions(investigator: Card, parallelInvestigators: Card[]): boolean {
  return !!parallelInvestigators.length || !!investigator.investigatorSelectOptions().length;
}

export default function InvestigatorOptionsControl({
  investigator,
  meta,
  parallelInvestigators,
  setMeta,
  setParallel,
  editWarning,
  disabled,
  first,
}: Props) {
  const options = investigator.investigatorSelectOptions();
  const hasParallel = !!parallelInvestigators.length;
  const hasOptions = !!options.length;
  const parallelOptionsSection = useMemo(() => {
    if (!parallelInvestigators.length) {
      return null;
    }
    const alternateInvestigator = find(parallelInvestigators, pi => pi.code !== investigator.code);
    if (!alternateInvestigator) {
      return null;
    }

    return (
      <>
        <ParallelInvestigatorPicker
          investigator={investigator}
          alternateInvestigator={alternateInvestigator}
          onChange={setParallel}
          front={meta.alternate_front || investigator.code}
          back={meta.alternate_back || investigator.code}
          disabled={disabled}
          editWarning={editWarning}
          first={first}
          last={!hasOptions}
        />
      </>
    );
  }, [investigator, parallelInvestigators, first, setParallel, disabled, editWarning, meta, hasOptions]);

  return (
    <View>
      { parallelOptionsSection }
      { map(options, (option, idx) => {
        return (
          <InvestigatorOption
            key={idx}
            option={option}
            setMeta={setMeta}
            meta={meta}
            disabled={disabled}
            editWarning={editWarning}
            first={first && !hasParallel && idx === 0}
          />
        );
      }) }
    </View>
  );
}


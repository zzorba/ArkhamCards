import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { find, map } from 'lodash';

import ParallelInvestigatorPicker from './ParallelInvestigatorPicker';
import InvestigatorOption from './InvestigatorOption';
import { DeckMeta } from '@actions/types';
import Card from '@data/Card';

interface Props {
  investigator: Card;
  meta: DeckMeta;
  parallelInvestigators: Card[];
  setMeta: (key: keyof DeckMeta, value?: string) => void;
  editWarning: boolean;
  disabled?: boolean;
}

export default function InvestigatorOptionsModule({
  investigator,
  meta,
  parallelInvestigators,
  setMeta,
  editWarning,
  disabled,
}: Props) {

  const parallelCardChange = useCallback((
    type: 'alternate_front' | 'alternate_back',
    code?: string
  ) => {
    setMeta(type, code);
  }, [setMeta]);

  const parallelOptionsSection = useMemo(() => {
    if (!parallelInvestigators.length) {
      return null;
    }

    return (
      <>
        <ParallelInvestigatorPicker
          investigator={investigator}
          parallelInvestigators={parallelInvestigators}
          type="alternate_front"
          onChange={parallelCardChange}
          selection={find(
            parallelInvestigators,
            investigator => investigator.code === meta.alternate_front
          )}
          disabled={disabled}
          editWarning={editWarning}
        />
        <ParallelInvestigatorPicker
          investigator={investigator}
          parallelInvestigators={parallelInvestigators}
          type="alternate_back"
          onChange={parallelCardChange}
          selection={find(
            parallelInvestigators,
            investigator => investigator.code === meta.alternate_back
          )}
          disabled={disabled}
          editWarning={editWarning}
        />
      </>
    );
  }, [investigator, parallelInvestigators, disabled, editWarning, meta]);

  const options = investigator.investigatorSelectOptions();
  return (
    <View>
      { parallelOptionsSection }
      { map(options, (option, idx) => {
        return (
          <InvestigatorOption
            key={idx}
            investigator={investigator}
            option={option}
            setMeta={setMeta}
            meta={meta}
            disabled={disabled}
            editWarning={editWarning}
          />
        );
      }) }
    </View>
  );
}

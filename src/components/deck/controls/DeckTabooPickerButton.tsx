import React, { useCallback, useMemo } from 'react';
import { find, map } from 'lodash';
import { format } from 'date-fns';
import { c, t } from 'ttag';

import Database from '@data/Database';
import DeckPickerButton from './DeckPickerButton';
import useDbData from '@components/core/useDbData';
import { FactionCodeType } from '@app_constants';

interface Props {
  faction: FactionCodeType;
  tabooSetId?: number;
  setTabooSet: (tabooSet?: number) => void;
  disabled?: boolean;
  open?: boolean;
  first?: boolean;
  last?: boolean;
}

async function fetchTaboos(db: Database) {
  const tabooSetsR = await db.tabooSets();
  const tabooSets = await tabooSetsR.createQueryBuilder()
    .orderBy('id', 'DESC')
    .getMany();
  return tabooSets;
}

export default function DeckTabooPickerButton({ tabooSetId, setTabooSet, disabled, faction, open, first, last }: Props) {
  const tabooSets = useDbData(fetchTaboos);
  const options = useMemo(() => [
    { value: -1, label: c('Taboo List').t`None` },
    ...map(tabooSets, set => {
      return {
        value: set.id,
        label: set.date_start ? format(Date.parse(set.date_start), 'LLL d, yyyy') : 'Unknown',
      };
    }),
  ], [tabooSets]);

  const onTabooChange = useCallback((tabooId: number | null) => {
    if (!tabooSets || tabooId === null) {
      // No change, so just drop it.
      return;
    }
    setTabooSet(tabooId === -1 ? undefined : tabooId);
  }, [tabooSets, setTabooSet]);


  if (!tabooSets) {
    return null;
  }
  const selectedValue = !tabooSetId ? -1 : tabooSetId;
  return (
    <DeckPickerButton
      icon="taboo_thin"
      faction={faction}
      title={t`Taboo List`}
      valueLabel={find(options, option => option.value === selectedValue)?.label || c('Taboo List').t`None`}
      onChoiceChange={onTabooChange}
      selectedValue={selectedValue}
      options={options}
      editable={!disabled}
      first={first}
      last={last}
      open={open}
    />
  );
}

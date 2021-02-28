import React, { useCallback, useEffect, useMemo } from 'react';
import { find, map } from 'lodash';
import { useSelector } from 'react-redux';
import { c, t } from 'ttag';

import Database from '@data/sqlite/Database';
import useDbData from '@components/core/useDbData';
import { AppState } from '@reducers';
import { usePickerDialog } from '../dialogs';
import { utcFormat } from '@lib/datetime';
import DeckPickerStyleButton from './DeckPickerStyleButton';

interface Props {
  tabooSetId?: number;
  setTabooSet: (tabooSet?: number) => void;
  disabled?: boolean;
  open?: boolean;
  first?: boolean;
  last?: boolean;
  show?: boolean;
}

async function fetchTaboos(db: Database) {
  const tabooSetsR = await db.tabooSets();
  const tabooSets = await tabooSetsR.createQueryBuilder()
    .orderBy('id', 'DESC')
    .getMany();
  return tabooSets;
}

export default function DeckTabooPickerButton({ tabooSetId, setTabooSet, disabled, show, open, first, last }: Props) {
  const settingsTabooSetId = useSelector((state: AppState) => state.settings.tabooId);
  const tabooSets = useDbData(fetchTaboos);
  const items = useMemo(() => [
    { value: -1, title: c('Taboo List').t`None` },
    ...map(tabooSets, set => {
      return {
        value: set.id,
        title: set.date_start ? utcFormat(Date.parse(set.date_start) / 1000, 'LLL d, yyyy') : 'Unknown',
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
  const selectedValue = !tabooSetId ? -1 : tabooSetId;
  const { showDialog, dialog } = usePickerDialog({
    title: t`Select Taboo List`,
    items,
    selectedValue,
    onValueChange: onTabooChange,
  });
  useEffect(() => {
    if (open) {
      showDialog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!show && !open && (tabooSetId === undefined || tabooSetId === 0) && (settingsTabooSetId === undefined || settingsTabooSetId === 0)) {
    return null;
  }
  return (
    <>
      <DeckPickerStyleButton
        title={t`Taboo List`}
        icon="taboo_thin"
        editable={!disabled}
        onPress={showDialog}
        valueLabel={find(items, option => option.value === selectedValue)?.title || c('Taboo List').t`None`}
        first={first}
        last={last}
      />
      { dialog }
    </>
  );
}

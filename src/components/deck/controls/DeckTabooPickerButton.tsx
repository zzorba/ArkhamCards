import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { find, map, maxBy } from 'lodash';
import { useSelector } from 'react-redux';
import { c, t } from 'ttag';

import Database from '@data/sqlite/Database';
import useDbData from '@components/core/useDbData';
import { AppState } from '@reducers';
import { Item, usePickerDialog } from '../dialogs';
import { localizedDate } from '@lib/datetime';
import DeckPickerStyleButton from './DeckPickerStyleButton';
import LanguageContext from '@lib/i18n/LanguageContext';

interface Props {
  tabooSetId?: number;
  setTabooSet: (tabooSet: number, useCurrent: boolean, currentTabooId: number | undefined) => void;
  disabled?: boolean;
  open?: boolean;
  first?: boolean;
  last?: boolean;
  show?: boolean;
  loading?: boolean;
  includeCurrent?: boolean;
}

async function fetchTaboos(db: Database) {
  const tabooSetsR = await db.tabooSets();
  const tabooSets = await tabooSetsR.createQueryBuilder()
    .orderBy('id', 'DESC')
    .getMany();
  return tabooSets;
}

export default function DeckTabooPickerButton({ tabooSetId, includeCurrent, setTabooSet, disabled, loading, show, open, first, last }: Props) {
  const settingsTabooSetId = useSelector((state: AppState) => state.settings.tabooId);
  const { lang } = useContext(LanguageContext);
  const tabooSets = useDbData(fetchTaboos);
  const items = useMemo(() => {
    const latestTabooSet = maxBy(tabooSets, ts => ts.id);
    const currentItems: Item<number>[] = includeCurrent ? [
      { value: 100, title: latestTabooSet?.name ? c('Taboo List').t`Current - ${latestTabooSet.name}` : c('Taboo List').t`Current` },
      { value: 0, title: c('Taboo List').t`None` },
      { type: 'header', title: t`Specific taboo set` },
    ] : [
      { value: 0, title: c('Taboo List').t`None` },
    ];
    return [
      ...currentItems,
      ...map(tabooSets, set => {
        return {
          value: set.id,
          title: `${set.name} - ${set.date_start ? localizedDate(new Date(Date.parse(set.date_start)), lang, true) : 'Unknown'}`,
        };
      }),
    ];
  }, [tabooSets, includeCurrent, lang]);

  const onTabooChange = useCallback((tabooId: number | null) => {
    if (!tabooSets || tabooId === null) {
      // No change, so just drop it.
      return;
    }
    setTabooSet(tabooId, tabooId === 100, maxBy(tabooSets, t => t.id)?.id);
  }, [tabooSets, setTabooSet]);
  const selectedValue = !tabooSetId ? 0 : tabooSetId;
  const [dialog, showDialog] = usePickerDialog({
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
        icon="taboo"
        editable={!disabled}
        loading={loading}
        onPress={showDialog}
        valueLabel={find(items, option => option.value === selectedValue)?.title || c('Taboo List').t`None`}
        first={first}
        last={last}
      />
      { dialog }
    </>
  );
}

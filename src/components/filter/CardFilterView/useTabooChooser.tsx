import React, { useCallback, useContext, useMemo } from 'react';
import { find, map } from 'lodash';
import { c, t } from 'ttag';

import Database from '@data/sqlite/Database';
import useDbData from '@components/core/useDbData';
import { localizedDate } from '@lib/datetime';
import LanguageContext from '@lib/i18n/LanguageContext';
import { FilterState } from '@lib/filters';
import NavButton from '@components/core/NavButton';
import { usePickerDialog } from '@components/deck/dialogs';

interface Props {
  onFilterChange: (setting: keyof FilterState, value: any) => void;
  tabooSetId: number;
}

async function fetchTaboos(db: Database) {
  const tabooSetsR = await db.tabooSets();
  const tabooSets = await tabooSetsR.createQueryBuilder()
    .orderBy('id', 'DESC')
    .getMany();
  return tabooSets;
}

export default function useTabooChooser({ tabooSetId, onFilterChange }: Props): [React.ReactNode, React.ReactNode] {
  const { lang } = useContext(LanguageContext);
  const tabooSets = useDbData(fetchTaboos);
  const items = useMemo(() => {
    return [
      { value: 0, title: c('Taboo List').t`None` },
      ...map(tabooSets, set => {
        return {
          value: set.id,
          title: `${set.name} - ${set.date_start ? localizedDate(new Date(Date.parse(set.date_start)), lang, true) : 'Unknown'}`,
        };
      }),
    ];
  }, [tabooSets, lang]);
  const selectedValue = !tabooSetId ? 0 : tabooSetId;
  const onTabooChange = useCallback((tabooId: number | null) => {
    onFilterChange('taboo_set', tabooId);
  }, [onFilterChange]);
  const [dialog, showDialog] = usePickerDialog({
    title: t`Select Taboo List`,
    items,
    selectedValue,
    onValueChange: onTabooChange,
  });

  const tabooSetText = useMemo(() => {
    if (!tabooSets || !tabooSetId) {
      return t`Taboo Set`;
    }

    const tabooSet = find(tabooSets, t => t.id === tabooSetId);
    const tabooSetName = tabooSet?.name || t`Unknown`;
    return t`Taboo Set: ${tabooSetName}`;
  }, [tabooSets, tabooSetId]);

  return [
    dialog,
    <NavButton
      key="button"
      text={tabooSetText}
      onPress={showDialog}
    />,
  ]
}

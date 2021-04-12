import React, { useCallback, useContext } from 'react';
import { findIndex, map } from 'lodash';
import { format } from 'date-fns';
import { c, t } from 'ttag';

import Database from '@data/sqlite/Database';
import SinglePickerComponent from './SinglePickerComponent';
import StyleContext from '@styles/StyleContext';
import useDbData from './useDbData';

interface Props {
  color: string;
  tabooSetId?: number;
  setTabooSet: (tabooSet?: number) => void;
  disabled?: boolean;
  description?: string;
  open?: boolean;
  transparent?: boolean;
}

async function fetchTaboos(db: Database) {
  const tabooSetsR = await db.tabooSets();
  const tabooSets = await tabooSetsR.createQueryBuilder()
    .orderBy('id', 'DESC')
    .getMany();
  return tabooSets;
}

export default function TabooSetPicker({ color, tabooSetId, setTabooSet, disabled, description, open, transparent }: Props) {
  const { colors } = useContext(StyleContext);
  const tabooSets = useDbData(fetchTaboos);
  const onTabooChange = useCallback((tabooId: number | null) => {
    if (!tabooSets || tabooId === null) {
      // No change, so just drop it.
      return;
    }
    setTabooSet((tabooId === -1 || tabooId >= tabooSets.length) ? undefined : tabooSets[tabooId].id);
  }, [tabooSets, setTabooSet]);

  if (!tabooSets) {
    return null;
  }

  const selectedIndex = !tabooSetId ?
    -1 :
    findIndex(tabooSets, set => set && set.id === tabooSetId);
  return (
    <SinglePickerComponent
      title={t`Taboo List`}
      description={description}
      optional
      defaultLabel={c('Taboo List').t`None`}
      onChoiceChange={onTabooChange}
      selectedIndex={selectedIndex}
      choices={map(tabooSets, set => {
        return {
          text: set.date_start ? format(Date.parse(set.date_start), 'LLL d, yyyy') : 'Unknown',
        };
      })}
      colors={{
        modalColor: color,
        modalTextColor: '#FFFFFF',
        backgroundColor: transparent ? 'transparent' : colors.background,
        textColor: colors.darkText,
      }}
      editable={!disabled}
      open={open}
      settingsStyle
      noBorder
      hideWidget={!transparent}
    />
  );
}

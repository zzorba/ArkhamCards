import React, { useCallback, useContext } from 'react';
import { findIndex, map } from 'lodash';
import { format } from 'date-fns';
import { c, t } from 'ttag';

import connectDb from '@components/data/connectDb';
import Database from '@data/Database';
import SinglePickerComponent from './SinglePickerComponent';
import TabooSet from '@data/TabooSet';
import StyleContext from '@styles/StyleContext';

interface OwnProps {
  color: string;
  tabooSetId?: number;
  setTabooSet: (tabooSet?: number) => void;
  disabled?: boolean;
  description?: string;
  open?: boolean;
  transparent?: boolean;
}

interface DbProps {
  tabooSets: TabooSet[];
}

type Props = OwnProps & DbProps;

function TabooSetPicker({ color, tabooSetId, setTabooSet, disabled, description, open, transparent, tabooSets }: Props) {
  const { colors } = useContext(StyleContext);

  const onTabooChange = useCallback((tabooId: number | null) => {
    if (tabooId === null) {
      // No change, so just drop it.
      return;
    }
    setTabooSet((tabooId === -1 || tabooId >= tabooSets.length) ? undefined : tabooSets[tabooId].id);
  }, [tabooSets, setTabooSet]);

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

export default connectDb<OwnProps, DbProps>(
  TabooSetPicker,
  () => {
    return {};
  },
  async(db: Database) => {
    const tabooSetsR = await db.tabooSets();
    const tabooSets = await tabooSetsR.createQueryBuilder()
      .orderBy('id', 'DESC')
      .getMany();
    return {
      tabooSets,
    };
  },
  { tabooSets: [] }
);

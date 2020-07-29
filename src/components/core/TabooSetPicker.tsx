import React from 'react';
import { findIndex, map } from 'lodash';
import { format } from 'date-fns';
import { t } from 'ttag';

import connectDb from '@components/data/connectDb';
import Database from '@data/Database';
import SinglePickerComponent from './SinglePickerComponent';
import TabooSet from '@data/TabooSet';
import COLORS from '@styles/colors';

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

class TabooSetPicker extends React.Component<Props> {

  _onTabooChange = (tabooId: number | null) => {
    const { tabooSets } = this.props;
    if (tabooId === null) {
      // No change, so just drop it.
      return;
    }
    this.props.setTabooSet(
      (tabooId === -1 || tabooId >= tabooSets.length) ? undefined : tabooSets[tabooId].id
    );
  };

  render() {
    const {
      disabled,
      tabooSets,
      tabooSetId,
      color,
      description,
      transparent,
      open,
    } = this.props;
    const selectedIndex = !tabooSetId ?
      -1 :
      findIndex(tabooSets, set => set && set.id === tabooSetId);
    return (
      <SinglePickerComponent
        title={t`Taboo List`}
        description={description}
        optional
        defaultLabel={t`None`}
        onChoiceChange={this._onTabooChange}
        selectedIndex={selectedIndex}
        choices={map(tabooSets, set => {
          return {
            text: set.date_start ? format(Date.parse(set.date_start), 'LLL d, yyyy') : 'Unknown',
          };
        })}
        colors={{
          modalColor: color,
          modalTextColor: '#FFFFFF',
          backgroundColor: transparent ? 'transparent' : COLORS.background,
          textColor: COLORS.darkText,
        }}
        editable={!disabled}
        open={open}
        settingsStyle
        noBorder
        hideWidget={!transparent}
      />
    );
  }
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
  }
);

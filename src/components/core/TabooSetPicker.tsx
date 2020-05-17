import React from 'react';
import { findIndex, map } from 'lodash';
import { format } from 'date-fns';
import { t } from 'ttag';

import connectDb from 'components/core/connectDb'
import Database from 'data/entities/Database';
import SinglePickerComponent from './SinglePickerComponent';
import TabooSet from 'data/TabooSet';
import COLORS from 'styles/colors';

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

  _onTabooChange = (tabooId: number) => {
    const { tabooSets } = this.props;
    this.props.setTabooSet(
      tabooId === -1 ? undefined : tabooSets[tabooId].id
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
      findIndex(tabooSets, set => set.id === tabooSetId);
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
            text: format(Date.parse(set.date_start), 'LLL d, yyyy'),
          };
        })}
        colors={{
          modalColor: color,
          modalTextColor: '#FFF',
          backgroundColor: transparent ? 'transparent' : '#FFF',
          textColor: COLORS.darkTextColor,
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
  async (db: Database) => {
    const tabooSetsR = await db.tabooSets();
    const tabooSets = await tabooSetsR.createQueryBuilder()
      .orderBy('id', 'DESC')
      .getMany();
    return {
      tabooSets,
    };
  }
);

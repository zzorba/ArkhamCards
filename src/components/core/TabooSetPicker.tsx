import React from 'react';
import { findIndex, map } from 'lodash';
import Realm, { Results } from 'realm';
import { format } from 'date-fns';
import { connectRealm, TabooSetResults } from 'react-native-realm';
import { t } from 'ttag';

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

interface RealmProps {
  realm: Realm;
  tabooSets: Results<TabooSet>;
}

type Props = OwnProps & RealmProps;

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

export default connectRealm<OwnProps, RealmProps, TabooSet>(
  TabooSetPicker, {
    schemas: ['TabooSet'],
    mapToProps(
      results: TabooSetResults<TabooSet>,
      realm: Realm
    ): RealmProps {
      return {
        realm,
        tabooSets: results.tabooSets,
      };
    },
  });

import React from 'react';
import { find, map } from 'lodash';
import Realm, { Results } from 'realm';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { connectRealm, TabooSetResults } from 'react-native-realm';
import { SettingsPicker } from 'react-native-settings-components';

import { t } from 'ttag';
import { setTabooSet } from './actions';
import Card from '../../data/Card';
import TabooSet from '../../data/TabooSet';
import { AppState } from '../../reducers';
import { COLORS } from '../../styles/colors';

interface ReduxProps {
  cardsLoading?: boolean;
  tabooSetId?: number;
}

interface ReduxActionProps {
  setTabooSet: (id?: number) => void;
}

interface RealmProps {
  realm: Realm;
  tabooSets: Results<TabooSet>;
}

type Props = ReduxProps & ReduxActionProps & RealmProps;

class TabooPicker extends React.Component<Props> {
  tabooPickerRef?: SettingsPicker<number>;

  _captureTabooPickerRef = (ref: SettingsPicker<number>) => {
    this.tabooPickerRef = ref;
  }

  _onTabooChange = (tabooId: number) => {
    this.tabooPickerRef && this.tabooPickerRef.closeModal();
    this.props.setTabooSet(
      tabooId === -1 ? undefined : tabooId
    );
  };

  _tabooSetToLabel = (tabooId: number) => {
    if (tabooId === -1) {
      return t`None`;
    }
    const { tabooSets } = this.props;
    const tabooSet = find(tabooSets, obj => obj.id === tabooId);
    if (tabooSet) {
      return tabooSet.date_start;
    }
    return t`None`;
  }

  render() {
    const {
      cardsLoading,
      tabooSets,
      tabooSetId,
    } = this.props;
    const options = [
      { value: -1, label: t`None` },
      ...map(tabooSets, set => {
        return {
          label: set.date_start,
          value: set.id,
        };
      }),
    ];
    return (
      <SettingsPicker
        ref={this._captureTabooPickerRef}
        title={t`Taboo List`}
        dialogDescription={t`Changes the default taboo list for newly created decks and search.`}
        value={tabooSetId || -1}
        valuePlaceholder={t`None`}
        valueFormat={this._tabooSetToLabel}
        onValueChange={this._onTabooChange}
        modalStyle={{
          header: {
            wrapper: {
              backgroundColor: COLORS.lightBlue,
            },
            description: {
              paddingTop: 8,
            },
          },
          list: {
            itemColor: COLORS.lightBlue,
          },
        }}
        options={options}
        disabled={cardsLoading}
      />
    );
  }
}


function mapStateToProps(state: AppState): ReduxProps {
  return {
    tabooSetId: state.settings.tabooId,
    cardsLoading: state.cards.loading,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    setTabooSet,
  }, dispatch);
}

export default connectRealm<{}, RealmProps, Card, {}, TabooSet>(
  connect<ReduxProps, ReduxActionProps, RealmProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(TabooPicker), {
    schemas: ['TabooSet'],
    mapToProps(results: TabooSetResults<TabooSet>, realm: Realm): RealmProps {
      return {
        realm,
        tabooSets: results.tabooSets,
      };
    },
  });

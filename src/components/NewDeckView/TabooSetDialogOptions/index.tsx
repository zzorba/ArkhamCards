import React from 'react';
import { map } from 'lodash';
import { Results } from 'realm';
import DialogComponent from 'react-native-dialog';
import { t } from 'ttag';

import TabooSetSwitch from './TabooSetSwitch';
import TabooSet from 'data/TabooSet';
import typography from 'styles/typography';
import space from 'styles/space';

interface Props {
  tabooSets: Results<TabooSet>;
  setTabooSetId: (tabooSet: number) => void;
  tabooSetId?: number;
}

export default class TabooSetDialogOptions extends React.Component<Props> {
  _selectedTabooSetChanged = (tabooSetId: number, selected: boolean) => {
    const { setTabooSetId } = this.props;
    if (selected) {
      setTabooSetId(tabooSetId);
    } else {
      setTabooSetId(0);
    }
  };

  render() {
    const {
      tabooSets,
      tabooSetId,
    } = this.props;
    if (!tabooSets.length) {
      return null;
    }
    return (
      <React.Fragment>
        <DialogComponent.Description style={[typography.dialogLabel, space.marginBottomS]}>
          { t`Taboo List` }
        </DialogComponent.Description>
        { map(tabooSets, (tabooSet, idx) => (
          <TabooSetSwitch
            key={idx}
            tabooId={tabooSet.id}
            label={tabooSet.date_start}
            value={tabooSetId === tabooSet.id}
            onValueChange={this._selectedTabooSetChanged}
          />
        )) }
      </React.Fragment>
    );
  }
}

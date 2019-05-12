import React from 'react';
import { map } from 'lodash';
import { Results } from 'realm';
import DialogComponent from 'react-native-dialog';

import TabooSetSwitch from './TabooSetSwitch';
import TabooSet from '../../data/TabooSet';
import { t } from 'ttag';
import typography from '../../styles/typography';
import space from '../../styles/space';

interface Props {
  tabooSets: Results<TabooSet>;
  setTabooSetId: (tabooSet: number) => void;
  tabooSetId?: number;
}

export default class TabooSetDialogOptions extends React.Component<Props> {
  render() {
    const {
      tabooSets,
      tabooSetId,
      setTabooSetId,
    } = this.props;
    if (!tabooSets.length) {
      return null;
    }
    return (
      <React.Fragment>
        <DialogComponent.Description style={[typography.smallLabel, space.marginBottomS]}>
          { t`TABOO LIST` }
        </DialogComponent.Description>
        <TabooSetSwitch
          label={t`None`}
          tabooId={0}
          value={tabooSetId === undefined || tabooSetId === 0}
          onValueChange={setTabooSetId}
        />
        { map(tabooSets, (tabooSet, idx) => (
          <TabooSetSwitch
            key={idx}
            tabooId={tabooSet.id}
            label={tabooSet.date_start}
            value={tabooSetId === tabooSet.id}
            onValueChange={setTabooSetId}
          />
        )) }
      </React.Fragment>
    );
  }
}

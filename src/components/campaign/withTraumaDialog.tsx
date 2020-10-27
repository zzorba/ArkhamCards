import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

import { InvestigatorData, Trauma } from '@actions/types';
import Card from '@data/Card';
import useTraumaDialog from './useTraumaDialog';

export interface TraumaProps {
  showTraumaDialog: (
    investigator: Card,
    traumaData: Trauma,
    onUpdate?: (investigator: string, traumaData: Trauma) => void
  ) => void;
  investigatorDataUpdates: InvestigatorData;
}

export default function withTraumaDialog<Props>(
  WrappedComponent: React.ComponentType<Props & TraumaProps>,
  options?: { hideKilledInsane: boolean }
) {
  function TraumaEditDialogComponent(props: Props) {
    const {
      showTraumaDialog,
      investigatorDataUpdates,
      clearInvestigatorDataUpdates,
      traumaDialog,
    } = useTraumaDialog({ hideKilledInsane: options?.hideKilledInsane });
    return (
      <View style={styles.wrapper}>
        <View style={styles.wrapper}>
          <WrappedComponent
            showTraumaDialog={showTraumaDialog}
            investigatorDataUpdates={investigatorDataUpdates}
            clearInvestigatorDataUpdates={clearInvestigatorDataUpdates}
            {...props}
          />
        </View>
        { traumaDialog }
      </View>
    );
  }

  hoistNonReactStatic(TraumaEditDialogComponent, WrappedComponent);

  return TraumaEditDialogComponent;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

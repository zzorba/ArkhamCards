import React, { useCallback } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import EditCountComponent from './EditCountComponent';
import space from '@styles/space';
import { ShowCountDialog } from '@components/deck/dialogs';

interface Props {
  xp: number;
  onChange: (xp: number) => void;
  showCountDialog: ShowCountDialog;
  isInvestigator?: boolean;
}

export default function XpComponent({ xp, onChange, showCountDialog, isInvestigator }: Props) {
  const countChanged = useCallback((index: number, count: number) => {
    onChange(count);
  }, [onChange]);

  return (
    <View style={isInvestigator ? space.marginRightXs : {}}>
      <EditCountComponent
        icon="xp"
        countChanged={countChanged}
        showCountDialog={showCountDialog}
        index={0}
        title={t`Experience`}
        count={xp || 0}
        last
      />
    </View>
  );
}

import React, { useCallback } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import EditCountComponent from './EditCountComponent';
import space from '@styles/space';

interface Props {
  xp: number;
  onChange: (xp: number) => void;
  isInvestigator?: boolean;
}

export default function XpComponent({ xp, onChange, isInvestigator }: Props) {
  const countChanged = useCallback((index: number, count: number) => {
    onChange(count);
  }, [onChange]);

  return (
    <View style={isInvestigator ? space.marginRightXs : {}}>
      <EditCountComponent
        countChanged={countChanged}
        index={0}
        title={t`Experience`}
        count={xp || 0}
        isInvestigator={isInvestigator}
      />
    </View>
  );
}

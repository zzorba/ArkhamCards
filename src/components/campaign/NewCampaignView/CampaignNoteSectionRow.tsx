import React, { useCallback, useMemo } from 'react';
import { t } from 'ttag';

import PickerStyleButton from '@components/core/PickerStyleButton';

interface Props {
  name: string;
  isCount?: boolean;
  perInvestigator?: boolean;
  onPress?: (name: string, isCount?: boolean, perInvestigator?: boolean) => void;
}

export default function CampaignNoteSectionRow({ name, isCount, perInvestigator, onPress }: Props) {
  const pickerOnPress = useCallback(() => {
    onPress && onPress(name, isCount, perInvestigator);
  }, [name, isCount, perInvestigator, onPress]);

  const title = useMemo(() => {
    let result = name;
    if (perInvestigator) {
      result += t` (Per Investigator)`;
    }
    if (isCount) {
      result += ': 0';
    }
    return result;
  }, [name, isCount, perInvestigator]);

  return (
    <PickerStyleButton
      id="delete"
      onPress={pickerOnPress}
      disabled={!onPress}
      title={title}
      widget="delete"
      settingsStyle
      noBorder
    />
  );
}

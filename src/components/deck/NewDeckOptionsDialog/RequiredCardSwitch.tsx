import React, { useCallback } from 'react';

import SettingsSwitch from '@components/core/SettingsSwitch';

interface Props {
  index: number;
  disabled: boolean;
  label: string;
  value: boolean;
  onValueChange: (index: number, value: boolean) => void;
}

export default function RequiredCardSwitch({ index, disabled, label, value, onValueChange }: Props) {
  const handleOnValueChange = useCallback((value: boolean) => {
    onValueChange(index, value);
  }, [onValueChange, index]);

  return (
    <SettingsSwitch
      disabled={disabled}
      noDisableText
      title={label}
      value={value}
      onValueChange={handleOnValueChange}
      settingsStyle
    />
  );
}

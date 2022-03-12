import React, { useCallback, useState } from 'react';

import DeckActionRow from './DeckActionRow';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { useEffectUpdate } from '@components/core/hooks';

interface Props {
  title: string;
  description?: string;
  icon: string | React.ReactNode;
  value: boolean;
  onValueChange: (value: boolean) => void;
  loading?: boolean;
  disabled?: boolean;
  last?: boolean;
}

export default function DeckCheckboxButton({ title, description, icon, value, onValueChange, disabled, loading, last }: Props) {
  const [liveValue, setLiveValue] = useState(value);
  const onUpdate = useCallback((value: boolean) => {
    setLiveValue(value);
    setTimeout(() => {
      onValueChange(value);
    }, 100);
  }, [setLiveValue, onValueChange]);
  useEffectUpdate(() => {
    setLiveValue(value);
  }, [setLiveValue, value]);
  return (
    <DeckActionRow
      title={title}
      titleFirst
      description={description}
      icon={icon}
      last={last}
      loading={loading}
      control={<ArkhamSwitch value={liveValue} onValueChange={onUpdate} disabled={disabled} />}
    />
  );
}

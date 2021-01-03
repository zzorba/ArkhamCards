import React from 'react';

import DeckActionRow from './DeckActionRow';
import ArkhamSwitch from '@components/core/ArkhamSwitch';

interface Props {
  title: string;
  description?: string;
  icon: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  loading?: boolean;
  disabled?: boolean;
  last?: boolean;
}

export default function DeckCheckboxButton({ title, description, icon, value, onValueChange, disabled, loading, last }: Props) {
  return (
    <DeckActionRow
      title={title}
      description={description}
      icon={icon}
      last={last}
      loading={loading}
      control={<ArkhamSwitch value={value} onValueChange={onValueChange} disabled={disabled} />}
    />
  );
}

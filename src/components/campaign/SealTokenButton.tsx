import React, { useCallback } from 'react';

import ChaosTokenButton from './ChaosTokenButton';
import { ChaosTokenType } from '@app_constants';

interface Props {
  id: string;
  sealed?: boolean;
  onToggle: (id: string) => void;
  iconKey: ChaosTokenType;
}

export default function SealTokenButton({ id, iconKey, onToggle, sealed = false }: Props) {
  const toggleSealToken = useCallback(() => {
    onToggle(id);
  }, [onToggle, id]);
  return (
    <ChaosTokenButton
      selected={!!sealed}
      onPress={toggleSealToken}
      iconKey={iconKey}
      tiny
    />
  );
}

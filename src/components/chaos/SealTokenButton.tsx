import React, { useCallback } from 'react';

import ChaosTokenButton from '../chaos/ChaosTokenButton';
import { ChaosTokenType } from '@app_constants';
import { isTablet } from '@styles/space';

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
      tiny={!isTablet}
    />
  );
}

import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { updateChaosBagResults } from './actions';
import ChaosTokenButton from './ChaosTokenButton';
import { ChaosTokenType } from '@app_constants';
import { useChaosBagResults } from '@components/core/hooks';

interface Props {
  campaignId: number;
  id: string;
  iconKey: ChaosTokenType;
  sealed?: boolean;
  canDisable?: boolean;
}

export default function SealTokenButton({ campaignId, id, iconKey, sealed = false, canDisable = false }: Props) {
  const chaosBagResults = useChaosBagResults(campaignId);
  const dispatch = useDispatch();
  const toggleSealToken = useCallback(() => {
    let newSealedTokens = [...chaosBagResults.sealedTokens];

    if (sealed) {
      newSealedTokens = newSealedTokens.filter(token => token.id !== id);
    } else {
      const token = { id: id, icon: iconKey };
      newSealedTokens.push(token);
    }

    const newChaosBagResults = {
      ...chaosBagResults,
      drawnTokens: chaosBagResults.drawnTokens,
      sealedTokens: newSealedTokens,
      totalDrawnTokens: chaosBagResults.totalDrawnTokens,
    };

    dispatch(updateChaosBagResults(campaignId, newChaosBagResults));
  }, [dispatch, campaignId, chaosBagResults, id, iconKey, sealed]);

  return (
    <ChaosTokenButton
      selected={!!(sealed && canDisable)}
      onPress={toggleSealToken}
      iconKey={iconKey}
    />
  );
}

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { t } from 'ttag';

import { Campaign, CampaignId } from '@actions/types';
import NewDialog from '@components/core/NewDialog';
import { useCounter } from '@components/core/hooks';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { ShowAlert, useDialog } from '@components/deck/dialogs';
import Card from '@data/Card';
import { useDispatch } from 'react-redux';
import ArkhamCardsAuthProvider from '@lib/ArkhamCardsAuthProvider';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { deleteCampaign } from './actions';
import { useDeleteCampaignRequest } from '@data/firebase/api';
import { Navigation } from 'react-native-navigation';

export function useCampaignId(campaignId: CampaignId): [CampaignId, (serverId: string) => void] {
  const [liveCampaignId, setLiveCampaignId] = useState(campaignId);
  const setServerId = useCallback(
    (serverId: string) => setLiveCampaignId({ campaignId: campaignId.campaignId, serverId }),
    [setLiveCampaignId, campaignId.campaignId]
  );
  return [liveCampaignId, setServerId];
}


interface XpDialogState {
  investigator: string;
  spentXp: number;
  totalXp: number;
}

export function useXpDialog(updateSpentXp: (investigator: string, spentXp: number) => void): [
  React.ReactNode,
  (investigator: Card, spentXp: number, totalXp: number) => void,
] {
  const [state, setState] = useState<XpDialogState | undefined>();
  const [spentXp, incXp, decXp, setXpAdjustment] = useCounter(state?.spentXp || 0, {});
  useEffect(() => {
    if (state) {
      setXpAdjustment(state.spentXp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const saveChanges = useCallback(() => {
    if (state) {
      updateSpentXp(state.investigator, spentXp);
    }
  }, [updateSpentXp, state, spentXp]);

  const content = useMemo(() => {
    return (
      <NewDialog.ContentLine
        text={t`Experience:`}
        control={(
          <PlusMinusButtons
            onIncrement={incXp}
            onDecrement={decXp}
            count={spentXp}
            dialogStyle
            allowNegative
          />
        )}
      />
    );
  }, [spentXp, incXp, decXp]);

  const { setVisible, dialog } = useDialog({
    title: t`Adjust XP`,
    content,
    confirm: {
      title: t`Done`,
      onPress: saveChanges,
    },
    dismiss: {
      title: t`Cancel`,
    },
  });
  const showXpAdjustmentDialog = useCallback((investigator: Card, spentXp: number, totalXp: number) => {
    setState({
      investigator: investigator.code,
      spentXp,
      totalXp,
    });
    setVisible(true);
  }, [setState, setVisible]);
  return [dialog, showXpAdjustmentDialog];
}

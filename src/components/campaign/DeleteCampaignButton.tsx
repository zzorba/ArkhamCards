import React, { useCallback, useContext } from 'react';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { CampaignId } from '@actions/types';
import { ShowAlert } from '@components/deck/dialogs';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useDispatch } from 'react-redux';
import { useDeleteCampaignRequest, useLeaveCampaignRequest } from '@data/remote/campaigns';
import { deleteCampaign } from './actions';
import { s } from '@styles/space';
import DeckButton from '@components/deck/controls/DeckButton';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';

interface Props {
  componentId: string;
  campaignId: CampaignId;
  campaign: SingleCampaignT | undefined;
  showAlert: ShowAlert;
  standalone?: boolean;
}

export default function DeleteCampaignButton({ componentId, campaignId, campaign, showAlert, standalone }: Props) {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const dispatch = useDispatch();
  const deleteServerCampaign = useDeleteCampaignRequest();
  const leaveCampaign = useLeaveCampaignRequest();
  const actuallyDeleteCampaign = useCallback(() => {
    if (campaignId.serverId && userId) {
      deleteServerCampaign(campaignId);
    }
    dispatch(deleteCampaign(userId, campaignId));
    Navigation.pop(componentId);
  }, [dispatch, componentId, campaignId, deleteServerCampaign, userId]);
  const confirmDeleteCampaign = useCallback(() => {
    const campaignName = campaign?.name || '';
    showAlert(
      t`Delete`,
      standalone ?
        t`Are you sure you want to delete this standalone?` :
        t`Are you sure you want to delete the campaign: ${campaignName}`,
      [
        { text: t`Cancel`, style: 'cancel' },
        { text: t`Delete`, onPress: actuallyDeleteCampaign, style: 'destructive' },
      ],
    );
  }, [campaign, actuallyDeleteCampaign, showAlert, standalone]);

  const actuallyLeaveCampaign = useCallback(() => {
    if (campaignId.serverId) {
      leaveCampaign(campaignId);
    }
    Navigation.pop(componentId);
  }, [campaignId, componentId, leaveCampaign]);
  const confirmLeaveCampaign = useCallback(() => {
    showAlert(
      standalone ? t`Leave standalone` : t`Leave campaign`,
      standalone ?
        t`Are you sure you want to leave this standalone?\n\nYour decks will be removed from the standalone, but you can rejoin it later.` :
        t`Are you sure you want to leave this campaign?\n\nYour decks will be removed from the campaign, but you can rejoin it later.`,
      [
        { text: t`Cancel`, style: 'cancel' },
        { text: t`Leave`, onPress: actuallyLeaveCampaign, style: 'destructive' },
      ],
    );
  }, [standalone, actuallyLeaveCampaign, showAlert]);
  if (userId && campaignId.serverId && campaign && userId !== campaign.owner_id) {
    return (
      <DeckButton
        icon="delete"
        title={standalone ? t`Leave standalone` : t`Leave campaign`}
        thin
        color="red_outline"
        onPress={confirmLeaveCampaign}
        bottomMargin={s}
      />
    );
  }
  return (
    <DeckButton
      icon="delete"
      title={standalone ? t`Delete standalone` : t`Delete campaign`}
      thin
      color="red_outline"
      onPress={confirmDeleteCampaign}
      bottomMargin={s}
    />
  );
}

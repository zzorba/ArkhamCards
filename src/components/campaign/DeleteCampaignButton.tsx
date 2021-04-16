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

interface Props {
  componentId: string;
  campaignId: CampaignId;
  campaignName: string;
  showAlert: ShowAlert;
}

export default function DeleteCampaignButton({ componentId, campaignId, campaignName, showAlert }: Props) {
  const { user } = useContext(ArkhamCardsAuthContext);
  const dispatch = useDispatch();
  const deleteServerCampaign = useDeleteCampaignRequest();
  const leaveCampaign = useLeaveCampaignRequest();
  const actuallyDeleteCampaign = useCallback(() => {
    dispatch(deleteCampaign(user, campaignId));
    if (campaignId.serverId && user) {
      deleteServerCampaign(campaignId);
    }
    Navigation.pop(componentId);
  }, [dispatch, componentId, campaignId, deleteServerCampaign, user]);
  const confirmDeleteCampaign = useCallback(() => {
    showAlert(
      t`Delete`,
      t`Are you sure you want to delete the campaign: ${campaignName}`,
      [
        { text: t`Cancel`, style: 'cancel' },
        { text: t`Delete`, onPress: actuallyDeleteCampaign, style: 'destructive' },
      ],
    );
  }, [campaignName, actuallyDeleteCampaign, showAlert]);

  const actuallyLeaveCampaign = useCallback(() => {
    if (campaignId.serverId) {
      leaveCampaign(campaignId);
    }
    Navigation.pop(componentId);
  }, [campaignId, componentId, leaveCampaign]);
  const confirmLeaveCampaign = useCallback(() => {
    showAlert(
      t`Leave campaign`,
      t`Are you sure you want to leave this campaign?\n\nYour decks will be removed from the campaign, but you can rejoin it later.`,
      [
        { text: t`Cancel`, style: 'cancel' },
        { text: t`Leave`, onPress: actuallyLeaveCampaign, style: 'destructive' },
      ],
    );
  }, [actuallyLeaveCampaign, showAlert]);
  if (user && campaignId.serverId) {
    return (
      <DeckButton
        icon="delete"
        title={t`Leave campaign`}
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
      title={t`Delete campaign`}
      thin
      color="red_outline"
      onPress={confirmDeleteCampaign}
      bottomMargin={s}
    />
  );
}

import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { CampaignId } from '@actions/types';
import { ShowAlert } from '@components/deck/dialogs';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useDispatch } from 'react-redux';
import { UpdateCampaignActions, useDeleteCampaignRequest, useLeaveCampaignRequest } from '@data/remote/campaigns';
import { deleteCampaign, updateCampaignArchived } from './actions';
import { s } from '@styles/space';
import DeckButton from '@components/deck/controls/DeckButton';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '@reducers';
import { Action } from 'redux';

interface Props {
  componentId: string;
  campaignId: CampaignId;
  campaign: SingleCampaignT | undefined;
  actions: UpdateCampaignActions;
  showAlert: ShowAlert;
  standalone?: boolean;
}

type Dispatch = ThunkDispatch<AppState, unknown, Action<string>>;

export default function DeleteCampaignButton({ componentId, actions, campaignId, campaign, showAlert, standalone }: Props) {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const dispatch: Dispatch = useDispatch();
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
  const [archiveLoading, setArchiveLoading] = useState(false);
  const archiveCampaign = useCallback(async() => {
    setArchiveLoading(true);
    await dispatch(updateCampaignArchived(userId, actions, campaignId, !campaign?.archived));
    setArchiveLoading(false);
  }, [dispatch, setArchiveLoading, campaignId, actions, userId, campaign?.archived]);
  const archiveButton = useMemo(() => {
    const archived = !!campaign?.archived;
    return (
      <DeckButton
        icon="book"
        title={archived ? t`Unarchive campaign` : t`Archive campaign`}
        thin
        loading={archiveLoading}
        color="light_gray"
        onPress={archiveCampaign}
        bottomMargin={s}
      />
    );
  }, [archiveCampaign, campaign?.archived, archiveLoading]);
  if (userId && campaignId.serverId && campaign && userId !== campaign.owner_id) {
    return (
      <>
        {archiveButton}
        <DeckButton
          icon="delete"
          title={standalone ? t`Leave standalone` : t`Leave campaign`}
          thin
          color="red_outline"
          onPress={confirmLeaveCampaign}
          bottomMargin={s}
        />
      </>
    );
  }
  return (
    <>
      {archiveButton}
      <DeckButton
        icon="delete"
        title={standalone ? t`Delete standalone` : t`Delete campaign`}
        thin
        color="red_outline"
        onPress={confirmDeleteCampaign}
        bottomMargin={s}
      />
    </>
  );
}

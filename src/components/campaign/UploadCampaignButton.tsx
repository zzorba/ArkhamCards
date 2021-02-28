import React, { useCallback, useContext, useState } from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '@reducers';
import { Action } from 'redux';
import { useDispatch } from 'react-redux';
import { t } from 'ttag';

import { CampaignId } from '@actions/types';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useCreateCampaignActions } from '@data/firebase/api';
import { uploadCampaign } from '@components/campaignguide/actions';
import useNetworkStatus from '@components/core/useNetworkStatus';
import DeckButton from '@components/deck/controls/DeckButton';
import { ShowAlert } from '@components/deck/dialogs';
import { s } from '@styles/space';

interface Props {
  campaignId: CampaignId;
  setCampaignServerId: (serverId: number) => void;
  showAlert: ShowAlert;
  guided: boolean;
  linked?: {
    campaignIdA: string;
    campaignIdB: string;
  };
}

type Dispatch = ThunkDispatch<AppState, unknown, Action<string>>;

export default function UploadCampaignButton({ campaignId, setCampaignServerId, showAlert }: Props) {
  const { user } = useContext(ArkhamCardsAuthContext);
  const [{ isConnected }] = useNetworkStatus();
  const [uploading, setUploading] = useState(false);
  const dispatch: Dispatch = useDispatch();
  const createCampaignActions = useCreateCampaignActions();
  const confirmUploadCampaign = useCallback(async() => {
    if (!uploading && user && !campaignId.serverId) {
      setUploading(true);
      try {
        const newCampaignId = await dispatch(uploadCampaign(user, createCampaignActions, campaignId));
        setCampaignServerId(newCampaignId.serverId);
      } catch (e) {
        showAlert('Error', e.message);
      }
      setUploading(false);
    }
  }, [dispatch, createCampaignActions, setCampaignServerId, setUploading, showAlert, user, uploading, campaignId]);
  if (!user || campaignId.serverId) {
    return null;
  }
  return (
    <DeckButton
      icon="backup"
      title={t`Upload campaign`}
      detail={!isConnected ? t`You must be online to upload campaigns` : undefined}
      disabled={!isConnected}
      thin
      color="light_gray"
      onPress={confirmUploadCampaign}
      loading={uploading}
      bottomMargin={s}
    />
  );
}

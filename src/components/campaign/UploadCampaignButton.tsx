import React, { useCallback, useContext, useRef, useEffect, useState } from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '@reducers';
import { Action } from 'redux';
import { useDispatch } from 'react-redux';

import { t } from 'ttag';

import { CampaignId, UploadedCampaignId } from '@actions/types';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useCreateCampaignActions } from '@data/remote/campaigns';
import { uploadCampaign } from '@components/campaignguide/actions';
import useNetworkStatus from '@components/core/useNetworkStatus';
import DeckButton from '@components/deck/controls/DeckButton';
import { ShowAlert } from '@components/deck/dialogs';
import { s } from '@styles/space';
import { DeckActions } from '@data/remote/decks';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import { useBackButton } from '@components/core/hooks';
import { useNavigation } from '@react-navigation/native';

interface Props {
  campaignId: CampaignId;
  standalone?: boolean;
  campaign: SingleCampaignT | undefined;
  deckActions: DeckActions;
  setCampaignServerId: undefined | ((serverId: number) => void);
  setCampaignLinkedServerId?: (id: {
    campaignId: UploadedCampaignId;
    campaignIdA: UploadedCampaignId;
    campaignIdB: UploadedCampaignId;
  }) => void;
  showAlert: ShowAlert;
  upload?: boolean;
}

type Dispatch = ThunkDispatch<AppState, unknown, Action<string>>;

export default function UploadCampaignButton({ campaign, campaignId, deckActions, standalone, upload, setCampaignServerId, setCampaignLinkedServerId, showAlert }: Props) {
  const navigation = useNavigation();
  const { userId } = useContext(ArkhamCardsAuthContext);
  const [{ isConnected }] = useNetworkStatus();
  const [uploading, setUploading] = useState(false);
  const dispatch: Dispatch = useDispatch();
  const createCampaignActions = useCreateCampaignActions();
  const uploadingRef = useRef(uploading);
  uploadingRef.current = uploading;
  const handleBackPress = useCallback(() => {
    // Disable hardware back when uploading.
    return uploadingRef.current;
  }, []);
  useBackButton(handleBackPress);

  const confirmUploadCampaign = useCallback(async() => {
    if (!uploading && userId && !campaignId.serverId) {
      setUploading(true);
      try {
        const newCampaignId = await dispatch(uploadCampaign(createCampaignActions, deckActions, campaignId));
        if (newCampaignId.type === 'single') {
          setCampaignServerId && setCampaignServerId(newCampaignId.id.serverId);
        } else {
          setCampaignLinkedServerId && setCampaignLinkedServerId(newCampaignId.ids);
        }
      } catch (e) {
        showAlert('Error', e.message);
      }
      setUploading(false);
    }
  }, [dispatch, setCampaignServerId, setCampaignLinkedServerId, setUploading, showAlert,
    createCampaignActions, userId, uploading, deckActions, campaignId]);

  const isOwner = !!(campaign?.owner_id && userId && campaignId.serverId && campaign.owner_id === userId);
  const editAccessPressed = useCallback(() => {
    if (campaignId.serverId) {
      navigation.navigate('Campaign.Access', {
        campaignId,
        isOwner,
      });
    }
  }, [navigation, campaignId, isOwner]);
  useEffect(() => {
    if (upload && campaign) {
      confirmUploadCampaign();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!userId) {
    return (
      <DeckButton
        icon="backup"
        title={standalone ? t`Upload standalone` : t`Upload campaign`}
        detail={t`Sign into Arkham Cards on the Settings tab to enable`}
        disabled
        thin
        color="light_gray"
        bottomMargin={s}
      />
    );
  }
  if (campaignId.serverId) {
    return (
      <DeckButton
        icon="lock"
        title={isOwner ? t`Edit players` : t`View players`}
        thin
        color="light_gray"
        onPress={editAccessPressed}
        bottomMargin={s}
      />
    );
  }
  return (
    <DeckButton
      icon="backup"
      title={standalone ? t`Upload standalone` : t`Upload campaign`}
      detail={!isConnected ? t`You must be online to upload` : undefined}
      disabled={!isConnected}
      thin
      color="light_gray"
      onPress={confirmUploadCampaign}
      loading={uploading}
      bottomMargin={s}
    />
  );
}

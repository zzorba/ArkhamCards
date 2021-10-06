import React, { useCallback, useContext, useRef, useState } from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '@reducers';
import { Action } from 'redux';
import { useDispatch } from 'react-redux';
import { Navigation } from 'react-native-navigation';
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
import { CampaignAccessProps } from './CampaignAccessView';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import { ENABLE_ARKHAM_CARDS_ACCOUNT } from '@app_constants';
import { useBackButton } from '@components/core/hooks';

interface Props {
  componentId: string;
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
}

type Dispatch = ThunkDispatch<AppState, unknown, Action<string>>;

export default function UploadCampaignButton({ componentId, campaign, campaignId, deckActions, standalone, setCampaignServerId, setCampaignLinkedServerId, showAlert }: Props) {
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
      Navigation.push<CampaignAccessProps>(componentId, {
        component: {
          name: 'Campaign.Access',
          passProps: {
            campaignId,
            isOwner,
          },
          options: {
            topBar: {
              title: {
                text: t`Access`,
              },
              backButton: {
                title: t`Back`,
              },
            },
          },
        },
      });
    }
  }, [componentId, campaignId, isOwner]);
  if (!userId) {
    if (!ENABLE_ARKHAM_CARDS_ACCOUNT) {
      return null;
    }
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

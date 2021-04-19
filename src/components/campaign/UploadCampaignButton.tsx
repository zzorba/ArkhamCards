import React, { useCallback, useContext, useState } from 'react';
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

interface Props {
  componentId: string;
  campaignId: CampaignId;
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

export default function UploadCampaignButton({ componentId, campaign, campaignId, deckActions, setCampaignServerId, setCampaignLinkedServerId, showAlert }: Props) {
  const { user } = useContext(ArkhamCardsAuthContext);
  const [{ isConnected }] = useNetworkStatus();
  const [uploading, setUploading] = useState(false);
  const dispatch: Dispatch = useDispatch();
  const createCampaignActions = useCreateCampaignActions();
  const confirmUploadCampaign = useCallback(async() => {
    if (!uploading && user && !campaignId.serverId) {
      setUploading(true);
      try {
        const newCampaignId = await dispatch(uploadCampaign(user, createCampaignActions, deckActions, campaignId));
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
    createCampaignActions, user, uploading, deckActions, campaignId]);

  const isOwner = !!(campaign?.owner_id && user && campaignId.serverId && campaign.owner_id === user.uid);
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
  if (!user) {
    return null;
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

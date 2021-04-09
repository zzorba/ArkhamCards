import React, { useCallback, useContext, useState } from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '@reducers';
import { Action } from 'redux';
import { useDispatch } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { CampaignId } from '@actions/types';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useCreateCampaignActions } from '@data/remote/campaigns';
import { uploadCampaign } from '@components/campaignguide/actions';
import useNetworkStatus from '@components/core/useNetworkStatus';
import DeckButton from '@components/deck/controls/DeckButton';
import { ShowAlert } from '@components/deck/dialogs';
import { s } from '@styles/space';
import { DeckActions } from '@data/remote/decks';
import { CampaignAccessProps } from './CampaignAccessView';

interface Props {
  componentId: string;
  campaignId: CampaignId;
  deckActions: DeckActions;
  setCampaignServerId: (serverId: number) => void;
  showAlert: ShowAlert;
  guided: boolean;
  linked?: {
    campaignIdA: CampaignId;
    campaignIdB: CampaignId;
  };
}

type Dispatch = ThunkDispatch<AppState, unknown, Action<string>>;

export default function UploadCampaignButton({ componentId, campaignId, deckActions, setCampaignServerId, showAlert }: Props) {
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
        setCampaignServerId(newCampaignId.serverId);
      } catch (e) {
        showAlert('Error', e.message);
      }
      setUploading(false);
    }
  }, [dispatch, setCampaignServerId, setUploading, showAlert,
    createCampaignActions, user, uploading, deckActions, campaignId]);

  const editAccessPressed = useCallback(() => {
    if (campaignId.serverId) {
      Navigation.push<CampaignAccessProps>(componentId, {
        component: {
          name: 'Campaign.Access',
          passProps: {
            campaignId,
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
  }, [componentId, campaignId]);
  if (!user) {
    return null;
  }
  if (campaignId.serverId) {
    return (
      <DeckButton
        icon="lock"
        title={t`Edit access`}
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

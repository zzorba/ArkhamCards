import React, { useCallback, useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { t } from 'ttag';

import { CampaignId } from '@actions/types';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useDispatch } from 'react-redux';
import { useCreateCampaignRequest } from '@data/firebase/api';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { uploadCampaign } from '@components/campaignguide/actions';
import useNetworkStatus from '@components/core/useNetworkStatus';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '@reducers';
import { Action } from 'redux';

interface Props {
  campaignId: CampaignId;
  setCampaignServerId: (serverId: string) => void;
}

type Dispatch = ThunkDispatch<AppState, unknown, Action<string>>;

export default function UploadCampaignButton({ campaignId, setCampaignServerId }: Props) {
  const { user } = useContext(ArkhamCardsAuthContext);
  const { colors } = useContext(StyleContext);
  const [{ isConnected }] = useNetworkStatus();
  const dispatch: Dispatch = useDispatch();
  const createServerCampaign = useCreateCampaignRequest();
  const confirmUploadCampaign = useCallback(async() => {
    if (user && !campaignId.serverId) {
      try {
        const newCampaignId = await dispatch(uploadCampaign(user, createServerCampaign, campaignId));
        setCampaignServerId(newCampaignId.serverId);
      } catch (e) {
        // TODO(error handling)
      }
    }
  }, [dispatch, createServerCampaign, setCampaignServerId, user, campaignId]);
  if (!user || campaignId.serverId) {
    return null;
  }
  return (
    <View style={space.marginRightS}>
      <TouchableOpacity onPress={confirmUploadCampaign} accessibilityLabel={t`Upload campaign`}>
        <View style={space.paddingXs}>
          <MaterialIcons name="backup" color={isConnected ? colors.L20 : colors.M} size={18} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

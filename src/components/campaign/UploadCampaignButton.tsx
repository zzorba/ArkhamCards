import React, { useCallback, useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Campaign } from '@actions/types';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useDispatch } from 'react-redux';
import { useCreateCampaignRequest } from '@data/firebase/api';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { uploadCampaign } from '@components/campaignguide/actions';
import useNetworkStatus from '@components/core/useNetworkStatus';

interface Props {
  campaign?: Campaign;
  setCampaignServerId: (serverId: string) => void;
}

export default function UploadCampaignButton({ campaign, setCampaignServerId }: Props) {
  const { user } = useContext(ArkhamCardsAuthContext);
  const { colors } = useContext(StyleContext);
  const [{ isConnected }] = useNetworkStatus();
  const dispatch = useDispatch();
  const createServerCampaign = useCreateCampaignRequest();
  const confirmUploadCampaign = useCallback(async() => {
    if (campaign && user) {
      try {
        dispatch(uploadCampaign(user, createServerCampaign, setCampaignServerId, campaign, !!campaign.guided));
      } catch (e) {
        // TODO(error handling)
      }
    }
  }, [dispatch, createServerCampaign, setCampaignServerId, user, campaign]);
  if (!user || campaign?.serverId) {
    return null;
  }
  return (
    <View style={space.marginRightS}>
      <TouchableOpacity onPress={confirmUploadCampaign}>
        <View style={space.paddingXs}>
          <MaterialIcons name="backup" color={isConnected ? colors.L20 : colors.M} size={18} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

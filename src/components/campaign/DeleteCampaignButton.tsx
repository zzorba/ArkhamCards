import React, { useCallback, useContext } from 'react';
import { Navigation } from 'react-native-navigation';
import { TouchableOpacity, View } from 'react-native';
import { t } from 'ttag';

import { CampaignId } from '@actions/types';
import { ShowAlert } from '@components/deck/dialogs';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useDispatch } from 'react-redux';
import { useDeleteCampaignRequest } from '@data/firebase/api';
import { deleteCampaign } from './actions';
import space from '@styles/space';
import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';

interface Props {
  componentId: string;
  campaignId: CampaignId;
  campaignName: string;
  showAlert: ShowAlert;
}

export default function DeleteCampaignButton({ componentId, campaignId, campaignName, showAlert }: Props) {
  const { user } = useContext(ArkhamCardsAuthContext);
  const { colors } = useContext(StyleContext);
  const dispatch = useDispatch();
  const deleteServerCampaign = useDeleteCampaignRequest();
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
  return (
    <TouchableOpacity onPress={confirmDeleteCampaign} accessibilityLabel={t`Delete`}>
      <View style={space.paddingXs}>
        <AppIcon name="dismiss" color={colors.warn} size={18} />
      </View>
    </TouchableOpacity>
  );
}

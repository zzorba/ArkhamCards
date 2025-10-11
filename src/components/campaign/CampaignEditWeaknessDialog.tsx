import React, { useCallback } from 'react';

import { useAppDispatch } from '@app/store';
import { CampaignId, Slots } from '@actions/types';
import EditAssignedWeaknessComponent from '../weakness/EditAssignedWeaknessComponent';
import { updateCampaignWeaknessSet } from './actions';
import { useCampaign } from '@data/hooks';
import { useDismissOnCampaignDeleted, useSetCampaignWeaknessSet } from '@data/remote/campaigns';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';

export interface CampaignEditWeaknessProps {
  campaignId: CampaignId;
}

function CampaignEditWeaknessDialog() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Dialog.CampaignEditWeakness'>>();
  const { campaignId } = route.params;
  const dispatch = useAppDispatch();
  const campaign = useCampaign(campaignId);
  const navigation = useNavigation();
  useDismissOnCampaignDeleted(navigation, campaign);

  const weaknessSet = campaign?.weaknessSet;
  const setCampaignWeaknessSet = useSetCampaignWeaknessSet();
  const updateAssignedCards = useCallback((assignedCards: Slots) => {
    if (weaknessSet) {
      const updatedWeaknessSet = {
        ...weaknessSet,
        assignedCards,
      };
      dispatch(updateCampaignWeaknessSet(
        setCampaignWeaknessSet,
        campaignId,
        updatedWeaknessSet
      ));
    }
  }, [dispatch, setCampaignWeaknessSet, campaignId, weaknessSet]);
  if (!weaknessSet) {
    return null;
  }
  return (
    <EditAssignedWeaknessComponent
      weaknessSet={weaknessSet}
      updateAssignedCards={updateAssignedCards}
    />
  );
}

export default CampaignEditWeaknessDialog;

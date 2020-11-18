import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { t } from 'ttag';
import { Campaign, Slots } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import EditAssignedWeaknessComponent from '../weakness/EditAssignedWeaknessComponent';
import { updateCampaign } from './actions';
import { getCampaign, AppState } from '@reducers';

export interface CampaignEditWeaknessProps {
  campaignId: number;
}

function CampaignEditWeaknessDialog({ componentId, campaignId }: CampaignEditWeaknessProps & NavigationProps) {
  const dispatch = useDispatch();
  const weaknessSelector = useCallback((state: AppState) => {
    const campaign = getCampaign(state, campaignId);
    return campaign && campaign.weaknessSet;
  }, [campaignId]);
  const weaknessSet = useSelector(weaknessSelector);
  const updateAssignedCards = useCallback((assignedCards: Slots) => {
    if (weaknessSet) {
      const updatedWeaknessSet = {
        ...weaknessSet,
        assignedCards,
      };
      dispatch(updateCampaign(
        campaignId,
        { weaknessSet: updatedWeaknessSet } as Campaign
      ));
    }
  }, [dispatch, campaignId, weaknessSet]);
  if (!weaknessSet) {
    return null;
  }
  return (
    <EditAssignedWeaknessComponent
      componentId={componentId}
      weaknessSet={weaknessSet}
      updateAssignedCards={updateAssignedCards}
    />
  );
}

CampaignEditWeaknessDialog.options = () => {
  return {
    topBar: {
      title: {
        text: t`Available weaknesses`,
      },
      backButton: {
        title: t`Back`,
      },
    },
  };
};

export default CampaignEditWeaknessDialog;

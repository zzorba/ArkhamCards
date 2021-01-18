import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { t } from 'ttag';
import { Campaign, Slots } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import EditAssignedWeaknessComponent from '../weakness/EditAssignedWeaknessComponent';
import { updateCampaign } from './actions';
import { AppState, makeCampaignSelector } from '@reducers';

export interface CampaignEditWeaknessProps {
  campaignId: string;
}

function CampaignEditWeaknessDialog({ componentId, campaignId }: CampaignEditWeaknessProps & NavigationProps) {
  const dispatch = useDispatch();
  const campaignSelector = useMemo(makeCampaignSelector, []);
  const campaign = useSelector((state: AppState) => campaignSelector(state, campaignId));
  const weaknessSet = campaign && campaign.weaknessSet;
  const serverId = campaign?.serverId;
  const updateAssignedCards = useCallback((assignedCards: Slots) => {
    if (weaknessSet) {
      const updatedWeaknessSet = {
        ...weaknessSet,
        assignedCards,
      };
      dispatch(updateCampaign(
        {
          campaignId,
          serverId,
        },
        { weaknessSet: updatedWeaknessSet } as Campaign
      ));
    }
  }, [dispatch, campaignId, serverId, weaknessSet]);
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

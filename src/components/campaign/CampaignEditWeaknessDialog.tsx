import React, { useCallback } from 'react';

import { t } from 'ttag';
import { useAppDispatch } from '@app/store';
import { CampaignId, Slots } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import EditAssignedWeaknessComponent from '../weakness/EditAssignedWeaknessComponent';
import { updateCampaignWeaknessSet } from './actions';
import { useCampaign } from '@data/hooks';
import { useSetCampaignWeaknessSet } from '@data/remote/campaigns';

export interface CampaignEditWeaknessProps {
  campaignId: CampaignId;
}

function CampaignEditWeaknessDialog({ componentId, campaignId }: CampaignEditWeaknessProps & NavigationProps) {
  const dispatch = useAppDispatch();
  const campaign = useCampaign(campaignId);
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

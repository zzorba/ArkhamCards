import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';

import { t } from 'ttag';
import { Campaign, CampaignId, Slots } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import EditAssignedWeaknessComponent from '../weakness/EditAssignedWeaknessComponent';
import { updateCampaign } from './actions';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useCampaign } from '@data/remote/hooks';

export interface CampaignEditWeaknessProps {
  campaignId: CampaignId;
}

function CampaignEditWeaknessDialog({ componentId, campaignId }: CampaignEditWeaknessProps & NavigationProps) {
  const dispatch = useDispatch();
  const { user } = useContext(ArkhamCardsAuthContext);
  const campaign = useCampaign(campaignId);
  const weaknessSet = campaign && campaign.weaknessSet;
  const updateAssignedCards = useCallback((assignedCards: Slots) => {
    if (weaknessSet) {
      const updatedWeaknessSet = {
        ...weaknessSet,
        assignedCards,
      };
      dispatch(updateCampaign(
        user,
        campaignId,
        { weaknessSet: updatedWeaknessSet }
      ));
    }
  }, [dispatch, campaignId, user, weaknessSet]);
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

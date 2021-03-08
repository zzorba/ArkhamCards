import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';

import { t } from 'ttag';
import { CampaignId, Slots } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import EditAssignedWeaknessComponent from '../weakness/EditAssignedWeaknessComponent';
import { updateCampaignWeaknessSet } from './actions';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useCampaign } from '@data/hooks';
import { useSetCampaignWeaknessSet } from '@data/remote/campaigns';

export interface CampaignEditWeaknessProps {
  campaignId: CampaignId;
}

function CampaignEditWeaknessDialog({ componentId, campaignId }: CampaignEditWeaknessProps & NavigationProps) {
  const dispatch = useDispatch();
  const { user } = useContext(ArkhamCardsAuthContext);
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
  }, [dispatch, setCampaignWeaknessSet, campaignId, user, weaknessSet]);
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

import React, { useCallback } from 'react';

import { CUSTOM } from '@actions/types';
import MiniCampaignSummaryComponent from '../MiniCampaignSummaryComponent';
import CampaignInvestigatorRow from '../CampaignInvestigatorRow';
import GenericCampaignItem from './GenericCampaignItem';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';

interface Props {
  campaign: MiniCampaignT;
  onPress: (id: string, campaign: MiniCampaignT) => void;
}

export default function CampaignItem({ campaign, onPress }: Props) {
  const handleOnPress = useCallback(() => {
    onPress(campaign.uuid(), campaign);
  }, [onPress, campaign]);
  return (
    <GenericCampaignItem
      lastUpdated={campaign.updatedAt()}
      onPress={handleOnPress}
    >
      <MiniCampaignSummaryComponent
        campaign={campaign}
        name={campaign.cycleCode() !== CUSTOM ? campaign.name() : undefined}
      >
        <CampaignInvestigatorRow campaign={campaign} />
      </MiniCampaignSummaryComponent>
    </GenericCampaignItem>
  );
}
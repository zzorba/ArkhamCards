import React, { useCallback } from 'react';

import { Campaign, CUSTOM } from '@actions/types';
import MiniCampaignSummaryComponent from '../MiniCampaignSummaryComponent';
import CampaignInvestigatorRow from '../CampaignInvestigatorRow';

import GenericCampaignItem from './GenericCampaignItem';
import { MiniCampaignT } from '@data/interfaces/MiniCampaignT';

interface Props {
  campaign: MiniCampaignT;
  scenarioName: string;
  onPress: (id: string, campaign: MiniCampaignT) => void;
}

export default function StandaloneItem({ campaign, onPress, scenarioName }: Props) {
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
        standaloneName={scenarioName}
        hideScenario
      >
        <CampaignInvestigatorRow campaign={campaign} />
      </MiniCampaignSummaryComponent>
    </GenericCampaignItem>
  );
}


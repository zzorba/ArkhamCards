import React, { useCallback } from 'react';

import { Campaign, CUSTOM } from '@actions/types';
import CampaignSummaryComponent from '../CampaignSummaryComponent';
import CampaignInvestigatorRow from '../CampaignInvestigatorRow';

import GenericCampaignItem from './GenericCampaignItem';

interface Props {
  campaign: Campaign;
  scenarioName: string;
  onPress: (id: number, campaign: Campaign) => void;
}

export default function StandaloneItem({ campaign, onPress, scenarioName }: Props) {
  const handleOnPress = useCallback(() => {
    onPress(campaign.id, campaign);
  }, [onPress, campaign]);
  return (
    <GenericCampaignItem
      campaign={campaign}
      onPress={handleOnPress}
    >
      <CampaignSummaryComponent
        campaign={campaign}
        name={campaign.cycleCode !== CUSTOM ? campaign.name : undefined}
        standaloneName={scenarioName}
        hideScenario
      >
        <CampaignInvestigatorRow
          campaigns={[campaign]}
        />
      </CampaignSummaryComponent>
    </GenericCampaignItem>
  );
}


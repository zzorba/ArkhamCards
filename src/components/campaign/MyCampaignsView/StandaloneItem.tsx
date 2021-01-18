import React, { useCallback } from 'react';

import { Campaign, CUSTOM } from '@actions/types';
import CampaignSummaryComponent from '../CampaignSummaryComponent';
import CampaignInvestigatorRow from '../CampaignInvestigatorRow';

import GenericCampaignItem from './GenericCampaignItem';

interface Props {
  campaign: Campaign;
  scenarioName: string;
  onPress: (id: string, campaign: Campaign) => void;
}

export default function StandaloneItem({ campaign, onPress, scenarioName }: Props) {
  const handleOnPress = useCallback(() => {
    onPress(campaign.uuid, campaign);
  }, [onPress, campaign]);
  return (
    <GenericCampaignItem
      lastUpdated={campaign.lastUpdated}
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


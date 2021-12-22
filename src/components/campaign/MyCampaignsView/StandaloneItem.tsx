import React, { useCallback } from 'react';
import { CUSTOM } from '@actions/types';
import CampaignInvestigatorRow from '../CampaignInvestigatorRow';

import GenericCampaignItem from './GenericCampaignItem';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import CampaignItemHeader from './CampaignItemHeader';

interface Props {
  campaign: MiniCampaignT;
  scenarioName: string;
  onPress: (id: string, campaign: MiniCampaignT) => void;
}

function computeHeight(fontScale: number) {
  return GenericCampaignItem.computeHeight(fontScale) + CampaignItemHeader.computeHeight(true, fontScale);
}

function StandaloneItem({ campaign, onPress, scenarioName }: Props) {
  const handleOnPress = useCallback(() => {
    onPress(campaign.uuid, campaign);
  }, [onPress, campaign]);
  return (
    <GenericCampaignItem
      campaign={campaign}
      lastUpdated={campaign.updatedAt}
      onPress={handleOnPress}
    >
      <CampaignItemHeader
        campaign={campaign}
        investigators={<CampaignInvestigatorRow campaign={campaign} />}
        standaloneName={scenarioName}
        hideScenario
        name={campaign.cycleCode !== CUSTOM ? campaign.name : undefined}
      />
    </GenericCampaignItem>
  );
}

StandaloneItem.computeHeight = computeHeight;
export default StandaloneItem;

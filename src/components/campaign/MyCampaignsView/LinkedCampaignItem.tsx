import React, { useCallback, useMemo } from 'react';
import { max } from 'lodash';

import { Campaign, CUSTOM, getCampaignId } from '@actions/types';
import CampaignSummaryComponent from '../CampaignSummaryComponent';
import CampaignInvestigatorRow from '../CampaignInvestigatorRow';
import { useCampaign } from '@components/core/hooks';
import GenericCampaignItem from './GenericCampaignItem';

interface Props {
  campaign: Campaign;
  onPress: (id: string, campaign: Campaign) => void;
}

function getTime(date: Date | string) {
  if (typeof date === 'string') {
    return Date.parse(date);
  }
  return date.getTime();
}

export default function LinkedCampaignItem({ campaign, onPress }: Props) {
  const campaignId = getCampaignId(campaign);
  const [campaignIdA, campaignIdB] = useMemo(() => {
    return [
      campaign.linkUuid ? { campaignId: campaign.linkUuid.campaignIdA, serverId: campaignId.serverId } : undefined,
      campaign.linkUuid ? { campaignId: campaign.linkUuid.campaignIdB, serverId: campaignId.serverId } : undefined,
    ];
  }, [campaign.linkUuid, campaignId.serverId]);
  const campaignA = useCampaign(campaignIdA);
  const campaignB = useCampaign(campaignIdB);

  const onCampaignPress = useCallback(() => {
    onPress(campaign.uuid, campaign);
  }, [campaign, onPress]);

  const lastUpdated = useMemo(() => {
    const dates = [
      getTime(campaign.lastUpdated),
    ];
    if (campaignA) {
      dates.push(getTime(campaignA.lastUpdated));
    }
    if (campaignB) {
      dates.push(getTime(campaignB.lastUpdated));
    }
    const latest = max(dates);
    if (latest) {
      return new Date(latest);
    }
    return campaign.lastUpdated;
  }, [campaign.lastUpdated, campaignA, campaignB]);

  return (
    <GenericCampaignItem
      lastUpdated={lastUpdated}
      onPress={onCampaignPress}
    >
      <CampaignSummaryComponent
        campaign={campaign}
        hideScenario
        name={campaign.cycleCode !== CUSTOM ? campaign.name : undefined}
      >
        { !!campaignA && !!campaignB && (
          <CampaignInvestigatorRow
            campaigns={[campaignA, campaignB]}
          />
        ) }
      </CampaignSummaryComponent>
    </GenericCampaignItem>
  );
}

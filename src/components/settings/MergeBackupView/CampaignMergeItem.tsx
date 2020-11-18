import React, { useCallback } from 'react';

import SettingsSwitch from '@components/core/SettingsSwitch';
import { campaignName } from '@components/campaign/constants';
import { Campaign } from '@actions/types';

interface Props {
  campaign: Campaign;
  value: boolean;
  inverted: boolean;
  onValueChange: (campaign: Campaign, value: boolean) => void;
}

export default function CampaignMergeItem({ campaign, value, inverted, onValueChange }: Props) {
  const handleOnValueChange = useCallback((value: boolean) => {
    onValueChange(campaign, inverted ? !value : value);
  }, [campaign, inverted, onValueChange]);

  return (
    <SettingsSwitch
      title={campaign.name}
      description={campaignName(campaign.cycleCode) || undefined}
      value={inverted ? !value : value}
      onValueChange={handleOnValueChange}
    />
  );
}
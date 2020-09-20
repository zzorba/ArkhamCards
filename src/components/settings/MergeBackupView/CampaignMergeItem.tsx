import React from 'react';

import SettingsSwitch from '@components/core/SettingsSwitch';
import { campaignName } from '@components/campaign/constants';
import { Campaign } from '@actions/types';

interface Props {
  campaign: Campaign;
  value: boolean;
  inverted: boolean;
  onValueChange: (campaign: Campaign, value: boolean) => void;
}

export default class CampaignMergeItem extends React.Component<Props> {
  _onValueChange = (value: boolean) => {
    const { campaign, inverted, onValueChange } = this.props;
    onValueChange(campaign, inverted ? !value : value);
  };

  render() {
    const { campaign, inverted, value } = this.props;
    return (
      <SettingsSwitch
        title={campaign.name}
        description={campaignName(campaign.cycleCode) || undefined}
        value={inverted ? !value : value}
        onValueChange={this._onValueChange}
      />
    );
  }
}
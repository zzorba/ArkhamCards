import React, { useCallback, useContext } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Campaign, CUSTOM } from '@actions/types';
import CampaignSummaryComponent from '../CampaignSummaryComponent';
import CampaignInvestigatorRow from '../CampaignInvestigatorRow';
import { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCampaign } from '@components/core/hooks';

interface Props {
  campaign: Campaign;
  onPress: (id: number, campaign: Campaign) => void;
}

export default function LinkedCampaignItem({ campaign, onPress }: Props) {
  const { borderStyle } = useContext(StyleContext);
  const campaignA = useCampaign(campaign.link ? campaign.link.campaignIdA : undefined);
  const campaignB = useCampaign(campaign.link ? campaign.link.campaignIdB : undefined);

  const onCampaignPress = useCallback(() => {
    onPress(campaign.id, campaign);
  }, [campaign, onPress]);

  return (
    <TouchableOpacity onPress={onCampaignPress}>
      <View style={[styles.container, borderStyle]}>
        <CampaignSummaryComponent
          campaign={campaign}
          hideScenario
          name={campaign.cycleCode !== CUSTOM ? campaign.name : undefined}
        />
        { !!campaignA && !!campaignB && (
          <CampaignInvestigatorRow
            campaigns={[campaignA, campaignB]}
          />
        ) }
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: m,
    paddingRight: s,
    paddingTop: s,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    position: 'relative',
  },
});

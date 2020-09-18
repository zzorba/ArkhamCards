import React, { useContext } from 'react';
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

interface Props {
  campaign: Campaign;
  onPress: (id: number, campaign: Campaign) => void;
}

export default function CampaignItem({ campaign, onPress }: Props) {
  const { borderStyle } = useContext(StyleContext);
  const handleOnPress = () => {
    onPress(campaign.id, campaign);
  };

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <View style={[styles.container, borderStyle]}>
        <CampaignSummaryComponent
          campaign={campaign}
          name={campaign.cycleCode !== CUSTOM ? campaign.name : undefined}
        />
        <CampaignInvestigatorRow
          campaigns={[campaign]}
        />
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

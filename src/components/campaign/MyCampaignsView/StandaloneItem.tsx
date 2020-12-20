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
import { usePressCallback } from '@components/core/hooks';

interface Props {
  campaign: Campaign;
  scenarioName: string;
  onPress: (id: number, campaign: Campaign) => void;
}

export default function StandaloneItem({ campaign, onPress, scenarioName }: Props) {
  const { borderStyle } = useContext(StyleContext);
  const handleOnPress = useCallback(() => {
    onPress(campaign.id, campaign);
  }, [onPress, campaign]);
  const debouncedOnPress = usePressCallback(handleOnPress);

  return (
    <TouchableOpacity onPress={debouncedOnPress}>
      <View style={[styles.container, borderStyle]}>
        <CampaignSummaryComponent
          campaign={campaign}
          name={campaign.cycleCode !== CUSTOM ? campaign.name : undefined}
          standaloneName={scenarioName}
          hideScenario
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

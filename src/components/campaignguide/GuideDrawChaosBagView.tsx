import React, { Component, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';

import DrawChaosBagComponent from '@components/campaign/DrawChaosBagComponent';
import { ChaosBag } from '@app_constants';
import { CampaignId } from '@actions/types';
import { showGuideChaosBagOddsCalculator } from '@components/campaign/nav';
import { NavigationProps } from '@components/nav/types';
import { useSimpleChaosBagDialog } from '@components/campaign/CampaignDetailView/useChaosBagDialog';

export interface GuideDrawChaosBagProps {
  campaignId: CampaignId;
  chaosBag: ChaosBag;
  investigatorIds: string[];
}

export default function GuideDrawChaosBagView({ componentId, campaignId, chaosBag, investigatorIds }: GuideDrawChaosBagProps & NavigationProps) {
  const [dialog, showDialog] = useSimpleChaosBagDialog(chaosBag);
  const showOdds = useCallback(() => {
    showGuideChaosBagOddsCalculator(componentId, campaignId, chaosBag, investigatorIds);
  }, [componentId, campaignId, chaosBag, investigatorIds]);
  return (
    <View style={styles.container}>
      <DrawChaosBagComponent
        campaignId={campaignId}
        chaosBag={chaosBag}
        viewChaosBagOdds={showOdds}
        editViewPressed={showDialog}
      />
      { dialog }
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});
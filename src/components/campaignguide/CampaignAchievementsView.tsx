import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { map } from 'lodash';

import StyleContext from '@styles/StyleContext';
import { CampaignId } from '@actions/types';
import withCampaignGuideContext from './withCampaignGuideContext';
import CampaignGuideContext from './CampaignGuideContext';
import AchievementComponent from './CampaignLogComponent/AchievementComponent';
import space from '@styles/space';

export interface CampaignAchievementsProps {
  campaignId: CampaignId;
}

function CampaignAchievementsView() {
  const { backgroundStyle } = useContext(StyleContext);
  const { campaignGuide } = useContext(CampaignGuideContext);
  const achievements = campaignGuide.achievements();
  return (
    <SafeAreaView style={[styles.wrapper, backgroundStyle]}>
      <ScrollView contentContainerStyle={[backgroundStyle, space.paddingLeftM, space.paddingRightS]}>
        { map(achievements, (a, idx) => <AchievementComponent key={idx} achievement={a} />) }
      </ScrollView>
    </SafeAreaView>
  );
}

export default withCampaignGuideContext(CampaignAchievementsView, { rootView: false });

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

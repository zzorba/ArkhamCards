import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { map } from 'lodash';

import StyleContext from '@styles/StyleContext';
import { CampaignId } from '@actions/types';
import withCampaignGuideContext from './withCampaignGuideContext';
import CampaignGuideContext from './CampaignGuideContext';
import AchievementComponent from './CampaignLogComponent/AchievementComponent';
import space from '@styles/space';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';
import { useDismissOnCampaignDeleted } from '@data/remote/campaigns';

export interface CampaignAchievementsProps {
  campaignId: CampaignId;
}

function CampaignAchievementsView() {
  const { backgroundStyle } = useContext(StyleContext);
  const { campaignGuide, campaign } = useContext(CampaignGuideContext);
  const achievements = campaignGuide.achievements();
  const navigation = useNavigation();
  useDismissOnCampaignDeleted(navigation, campaign);

  return (
    <SafeAreaView style={[styles.wrapper, backgroundStyle]}>
      <ScrollView contentContainerStyle={[backgroundStyle, space.paddingLeftM, space.paddingRightS]}>
        { map(achievements, (a, idx) => <AchievementComponent key={idx} achievement={a} />) }
      </ScrollView>
    </SafeAreaView>
  );
}

const WrappedComponent = withCampaignGuideContext(CampaignAchievementsView, { rootView: false });

export default function CampaignAchievementsWrapper() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Guide.Achievements'>>();
  const { campaignId } = route.params;
  return <WrappedComponent campaignId={campaignId} />;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

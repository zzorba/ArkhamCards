import React, { useCallback, useContext } from 'react';

import { CampaignId } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { useCampaign, useCampaignDetails, useInvestigatorCards } from '@components/core/hooks';
import { ScrollView, StyleSheet, View } from 'react-native';
import StyleContext from '@styles/StyleContext';
import ChaosBagSection from './CampaignDetailView/ChaosBagSection';
import { ChaosBag } from '@app_constants';
import { useDispatch } from 'react-redux';
import { showChaosBagOddsCalculator, showDrawChaosBag } from '@components/campaign/nav';
import { updateCampaign } from './actions';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';

export interface CampaignChaosBagProps {
  campaignId: CampaignId;
}

export default function CampaignChaosBagView({ campaignId, componentId }: CampaignChaosBagProps & NavigationProps) {
  const campaign = useCampaign(campaignId);
  const investigators = useInvestigatorCards();
  const [, allInvestigators] = useCampaignDetails(campaign, investigators);
  const { user } = useContext(ArkhamCardsAuthContext);
  const dispatch = useDispatch();
  const { backgroundStyle } = useContext(StyleContext);
  const updateChaosBag = useCallback((chaosBag: ChaosBag) => {
    dispatch(updateCampaign(user, campaignId, { chaosBag }));
  }, [dispatch, campaignId, user]);
  const oddsCalculatorPressed = useCallback(() => {
    showChaosBagOddsCalculator(componentId, campaignId, allInvestigators);
  }, [componentId, campaignId, allInvestigators]);

  const drawChaosBagPressed = useCallback(() => {
    showDrawChaosBag(componentId, campaignId, updateChaosBag);
  }, [campaignId, componentId, updateChaosBag]);

  if (!campaign) {
    return <LoadingSpinner />;
  }
  return (
    <View style={[styles.flex, backgroundStyle]}>
      <ScrollView contentContainerStyle={backgroundStyle}>
        <ChaosBagSection
          componentId={componentId}
          updateChaosBag={updateChaosBag}
          chaosBag={campaign.chaosBag}
          showChaosBag={drawChaosBagPressed}
          showOddsCalculator={oddsCalculatorPressed}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

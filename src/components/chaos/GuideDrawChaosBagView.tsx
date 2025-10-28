import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import DrawChaosBagComponent from './DrawChaosBagComponent';
import { showGuideChaosBagOddsCalculator } from '@components/campaign/nav';
import { useSimpleChaosBagDialog } from '@components/campaign/CampaignDetailView/useChaosBagDialog';

import useGuideChaosBag from '../campaignguide/useGuideChaosBag';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { useChaosBagResults } from '@data/hooks';
import withCampaignGuideContext, { CampaignGuideInputProps } from '@components/campaignguide/withCampaignGuideContext';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import useProcessedCampaign from '@components/campaignguide/useProcessedCampaign';
import { t } from 'ttag';
import COLORS from '@styles/colors';
import LanguageContext from '@lib/i18n/LanguageContext';
import { showRules } from '@components/campaignguide/nav';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';
import HeaderTitle from '@components/core/HeaderTitle';
import HeaderButton from '@components/core/HeaderButton';

export interface GuideDrawChaosBagProps extends CampaignGuideInputProps {
  scenarioId?: string;
  standalone?: boolean;
  investigatorIds: string[];
}

function GuideDrawChaosBagView() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Guide.DrawChaosBag'>>();
  const { campaignId, scenarioId, standalone, investigatorIds } = route.params;
  const navigation = useNavigation();
  const { lang } = useContext(LanguageContext);
  const campaignData = useContext(CampaignGuideContext);
  const { campaignGuide, campaignState } = campaignData;
  const [processedCampaign] = useProcessedCampaign(campaignGuide, campaignState);
  const chaosBag = processedCampaign?.campaignLog.chaosBag;

  const rules = useMemo(() => campaignGuide.scenarioRules(lang, scenarioId), [lang, scenarioId, campaignGuide]);
  const [campaignErrata, scenarioErrata] = useMemo(() => [
    campaignGuide.campaignFaq(),
    scenarioId ? campaignGuide.scenarioFaq(scenarioId) : [],
  ], [campaignGuide, scenarioId]);

  const chaosBagResults = useChaosBagResults(campaignId);

  const { loading, scenarioCard, scenarioCardText, difficulty, liveChaosBag } = useGuideChaosBag({
    campaignId,
    scenarioId,
    standalone,
    processedCampaign,
    difficultyOverride: chaosBagResults.difficulty,
  });
  const onRulesPressed = useCallback(() => {
    showRules(navigation, campaignId, {
      rules,
      campaignErrata,
      scenarioErrata,
      scenarioId,
    });
  }, [navigation, campaignId, rules, campaignErrata, scenarioErrata, scenarioId]);
  useEffect(() => {
    if (scenarioCard) {
      navigation.setOptions({
        headerTitle: () => (
          <HeaderTitle title={t`Chaos Bag`} subtitle={scenarioCard.name} color={COLORS.M} />
        ),
        headerRight: () => rules.length || campaignErrata.length || scenarioErrata.length ? (
          <HeaderButton
            iconName="book"
            accessibilityLabel={t`Rules`}
            color={COLORS.M}
            onPress={onRulesPressed}
          />
        ) : undefined,
      });
    }
  }, [navigation, onRulesPressed, scenarioCard, campaignErrata, scenarioErrata, rules]);
  const theChaosBag = liveChaosBag || chaosBag;
  const [dialog, showDialog] = useSimpleChaosBagDialog(chaosBag, chaosBagResults);
  const showOdds = useCallback(() => {
    if (theChaosBag) {
      showGuideChaosBagOddsCalculator(navigation, campaignId, theChaosBag, investigatorIds, scenarioId, standalone, processedCampaign);
    }
  }, [navigation, campaignId, theChaosBag, investigatorIds, scenarioId, standalone, processedCampaign]);
  if (loading || !theChaosBag) {
    return <LoadingSpinner />
  }
  return (
    <View style={styles.container}>
      <DrawChaosBagComponent
        campaignId={campaignId}
        chaosBag={theChaosBag}
        chaosBagResults={chaosBagResults}
        viewChaosBagOdds={showOdds}
        editViewPressed={showDialog}
        scenarioCardText={scenarioCardText}
        difficulty={difficulty}
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

const WrappedComponent = withCampaignGuideContext<GuideDrawChaosBagProps>(GuideDrawChaosBagView, { rootView: false });

export default function GuideDrawChaosBagWrapper() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Guide.DrawChaosBag'>>();
  const {
    scenarioId,
    standalone,
    investigatorIds,
    campaignId,
  } = route.params;
  return (
    <WrappedComponent
      scenarioId={scenarioId}
      standalone={standalone}
      investigatorIds={investigatorIds}
      campaignId={campaignId}
    />
  );
}

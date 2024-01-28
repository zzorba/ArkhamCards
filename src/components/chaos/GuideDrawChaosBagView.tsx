import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import DrawChaosBagComponent from './DrawChaosBagComponent';
import { showGuideChaosBagOddsCalculator } from '@components/campaign/nav';
import { NavigationProps } from '@components/nav/types';
import { useSimpleChaosBagDialog } from '@components/campaign/CampaignDetailView/useChaosBagDialog';
import { Navigation } from 'react-native-navigation';
import useGuideChaosBag from '../campaignguide/useGuideChaosBag';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { useChaosBagResults } from '@data/hooks';
import withCampaignGuideContext, { InjectedCampaignGuideContextProps } from '@components/campaignguide/withCampaignGuideContext';
import { CampaignGuideInputProps } from '@components/campaignguide/withCampaignGuideContext';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import useProcessedCampaign from '@components/campaignguide/useProcessedCampaign';
import { t } from 'ttag';
import { iconsMap } from '@app/NavIcons';
import COLORS from '@styles/colors';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useNavigationButtonPressed } from '@components/core/hooks';
import { showRules } from '@components/campaignguide/nav';
export interface GuideDrawChaosBagProps extends CampaignGuideInputProps {
  scenarioId?: string;
  standalone?: boolean;
  investigatorIds: string[];
}

type Props = GuideDrawChaosBagProps & InjectedCampaignGuideContextProps;

function GuideDrawChaosBagView({ componentId, campaignId, scenarioId, standalone, investigatorIds }: Props & NavigationProps) {
  const { lang } = useContext(LanguageContext);
  const campaignData = useContext(CampaignGuideContext);
  const { campaignGuide, campaignState } = campaignData;
  const [processedCampaign] = useProcessedCampaign(campaignGuide, campaignState);
  const chaosBag = processedCampaign?.campaignLog.chaosBag;

  const rules = useMemo(() => campaignGuide.scenarioRules(lang, scenarioId), [lang, scenarioId, campaignGuide]);
  const [campaignErrata, scenarioErrata] = useMemo(() => [
    campaignGuide.campaignFaq(),
    scenarioId ? campaignGuide.scenarioFaq(scenarioId) : []
  ], [campaignGuide, scenarioId]);

  const [loading, scenarioCard, scenarioCardText, difficulty, liveChaosBag] = useGuideChaosBag({ campaignId, scenarioId, standalone, processedCampaign });

  useEffect(() => {
    if (scenarioCard) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          subtitle: {
            text: scenarioCard.name,
          },
          rightButtons: rules.length || campaignErrata.length || scenarioErrata.length ? [
            {
              icon: iconsMap.book,
              id: 'rules',
              color: COLORS.M,
              accessibilityLabel: t`Rules`,
            },
          ] : [],
        },
      });
    }
  }, [scenarioCard, campaignErrata, scenarioErrata, rules, componentId]);

  useNavigationButtonPressed(
    (event) => {
      if (event.buttonId === 'rules') {
        showRules(componentId, campaignId, {
          rules,
          campaignErrata,
          scenarioErrata,
          scenarioId,
        });
      }
    },
    componentId,
    [rules, campaignErrata, scenarioErrata, scenarioId]
  );
  const theChaosBag = liveChaosBag || chaosBag;
  const chaosBagResults = useChaosBagResults(campaignId);
  const [dialog, showDialog] = useSimpleChaosBagDialog(chaosBag, chaosBagResults);
  const showOdds = useCallback(() => {
    if (theChaosBag) {
      showGuideChaosBagOddsCalculator(componentId, campaignId, theChaosBag, investigatorIds, scenarioId, standalone, processedCampaign);
    }
  }, [componentId, campaignId, theChaosBag, investigatorIds, scenarioId, standalone, processedCampaign]);
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

GuideDrawChaosBagView.options = () => {
  return {
    topBar: {
      title: {
        text: t`Chaos Bag`,
      },
      backButton: {
        title: t`Back`,
      },
    },
  };
};

export default withCampaignGuideContext<GuideDrawChaosBagProps & NavigationProps>(GuideDrawChaosBagView, { rootView: false });

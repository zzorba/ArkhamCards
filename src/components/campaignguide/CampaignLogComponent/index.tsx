import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { flatMap, map, keys, sum, values } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { GuideChaosBagProps } from '@components/campaignguide/GuideChaosBagView';
import { GuideOddsCalculatorProps } from '@components/campaignguide/GuideOddsCalculatorView';
import ChaosBagLine from '@components/core/ChaosBagLine';
import CampaignLogSuppliesComponent from './CampaignLogSuppliesComponent';
import CampaignLogSectionComponent from './CampaignLogSectionComponent';
import CampaignGuide from '@data/scenario/CampaignGuide';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import space, { s, m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import AchievementComponent from './AchievementComponent';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import DeckBubbleHeader from '@components/deck/section/DeckBubbleHeader';
import DeckButton from '@components/deck/controls/DeckButton';
import { CampaignId } from '@actions/types';

interface Props {
  componentId: string;
  campaignId: CampaignId;
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;
  standalone?: boolean;
  header?: React.ReactNode;
  hideAchievements?: boolean;
  hideChaosBag?: boolean;
}

export default function CampaignLogComponent({ componentId, campaignId, campaignGuide, campaignLog, standalone, header, hideAchievements, hideChaosBag }: Props) {
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const renderLogEntrySectionContent = useCallback((id: string, title: string, type?: 'count' | 'supplies') => {
    switch (type) {
      case 'count': {
        const count = campaignLog.count(id, '$count');
        return (
          <View style={space.paddingSideS}>
            <DeckBubbleHeader inverted title={`${title}: ${count}`} />
          </View>
        );
      }
      case 'supplies': {
        const section = campaignLog.investigatorSections[id];
        return (
          <View style={[space.paddingSideS, space.paddingBottomM]}>
            <DeckBubbleHeader title={title} />
            { !!section && (
              <CampaignLogSuppliesComponent
                sectionId={id}
                section={section}
                campaignGuide={campaignGuide}
              />
            ) }
          </View>
        );
      }
      default: {
        const section = campaignLog.sections[id];
        return (
          <View style={[space.paddingSideS, space.paddingBottomS]}>
            <DeckBubbleHeader title={title} crossedOut={section && section.sectionCrossedOut} />
            { !!section && (
              <View style={[space.paddingTopS, space.paddingSideS]}>
                <CampaignLogSectionComponent
                  sectionId={id}
                  campaignGuide={campaignGuide}
                  section={section}
                />
              </View>
            ) }
          </View>
        );
      }
    }
  }, [campaignLog, campaignGuide]);

  const oddsCalculatorPressed = useCallback(() => {
    Navigation.push<GuideOddsCalculatorProps>(componentId, {
      component: {
        name: 'Guide.OddsCalculator',
        passProps: {
          campaignId,
          investigatorIds: campaignLog.investigatorCodesSafe(),
          chaosBag: campaignLog.chaosBag,
        },
        options: {
          topBar: {
            title: {
              text: t`Odds Calculator`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId, campaignId, campaignLog]);

  const chaosBagSimulatorPressed = useCallback(() => {
    Navigation.push<GuideChaosBagProps>(componentId, {
      component: {
        name: 'Guide.DrawChaosBag',
        passProps: {
          campaignId,
          chaosBag: campaignLog.chaosBag,
        },
        options: {
          topBar: {
            title: {
              text: t`Chaos Bag`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId, campaignId, campaignLog]);

  const chaosBagSection = useMemo(() => {
    if (hideChaosBag) {
      return null;
    }
    if (!keys(campaignLog.chaosBag).length && !standalone) {
      return null;
    }
    const tokenCount = sum(values(campaignLog.chaosBag));
    return (
      <View style={[space.paddingSideS, space.paddingBottomM]}>
        <DeckBubbleHeader title={t`Chaos Bag (${tokenCount})`} />
        <View style={space.paddingSideS}>
          <ChaosBagLine
            chaosBag={campaignLog.chaosBag}
          />
          <DeckButton
            thin
            icon="chaos_bag"
            title={t`Draw chaos tokens`}
            onPress={chaosBagSimulatorPressed}
            topMargin={s}
            bottomMargin={m}
          />
          <DeckButton
            thin
            icon="difficulty"
            title={t`Odds calculator`}
            onPress={oddsCalculatorPressed}
          />
        </View>
      </View>
    );
  }, [campaignLog, chaosBagSimulatorPressed, oddsCalculatorPressed, hideChaosBag, standalone]);
  const achievementsSection = useMemo(() => {
    if (hideAchievements) {
      return null;
    }
    const achievements = campaignGuide.achievements();
    if (!achievements.length) {
      return null;
    }
    return (
      <View style={[space.paddingSideS, space.paddingBottomM]}>
        <RoundedFactionBlock
          header={
            <View style={[space.paddingTopS, space.paddingBottomS, space.marginBottomS, styles.header, { backgroundColor: colors.L20 }]}>
              <Text style={[typography.bigGameFont, typography.center]}>
                { t`Achievements` }
              </Text>
            </View>
          }
          faction="neutral"
        >
          { map(achievements, (a, idx) => <AchievementComponent key={idx} achievement={a} />) }
        </RoundedFactionBlock>
      </View>
    );
  }, [campaignGuide, colors, typography, hideAchievements]);
  return (
    <View style={backgroundStyle}>
      <View style={[space.paddingSideS, space.paddingBottomM]}>
        <RoundedFactionBlock
          header={header}
          faction="neutral"
          noSpace
        >
          { chaosBagSection }
          { flatMap(campaignGuide.campaignLogSections(), log => {
            if (log.type === 'hidden') {
              return null;
            }
            return (
              <View key={log.id}>
                { renderLogEntrySectionContent(log.id, log.title, log.type) }
              </View>
            );
          }) }
        </RoundedFactionBlock>
      </View>
      { achievementsSection }
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

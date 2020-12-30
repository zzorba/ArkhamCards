import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { flatMap, map, keys, sum, values } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { GuideChaosBagProps } from '@components/campaignguide/GuideChaosBagView';
import { GuideOddsCalculatorProps } from '@components/campaignguide/GuideOddsCalculatorView';
import ChaosBagLine from '@components/core/ChaosBagLine';
import CampaignLogSuppliesComponent from './CampaignLogSuppliesComponent';
import CampaignLogSectionComponent from './CampaignLogSectionComponent';
import CampaignGuide from '@data/scenario/CampaignGuide';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import space, { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import AchievementComponent from './AchievementComponent';

interface Props {
  componentId: string;
  campaignId: number;
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;
  standalone?: boolean;
}

export default function CampaignLogComponent({ componentId, campaignId, campaignGuide, campaignLog, standalone }: Props) {
  const { backgroundStyle, borderStyle, typography } = useContext(StyleContext);
  const renderLogEntrySectionContent = useCallback((id: string, title: string, type?: 'count' | 'supplies') => {
    switch (type) {
      case 'count': {
        const count = campaignLog.count(id, '$count');
        return (
          <View style={[styles.section, borderStyle]}>
            <Text style={typography.bigGameFont}>
              { title }: { count }
            </Text>
          </View>
        );
      }
      case 'supplies': {
        const section = campaignLog.investigatorSections[id];
        if (!section) {
          return (
            <View style={[styles.section, borderStyle]}>
              <Text style={[typography.bigGameFont, typography.underline]}>
                { title }
              </Text>
            </View>
          );
        }
        return (
          <View style={space.paddingTopM}>
            <View style={space.paddingBottomM}>
              <Text style={[
                typography.bigGameFont,
                typography.underline,
                typography.center,
              ]}>
                { title }
              </Text>
            </View>
            <CampaignLogSuppliesComponent
              sectionId={id}
              section={section}
              campaignGuide={campaignGuide}
            />
          </View>
        );
      }
      default: {
        const section = campaignLog.sections[id];
        return (
          <View style={[styles.section, borderStyle]}>
            <View style={space.paddingBottomM}>
              <Text style={[
                typography.bigGameFont,
                typography.underline,
                typography.center,
                (section && section.sectionCrossedOut) ? styles.crossedOut : {},
              ]}>
                { title }
              </Text>
            </View>
            { !!section && (
              <CampaignLogSectionComponent
                sectionId={id}
                campaignGuide={campaignGuide}
                section={section}
              />
            ) }
          </View>
        );
      }
    }
  }, [campaignLog, campaignGuide, borderStyle, typography]);

  const oddsCalculatorPressed = useCallback(() => {
    Navigation.push<GuideOddsCalculatorProps>(componentId, {
      component: {
        name: 'Guide.OddsCalculator',
        passProps: {
          campaignId: campaignId,
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
        name: 'Guide.ChaosBag',
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
    if (!keys(campaignLog.chaosBag).length && !standalone) {
      return null;
    }
    const tokenCount = sum(values(campaignLog.chaosBag));
    return (
      <View style={[styles.section, borderStyle]}>
        <View style={space.paddingBottomM}>
          <Text style={[typography.bigGameFont, typography.underline, typography.center]}>
            { t`Chaos Bag` }{ ` (${tokenCount})` }
          </Text>
        </View>
        <ChaosBagLine
          chaosBag={campaignLog.chaosBag}
        />
        <BasicButton
          title={t`Draw chaos tokens`}
          onPress={chaosBagSimulatorPressed}
        />
        <BasicButton
          title={t`Odds calculator`}
          onPress={oddsCalculatorPressed}
        />
      </View>
    );
  }, [borderStyle, typography, campaignLog, chaosBagSimulatorPressed, oddsCalculatorPressed, standalone]);
  const achievementsSection = useMemo(() => {
    const achievements = campaignGuide.achievements();
    if (!achievements.length) {
      return null;
    }
    return (
      <View style={[styles.section, styles.topBorder, borderStyle]}>
        <View style={space.paddingBottomM}>
          <Text style={[typography.bigGameFont, typography.underline, typography.center]}>
            { t`Achievements` }
          </Text>
        </View>
        { map(achievements, a => <AchievementComponent achievement={a} />) }
      </View>
    );
  }, [campaignGuide, borderStyle, typography]);
  return (
    <View style={backgroundStyle}>
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
      { achievementsSection }
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: m,
    paddingLeft: m + s,
    paddingRight: m + s,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  crossedOut: {
    textDecorationLine: 'line-through',
  },
});

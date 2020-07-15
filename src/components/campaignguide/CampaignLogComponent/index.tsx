import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { flatMap, keys, sum, values } from 'lodash';
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
import typography from '@styles/typography';
import space, { m, s } from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  componentId: string;
  campaignId: number;
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;
  fontScale: number;
}

export default class CampaignLogComponent extends React.Component<Props> {
  renderLogEntrySectionContent(id: string, title: string, type?: 'count' | 'supplies') {
    const { campaignLog, campaignGuide } = this.props;
    switch (type) {
      case 'count': {
        const count = campaignLog.count(id, '$count');
        return (
          <View style={styles.section}>
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
            <View style={styles.section}>
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
          <View style={styles.section}>
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
  }

  _oddsCalculatorPressed = () => {
    const {
      componentId,
      campaignId,
      campaignLog,
    } = this.props;
    this.setState({
      menuOpen: false,
    });
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
  };

  _chaosBagSimulatorPressed = () => {
    const { componentId, campaignId, campaignLog } = this.props;
    Navigation.push<GuideChaosBagProps>(componentId, {
      component: {
        name: 'Guide.ChaosBag',
        passProps: {
          componentId,
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
  };

  renderChaosBag() {
    const { campaignLog, fontScale } = this.props;
    if (!keys(campaignLog.chaosBag).length) {
      return null;
    }
    const tokenCount = sum(values(campaignLog.chaosBag));
    return (
      <View style={styles.section}>
        <View style={space.paddingBottomM}>
          <Text style={[typography.bigGameFont, typography.underline, typography.center]}>
            { t`Chaos Bag` }{ ` (${tokenCount})` }
          </Text>
        </View>
        <ChaosBagLine
          chaosBag={campaignLog.chaosBag}
          fontScale={fontScale}
        />
        <BasicButton
          title={t`Draw chaos tokens`}
          onPress={this._chaosBagSimulatorPressed}
        />
        <BasicButton
          title={t`Odds calculator`}
          onPress={this._oddsCalculatorPressed}
        />
      </View>
    );
  }

  render() {
    const { campaignGuide } = this.props;
    return (
      <View style={styles.wrapper}>
        { this.renderChaosBag() }
        { flatMap(campaignGuide.campaignLogSections(), log => {
          if (log.type === 'hidden') {
            return null;
          }
          return (
            <View key={log.id}>
              { this.renderLogEntrySectionContent(log.id, log.title, log.type) }
            </View>
          );
        }) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.background,
  },
  section: {
    padding: m,
    paddingLeft: m + s,
    paddingRight: m + s,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
  crossedOut: {
    textDecorationLine: 'line-through',
  },
});

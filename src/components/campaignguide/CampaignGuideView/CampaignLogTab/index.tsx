import React from 'react';
import { Button, StyleSheet, Text, View, ScrollView } from 'react-native';
import { flatMap, keys } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { OddsCalculatorProps } from 'components/campaign/OddsCalculatorView';
import ChaosBagLine from 'components/core/ChaosBagLine';
import CampaignLogSuppliesComponent from './CampaignLogSuppliesComponent';
import CampaignLogSectionComponent from './CampaignLogSectionComponent';
import CampaignGuide from 'data/scenario/CampaignGuide';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import typography from 'styles/typography';

interface Props {
  componentId: string;
  campaignId: number;
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;
  fontScale: number;
}

export default class CampaignLogTab extends React.Component<Props> {
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
          <View style={styles.topPadding}>
            <View style={styles.sectionHeader}>
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
            <View style={styles.sectionHeader}>
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
    Navigation.push<OddsCalculatorProps>(componentId, {
      component: {
        name: 'OddsCalculator',
        passProps: {
          campaignId: campaignId,
          investigatorIds: campaignLog.investigatorCodesSafe(),
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

  render() {
    const { campaignGuide, campaignLog, fontScale } = this.props;
    return (
      <ScrollView>
        { keys(campaignLog.chaosBag).length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[typography.bigGameFont, typography.underline, typography.center]}>
                { t`Chaos Bag` }
              </Text>
            </View>
            <ChaosBagLine
              chaosBag={campaignLog.chaosBag}
              fontScale={fontScale}
            />
            <View style={styles.buttonWrapper}>
              <Button
                title={t`Odds Calculator`}
                onPress={this._oddsCalculatorPressed}
              />
            </View>
          </View>
        ) }
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
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
    paddingLeft: 24,
    paddingRight: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
  },
  topPadding: {
    paddingTop: 16,
  },
  crossedOut: {
    textDecorationLine: 'line-through',
  },
  buttonWrapper: {
    padding: 8,
  },
  sectionHeader: {
    paddingBottom: 16,
  },
});

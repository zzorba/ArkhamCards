import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { flatMap } from 'lodash';
import { t } from 'ttag';

import ChaosBagLine from 'components/core/ChaosBagLine';
import CampaignLogSuppliesComponent from './CampaignLogSuppliesComponent';
import CampaignLogSectionComponent from './CampaignLogSectionComponent';
import CampaignGuide from 'data/scenario/CampaignGuide';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import typography from 'styles/typography';

interface Props {
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;
  fontScale: number;
}

export default class CampaignLogComponent extends React.Component<Props> {
  renderLogEntryContent(id: string, title: string, type?: 'count' | 'supplies') {
    const { campaignLog, campaignGuide } = this.props;
    switch (type) {
      case 'count': {
        const count = campaignLog.count(id, '$count');
        return (
          <View style={styles.container}>
            <Text style={typography.bigGameFont}>
              { title }: { count }
            </Text>
          </View>
        );
      };
      case 'supplies': {
        const section = campaignLog.investigatorSections[id];
        if (!section) {
          return (
            <View style={styles.container}>
              <Text style={[typography.bigGameFont, typography.underline]}>
                { title }
              </Text>
            </View>
          );
        }
        return (
          <CampaignLogSuppliesComponent
            sectionId={id}
            section={section}
            campaignGuide={campaignGuide}
            title={title}
          />
        );
      }
      default: {
        const section = campaignLog.sections[id];
        return (
          <View style={styles.container}>
            <Text style={[typography.bigGameFont, typography.underline, typography.center]}>
              { title }
            </Text>
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

  render() {
    const { campaignGuide, campaignLog, fontScale } = this.props;
    return (
      <View>
        <View style={styles.section}>
          <Text style={[typography.bigGameFont, typography.underline, typography.center]}>
            { t`Chaos Bag` }
          </Text>
          <ChaosBagLine
            chaosBag={campaignLog.chaosBag}
            fontScale={fontScale}
          />
        </View>
        { flatMap(campaignGuide.campaign.campaign.campaign_log, log => {
          if (log.type === 'hidden') {
            return null;
          }
          return (
            <View key={log.id}>
              { this.renderLogEntryContent(log.id, log.title, log.type) }
            </View>
          );
        }) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
    marginRight: 32,
    paddingTop: 8,
    paddingBottom: 8,
  },
  section: {
    margin: 16,
    marginLeft: 32,
    marginRight: 32,
  },
});

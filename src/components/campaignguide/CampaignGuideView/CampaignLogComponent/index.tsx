import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { map } from 'lodash';

import CampaignLogSuppliesComponent from './CampaignLogSuppliesComponent';
import CampaignLogSectionComponent from './CampaignLogSectionComponent';
import CampaignGuide from 'data/scenario/CampaignGuide';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import typography from 'styles/typography';

interface Props {
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;
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
              <Text style={[typography.bigGameFont, styles.underline]}>
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
            <Text style={[typography.bigGameFont, styles.underline]}>
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
    const { campaignGuide } = this.props;
    return map(campaignGuide.campaign.campaign.campaign_log, log => {
      return (
        <View key={log.id}>
          { this.renderLogEntryContent(log.id, log.title, log.type) }
        </View>
      );
    });
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
    marginRight: 32,
    paddingTop: 8,
    paddingBottom: 8,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});

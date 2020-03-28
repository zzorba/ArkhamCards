import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { map } from 'lodash';

import CampaignLogSectionComponent from './CampaignLogSectionComponent';
import CampaignGuide from 'data/scenario/CampaignGuide';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import typography from 'styles/typography';

interface Props {
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;
}

export default class CampaignLogComponent extends React.Component<Props> {

  renderLogEntryContent(id: string, type?: 'count' | 'investigator') {
    const { campaignLog, campaignGuide } = this.props;
    switch (type) {
      case 'count': {
        const count = campaignLog.count(id, '$count');
        return (
          <Text style={typography.gameFont}>
            { count }
          </Text>
        );
      };
      case 'investigator':
        return <Text>???</Text>;
      default: {
        const section = campaignLog.sections[id];
        if (!section) {
          return null;
        }
        return (
          <CampaignLogSectionComponent
            sectionId={id}
            campaignGuide={campaignGuide}
            section={section}
          />
        );
      }
    }
  }

  renderContent() {
    const { campaignLog, campaignGuide } = this.props;
    return map(campaignGuide.campaign.campaign.campaign_log, log => {
      return (
        <View key={log.id}>
          <Text style={[typography.bigGameFont, styles.underline]}>
            { log.title }
          </Text>
          {this.renderLogEntryContent(log.id, log.type) }
        </View>
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        { this.renderContent() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
    marginRight: 32,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { capitalize, map } from 'lodash';

import CampaignGuide from 'data/scenario/CampaignGuide';
import { EntrySection, CampaignLogEntry } from 'data/scenario/GuidedCampaignLog';
import typography from 'styles/typography';

interface Props {
  sectionId: string;
  campaignGuide: CampaignGuide;
  section: EntrySection;
}

export default class CampaignLogSectionComponent extends React.Component<Props> {
  _renderEntry = (entry: CampaignLogEntry) => {
    const { campaignGuide, sectionId, section } = this.props;
    const logEntry = campaignGuide.logEntry(sectionId, entry.id);
    if (!logEntry) {
      return (
        <Text key={entry.id}>
          { entry.id }
        </Text>
      );
    }
    const crossedOut = section.crossedOut[entry.id];
    switch (logEntry.type) {
      case 'text':
        return (
          <Text key={entry.id} style={[typography.text, crossedOut ? styles.crossedOut : {} ]}>
            { capitalize(logEntry.text) }
          </Text>
        );
      case 'section_count':
      case 'card':
      case 'investigator':
        return null;
    }
  };

  render() {
    const { section } = this.props;
    return map(section.entries, this._renderEntry);
  }
}

const styles = StyleSheet.create({
  crossedOut: {
    textDecorationLine: 'line-through',
  },
});

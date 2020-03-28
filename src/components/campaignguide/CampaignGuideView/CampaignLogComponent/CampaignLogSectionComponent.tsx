
import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { upperFirst, map } from 'lodash';

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
    const { section } = this.props;
    const { campaignGuide, sectionId } = this.props;
    const logEntry = campaignGuide.logEntry(sectionId, entry.id);
    const crossedOut = section.crossedOut[entry.id];
    switch (logEntry.type) {
      case 'supplies': {
        if (entry.type !== 'count') {
          return null;
        }
        if (logEntry.supply.multiple) {
          if (entry.count === 0) {
            return null;
          }
          return (
            <Text key={entry.id} style={[
              typography.mediumGameFont,
              styles.text,
            ]}>
              { logEntry.supply.name }: { entry.count }
            </Text>
          );
        }
        return (
          <Text key={entry.id} style={[
            typography.mediumGameFont,
            styles.text,
            crossedOut ? styles.crossedOut : {},
          ]}>
            { logEntry.supply.name }
          </Text>
        )
      }
      case 'text':
        return (
          <Text key={entry.id} style={[
            typography.mediumGameFont,
            styles.text,
            crossedOut ? styles.crossedOut : {},
          ]}>
            { upperFirst(logEntry.text) }
          </Text>
        );
      case 'section_count':
        return (
          <Text key={entry.id}>section count</Text>
        );
      case 'card':
        return 'some kind of card';
    }
  };

  render() {
    const { section } = this.props;
    return map(section.entries, this._renderEntry);
  }
}

const styles = StyleSheet.create({
  text: {
    marginBottom: 8,
  },
  crossedOut: {
    textDecorationLine: 'line-through',
  },
});

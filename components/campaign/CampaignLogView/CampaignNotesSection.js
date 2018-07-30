import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import typography from '../../../styles/typography';

export default class CampaignNotesSection extends React.Component {
  static propTypes = {
    campaignNotes: PropTypes.object,
  };

  static renderSections(sections) {
    return (
      <View>
        { map(sections, (section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={typography.small}>
              { section.title.toUpperCase() }
            </Text>
            { section.notes.length ? map(section.notes, (note, idx) => (
              <Text style={typography.text} key={idx}>
                { note }
              </Text>
            )) : <Text style={typography.text}>---</Text> }
          </View>
        )) }
      </View>
    );
  }

  static renderCounts(counts) {
    return (
      <View>
        { map(counts, (section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={typography.small}>
              { section.title.toUpperCase() }
            </Text>
            <Text style={typography.text}>
              { section.count || 0 }
            </Text>
          </View>
        )) }
      </View>
    );
  }

  render() {
    const {
      campaignNotes: {
        sections,
        counts,
      },
    } = this.props;
    return (
      <View style={styles.container}>
        { CampaignNotesSection.renderSections(sections) }
        { CampaignNotesSection.renderCounts(counts) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  section: {
    marginBottom: 8,
  },
});

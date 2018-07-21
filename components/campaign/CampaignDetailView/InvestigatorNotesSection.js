import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CampaignNotesSection from './CampaignNotesSection';
import { traumaString, DEFAULT_TRAUMA_DATA } from '../trauma';
import typography from '../../../styles/typography';
import listOfDecks from '../listOfDecks';
import deckRowWithDetails from '../deckRowWithDetails';

class InvestigatorNotesDeckDetail extends React.Component {
  static propTypes = {
    deck: PropTypes.object,
    investigators: PropTypes.object,
    campaign: PropTypes.object.isRequired,
  };

  render() {
    const {
      campaign: {
        campaignNotes: {
          investigatorNotes,
        },
        investigatorData,
      },
      deck,
      investigators,
    } = this.props;
    const code = deck.investigator_code;
    const investigator = investigators[code];
    const traumaData = investigatorData[code] || DEFAULT_TRAUMA_DATA;
    const sections = map(investigatorNotes.sections || [], section => {
      return {
        title: section.title,
        notes: section.notes[investigator.code] || [],
      };
    });
    const counts = map(investigatorNotes.counts || [], section => {
      return {
        title: section.title,
        count: section.counts[investigator.code] || 0,
      };
    });
    return (
      <View style={styles.investigatorNotes}>
        <View style={styles.section}>
          <Text style={typography.small}>TRAUMA</Text>
          <Text style={typography.text}>
            { traumaString(traumaData) }
          </Text>
        </View>
        { CampaignNotesSection.renderSections(sections) }
        { CampaignNotesSection.renderCounts(counts) }
      </View>
    );
  }
}

export default listOfDecks(deckRowWithDetails(InvestigatorNotesDeckDetail));

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
  },
  investigatorNotes: {
    flex: 1,
    marginTop: 4,
  },
});

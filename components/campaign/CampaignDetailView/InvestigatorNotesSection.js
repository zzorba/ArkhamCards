import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, forEach, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import CampaignNotesSection from './CampaignNotesSection';
import InvestigatorRowWrapper from '../InvestigatorRowWrapper';
import typography from '../../../styles/typography';

import { getAllDecks } from '../../../reducers';
import { traumaString, DEFAULT_TRAUMA_DATA } from '../trauma';

class InvestigatorNotesSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired,
    decks: PropTypes.object,
    investigatorCards: PropTypes.object,
  };

  static renderInvestigatorBlock(deckId, investigator, investigatorNotes, traumaData) {
    const sections = map(investigatorNotes.sections, section => {
      return {
        title: section.title,
        notes: section.notes[investigator.code] || [],
      };
    });
    const counts = map(investigatorNotes.counts, section => {
      return {
        title: section.title,
        count: section.counts[investigator.code] || 0,
      };
    });
    return (
      <InvestigatorRowWrapper
        key={deckId}
        id={investigator.code}
        investigator={investigator}
      >
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
      </InvestigatorRowWrapper>
    );
  }

  render() {
    const {
      campaign: {
        campaignNotes: {
          investigatorNotes,
        },
        investigatorData,
        latestDeckIds,
      },
      decks,
      investigatorCards,
    } = this.props;
    if (investigatorNotes.sections.length === 0 && investigatorNotes.counts.length === 0) {
      return null;
    }

    return (
      <View style={styles.container}>
        { flatMap(latestDeckIds, deckId => {
          const deck = decks[deckId];
          if (!deck) {
            return null;
          }
          const code = deck.investigator_code;
          return InvestigatorNotesSection.renderInvestigatorBlock(
            deck.id,
            investigatorCards[code],
            investigatorNotes,
            investigatorData[code] || DEFAULT_TRAUMA_DATA
          );
        }) }
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    decks: getAllDecks(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(InvestigatorNotesSection, {
    schemas: ['Card'],
    mapToProps(results) {
      const investigatorCards = {};
      forEach(results.cards.filtered('type_code == "investigator"'), card => {
        investigatorCards[card.code] = card;
      });

      return {
        investigatorCards,
      };
    },
  })
);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 8,
  },
  section: {
    marginBottom: 8,
  },
  investigatorNotes: {
    flex: 1,
    marginLeft: 8,
  },
});

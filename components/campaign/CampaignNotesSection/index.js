import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';

import Button from '../../core/Button';
import FactionGradient from '../../core/FactionGradient';
import InvestigatorImage from '../../core/InvestigatorImage';
import typography from '../../../styles/typography';

class CampaignNotesSection extends React.Component {
  static propTypes = {
    updateCampaignNotes: PropTypes.func.isRequired,
    campaignNotes: PropTypes.object,
    investigators: PropTypes.array,
    investigatorCards: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  investigatorNotes() {
    const {
      campaignNotes: {
        investigatorSections,
        investigatorCounts,
      },
      investigators,
      investigatorCards,
    } = this.props;
    if (investigatorSections.length === 0 && investigatorCounts.length === 0) {
      return [];
    }
    return map(investigators, investigator => {
      return {
        investigator: investigatorCards[investigator],
        sections: map(investigatorSections, section => {
          return {
            title: section.title,
            notes: section.notes[investigator.code] || [],
          };
        }),
        counts: map(investigatorCounts, section => {
          return {
            title: section.title,
            count: section.counts[investigator.code] || 0,
          };
        }),
      };
    });
  }

  static renderSections(sections) {
    return (
      <View>
        { map(sections, (section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={typography.bigLabel}>{ section.title }</Text>
            <View style={styles.margin}>
              { section.notes.length ? map(section.notes, (note, idx) => (
                <Text style={[styles.margin, typography.text]} key={idx}>
                  { note }
                </Text>
              )) : <Text style={typography.text}>None</Text> }
            </View>
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
            <Text style={typography.bigLabel}>
              { section.title }: { section.count }
            </Text>
          </View>
        )) }
      </View>
    );
  }

  static renderInvestigatorBlock({
    investigator,
    sections,
    counts,
  }) {
    return (
      <FactionGradient
        key={investigator.code}
        faction_code={investigator.faction_code}
        style={styles.investigatorBlock}
      >
        <InvestigatorImage card={investigator} />
        <View style={styles.investigatorNotes}>
          { CampaignNotesSection.renderSections(sections) }
          { CampaignNotesSection.renderCounts(counts) }
        </View>
      </FactionGradient>
    );
  }

  renderInvestigatorSection() {
    const investigatorNotes = this.investigatorNotes();
    if (investigatorNotes.length === 0) {
      return null;
    }

    return (
      <View>
        { map(investigatorNotes, CampaignNotesSection.renderInvestigatorBlock) }
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
      <View style={styles.underline}>
        <View style={styles.container}>
          { CampaignNotesSection.renderSections(sections) }
          { CampaignNotesSection.renderCounts(counts) }
          { this.renderInvestigatorSection() }
        </View>
        <View style={styles.button}>
          <Button text="Edit" align="left" onPress={this._showChaosBagDialog} />
        </View>
      </View>
    );
  }
}

export default connectRealm(CampaignNotesSection, {
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
});

const styles = StyleSheet.create({
  container: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  section: {
    marginBottom: 8,
  },
  margin: {
    marginLeft: 8,
    marginRight: 8,
  },
  underline: {
    borderBottomWidth: 1,
    borderColor: '#000000',
    marginBottom: 4,
  },
  button: {
    marginBottom: 8,
  },
  investigatorBlock: {
    padding: 8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  investigatorNotes: {
    flex: 1,
    marginLeft: 8,
  },
});

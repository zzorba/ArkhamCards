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
import InvestigatorImage from '../../core/InvestigatorImage';
import typography from '../../../styles/typography';

class CampaignNotesSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    updateCampaignNotes: PropTypes.func.isRequired,
    campaignNotes: PropTypes.object,
    investigators: PropTypes.array,
    investigatorCards: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._showCampaignNotesDialog = this.showCampaignNotesDialog.bind(this);
  }

  showCampaignNotesDialog() {
    const {
      navigator,
      updateCampaignNotes,
      campaignNotes,
      investigators,
    } = this.props;
    navigator.push({
      screen: 'Dialog.EditCampaignNotes',
      title: 'Campaign Log',
      passProps: {
        campaignNotes,
        investigators,
        updateCampaignNotes,
      },
      backButtonTitle: 'Cancel',
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
              )) : <Text style={typography.text}>---</Text> }
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

  static renderInvestigatorBlock(investigator, investigatorNotes) {
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
      <View
        key={investigator.code}
        style={styles.investigatorBlock}
      >
        <InvestigatorImage card={investigator} />
        <View style={styles.investigatorNotes}>
          { CampaignNotesSection.renderSections(sections) }
          { CampaignNotesSection.renderCounts(counts) }
        </View>
      </View>
    );
  }

  renderInvestigatorSection() {
    const {
      campaignNotes: {
        investigatorNotes,
      },
      investigators,
      investigatorCards,
    } = this.props;
    if (investigatorNotes.sections.length === 0 && investigatorNotes.counts.length === 0) {
      return null;
    }

    return (
      <View>
        <Text style={typography.bigLabel}>
          Investigator Notes
        </Text>
        { map(investigators, code => (
          CampaignNotesSection.renderInvestigatorBlock(
            investigatorCards[code],
            investigatorNotes
          ))
        ) }
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
          <Button text="Edit" align="left" onPress={this._showCampaignNotesDialog} />
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

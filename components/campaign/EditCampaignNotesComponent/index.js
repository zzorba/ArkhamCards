import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import EditCountComponent from '../EditCountComponent';
import InvestigatorSectionList from './InvestigatorSectionList';
import NotesSection from './NotesSection';
import Button from '../../core/Button';

export default class EditCampaignNotesComponent extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    // Parts of the campaign object.
    latestDeckIds: PropTypes.array.isRequired,
    campaignNotes: PropTypes.object,
    investigatorData: PropTypes.object,
    // Update function.
    updateCampaignNotes: PropTypes.func.isRequired,
    showDialog: PropTypes.func.isRequired,
    showTraumaDialog: PropTypes.func.isRequired,
    showAddSectionDialog: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._addNotesSection = this.addNotesSection.bind(this);
    this._notesChanged = this.notesChanged.bind(this);
    this._countChanged = this.countChanged.bind(this);
    this._updateInvestigatorNotes = this.updateInvestigatorNotes.bind(this);
    this._showAddSectionDialog = this.showAddSectionDialog.bind(this);
  }

  showAddSectionDialog() {
    const {
      showAddSectionDialog,
    } = this.props;
    showAddSectionDialog(this._addNotesSection);
  }

  addNotesSection(name, isCount, perInvestigator) {
    const {
      campaignNotes,
      updateCampaignNotes,
    } = this.props;
    const newCampaignNotes = Object.assign({}, campaignNotes);
    if (perInvestigator) {
      const newInvestigatorNotes = Object.assign({}, campaignNotes.investigatorNotes);
      if (isCount) {
        newInvestigatorNotes.counts = (newInvestigatorNotes.counts || []).slice();
        newInvestigatorNotes.counts.push({ title: name, counts: {}, custom: true });
      } else {
        newInvestigatorNotes.sections = (newInvestigatorNotes.sections || []).slice();
        newInvestigatorNotes.sections.push({ title: name, notes: {}, custom: true });
      }
      newCampaignNotes.investigatorNotes = newInvestigatorNotes;
    } else {
      if (isCount) {
        newCampaignNotes.counts = (campaignNotes.counts || []).slice();
        newCampaignNotes.counts.push({ title: name, count: 0, custom: true });
      } else {
        newCampaignNotes.sections = (campaignNotes.sections || []).slice();
        newCampaignNotes.sections.push({ title: name, notes: [], custom: true });
      }
    }
    updateCampaignNotes(newCampaignNotes);
  }

  notesChanged(index, notes) {
    const {
      updateCampaignNotes,
      campaignNotes,
    } = this.props;
    const sections = (campaignNotes.sections || []).slice();
    sections[index] = Object.assign({}, sections[index], { notes });
    updateCampaignNotes(Object.assign({}, campaignNotes, { sections }));
  }

  countChanged(index, count) {
    const {
      updateCampaignNotes,
      campaignNotes,
    } = this.props;
    const counts = (campaignNotes.counts || []).slice();
    counts[index] = Object.assign({}, counts[index], { count });
    updateCampaignNotes(Object.assign({}, campaignNotes, { counts }));
  }

  updateInvestigatorNotes(investigatorNotes) {
    const {
      updateCampaignNotes,
      campaignNotes,
    } = this.props;
    updateCampaignNotes(Object.assign({}, campaignNotes, { investigatorNotes }));
  }

  renderSections(sections) {
    return (
      <View>
        { map(sections, (section, idx) => (
          <NotesSection
            key={idx}
            title={section.title}
            notes={section.notes}
            index={idx}
            notesChanged={this._notesChanged}
            showDialog={this.props.showDialog}
          />
        )) }
      </View>
    );
  }

  renderCounts(counts) {
    return (
      <View>
        { map(counts, (section, idx) => (
          <EditCountComponent
            key={idx}
            index={idx}
            title={section.title}
            count={section.count}
            countChanged={this._countChanged}
            useTally
          />
        )) }
      </View>
    );
  }

  renderInvestigatorSection() {
    const {
      navigator,
      campaignNotes: {
        investigatorNotes,
      },
      latestDeckIds,
      investigatorData,
      showDialog,
      showTraumaDialog,
    } = this.props;
    return (
      <View style={styles.investigatorSection}>
        <InvestigatorSectionList
          navigator={navigator}
          deckIds={latestDeckIds}
          investigatorNotes={investigatorNotes}
          investigatorData={investigatorData}
          updateInvestigatorNotes={this._updateInvestigatorNotes}
          showDialog={showDialog}
          showTraumaDialog={showTraumaDialog}
        />
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
      <ScrollView style={styles.underline}>
        { this.renderSections(sections) }
        { this.renderCounts(counts) }
        { this.renderInvestigatorSection() }
        <Button text="Add Log Section" onPress={this._showAddSectionDialog} />
        <View style={styles.footer} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  underline: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#000000',
    marginBottom: 4,
  },
  investigatorSection: {
    marginBottom: 16,
  },
  footer: {
    height: 100,
  },
});

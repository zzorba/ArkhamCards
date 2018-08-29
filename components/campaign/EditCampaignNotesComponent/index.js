import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native';

import L from '../../../app/i18n';
import EditCountComponent from '../EditCountComponent';
import InvestigatorSectionList from './InvestigatorSectionList';
import NotesSection from './NotesSection';

export default class EditCampaignNotesComponent extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    // Parts of the campaign object.
    allInvestigators: PropTypes.array,
    campaignNotes: PropTypes.object,
    // Update function.
    updateCampaignNotes: PropTypes.func.isRequired,
    showDialog: PropTypes.func.isRequired,
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
      allInvestigators,
      showDialog,
    } = this.props;
    return (
      <View style={styles.investigatorSection}>
        <InvestigatorSectionList
          navigator={navigator}
          allInvestigators={allInvestigators}
          investigatorNotes={investigatorNotes}
          updateInvestigatorNotes={this._updateInvestigatorNotes}
          showDialog={showDialog}
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
      <View style={styles.underline}>
        { this.renderSections(sections) }
        { this.renderCounts(counts) }
        { this.renderInvestigatorSection() }
        <View style={styles.button}>
          <Button title={L('Add Log Section')} onPress={this._showAddSectionDialog} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  underline: {
    flex: 1,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
    marginBottom: 4,
  },
  investigatorSection: {
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 8,
  },
});

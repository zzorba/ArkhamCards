import React from 'react';
import { map } from 'lodash';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native';

import { t } from 'ttag';
import { CampaignNotes, InvestigatorNotes, CampaignNoteSection, CampaignNoteCount } from 'actions/types';
import Card from 'data/Card';
import { ShowTextEditDialog } from 'components/core/withDialogs';
import EditCountComponent from '../EditCountComponent';
import InvestigatorSectionList from './InvestigatorSectionList';
import NotesSection from './NotesSection';
import { s, xs } from 'styles/space';

interface Props {
  componentId: string;
  fontScale: number;
  allInvestigators: Card[];
  campaignNotes: CampaignNotes;
  updateCampaignNotes: (campaignNotes: CampaignNotes) => void;
  showDialog: ShowTextEditDialog;
  showAddSectionDialog: (
    addSection: (
      name: string,
      isCount: boolean,
      perInvestigator: boolean
    ) => void
  ) => void;
}
export default class EditCampaignNotesComponent extends React.Component<Props> {

  _showAddSectionDialog = () => {
    const {
      showAddSectionDialog,
    } = this.props;
    showAddSectionDialog(this._addNotesSection);
  };

  _addNotesSection = (name: string, isCount: boolean, perInvestigator: boolean) => {
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
  };

  _notesChanged = (index: number, notes: string[]) => {
    const {
      updateCampaignNotes,
      campaignNotes,
    } = this.props;
    const sections = (campaignNotes.sections || []).slice();
    sections[index] = Object.assign({}, sections[index], { notes });
    updateCampaignNotes(Object.assign({}, campaignNotes, { sections }));
  };

  _countChanged = (index: number, count: number) => {
    const {
      updateCampaignNotes,
      campaignNotes,
    } = this.props;
    const counts = (campaignNotes.counts || []).slice();
    counts[index] = Object.assign({}, counts[index], { count });
    updateCampaignNotes(Object.assign({}, campaignNotes, { counts }));
  };

  _updateInvestigatorNotes = (investigatorNotes: InvestigatorNotes) => {
    const {
      updateCampaignNotes,
      campaignNotes,
    } = this.props;
    updateCampaignNotes(Object.assign({}, campaignNotes, { investigatorNotes }));
  };

  renderSections(sections: CampaignNoteSection[]) {
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

  renderCounts(counts: CampaignNoteCount[]) {
    return (
      <View>
        { map(counts, (section, idx) => (
          <EditCountComponent
            key={idx}
            index={idx}
            title={section.title}
            count={section.count || 0}
            countChanged={this._countChanged}
          />
        )) }
      </View>
    );
  }

  renderInvestigatorSection() {
    const {
      componentId,
      campaignNotes: {
        investigatorNotes,
      },
      allInvestigators,
      showDialog,
    } = this.props;
    return (
      <View style={styles.investigatorSection}>
        <InvestigatorSectionList
          componentId={componentId}
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
          <Button title={t`Add Log Section`} onPress={this._showAddSectionDialog} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  underline: {
    paddingBottom: s,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
    marginBottom: xs,
  },
  investigatorSection: {
    marginTop: s,
  },
  button: {
    margin: s,
  },
});

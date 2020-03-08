import React from 'react';
import { map } from 'lodash';
import {
  View,
} from 'react-native';

import EditCountComponent from '../EditCountComponent';
import NotesSection from './NotesSection';
import { ShowTextEditDialog } from 'components/core/withDialogs';
import {
  InvestigatorNotes,
  InvestigatorCampaignNoteSection,
  InvestigatorCampaignNoteCount,
} from 'actions/types';
import Card from 'data/Card';

interface Props {
  investigator: Card;
  updateInvestigatorNotes: (investigatorNotes: InvestigatorNotes) => void;
  investigatorNotes: InvestigatorNotes;
  showDialog: ShowTextEditDialog;
}

export default class InvestigatorSectionRow extends React.Component<Props> {
  _notesChanged = (index: number, notes: string[]) => {
    const {
      investigator,
      updateInvestigatorNotes,
      investigatorNotes,
    } = this.props;
    const sections = (investigatorNotes.sections || []).slice();
    const newNotes = Object.assign({}, sections[index].notes, { [investigator.code]: notes });
    sections[index] = Object.assign({}, sections[index], { notes: newNotes });
    updateInvestigatorNotes(Object.assign({}, investigatorNotes, { sections }));
  };

  _countChanged = (index: number, count: number) => {
    const {
      investigator,
      updateInvestigatorNotes,
      investigatorNotes,
    } = this.props;
    const counts = (investigatorNotes.counts || []).slice();
    const newCounts = Object.assign({}, counts[index].counts, { [investigator.code]: count });
    counts[index] = Object.assign({}, counts[index], { counts: newCounts });
    updateInvestigatorNotes(Object.assign({}, investigatorNotes, { counts }));
  };

  renderSections(investigator: Card, sections: InvestigatorCampaignNoteSection[]) {
    const {
      showDialog,
    } = this.props;
    return (
      <View>
        { map(sections, (section, idx) => {
          const name = investigator.firstName || 'Unknown';
          const title = `${name}’s ${section.title}`;
          return (
            <NotesSection
              key={idx}
              title={title}
              notes={section.notes[investigator.code] || []}
              index={idx}
              notesChanged={this._notesChanged}
              showDialog={showDialog}
              isInvestigator
            />
          );
        }) }
      </View>
    );
  }

  renderCounts(investigator: Card, counts: InvestigatorCampaignNoteCount[]) {
    return (
      <View>
        { map(counts, (section, idx) => {
          const name = investigator.firstName ?
            investigator.firstName.toUpperCase() :
            'Unknown';
          const title = `${name}’S ${section.title}`;
          return (
            <EditCountComponent
              key={idx}
              index={idx}
              title={title}
              count={section.counts[investigator.code] || 0}
              countChanged={this._countChanged}
              isInvestigator
            />
          );
        }) }
      </View>
    );
  }

  render() {
    const {
      investigator,
      investigatorNotes: {
        sections,
        counts,
      },
    } = this.props;
    return (
      <View>
        { this.renderSections(investigator, sections) }
        { this.renderCounts(investigator, counts) }
      </View>
    );
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  View,
} from 'react-native';

import EditCountComponent from '../EditCountComponent';
import NotesSection from './NotesSection';

export default class InvestigatorSectionRow extends React.Component {
  static propTypes = {
    investigator: PropTypes.object.isRequired,
    updateInvestigatorNotes: PropTypes.func.isRequired,
    investigatorNotes: PropTypes.object.isRequired,
    showDialog: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._notesChanged = this.notesChanged.bind(this);
    this._countChanged = this.countChanged.bind(this);
  }

  notesChanged(index, notes) {
    const {
      investigator,
      updateInvestigatorNotes,
      investigatorNotes,
    } = this.props;
    const sections = (investigatorNotes.sections || []).slice();
    const newNotes = Object.assign({}, sections[index].notes, { [investigator.code]: notes });
    sections[index] = Object.assign({}, sections[index], { notes: newNotes });
    updateInvestigatorNotes(Object.assign({}, investigatorNotes, { sections }));
  }

  countChanged(index, count) {
    const {
      investigator,
      updateInvestigatorNotes,
      investigatorNotes,
    } = this.props;
    const counts = (investigatorNotes.counts || []).slice();
    const newCounts = Object.assign({}, counts[index].counts, { [investigator.code]: count });
    counts[index] = Object.assign({}, counts[index], { counts: newCounts });
    updateInvestigatorNotes(Object.assign({}, investigatorNotes, { counts }));
  }

  renderSections(investigator, sections) {
    const {
      showDialog,
    } = this.props;
    return (
      <View>
        { map(sections, (section, idx) => {
          const title = `${investigator.firstName}’s ${section.title}`;
          return (
            <NotesSection
              key={idx}
              title={title}
              notes={section.notes[investigator.code] || []}
              notesSection={section}
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

  renderCounts(investigator, counts) {
    return (
      <View>
        { map(counts, (section, idx) => {
          const title = `${investigator.firstName.toUpperCase()}’S ${section.title}`;
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

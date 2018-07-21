import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import EditCountComponent from '../EditCountComponent';
import EditTraumaComponent from '../EditTraumaComponent';
import NotesSection from './NotesSection';

import listOfDecks from '../listOfDecks';
import deckRowWithDetails from '../deckRowWithDetails';

/**
 * Fill this out for a single investigator section.
 */
class InvestigatorSectionDeckDetails extends React.Component {
  static propTypes = {
    investigator: PropTypes.object,
    updateInvestigatorNotes: PropTypes.func.isRequired,
    investigatorNotes: PropTypes.object.isRequired,
    investigatorData: PropTypes.object.isRequired,
    showDialog: PropTypes.func.isRequired,
    showTraumaDialog: PropTypes.func.isRequired,
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

  renderSections(sections) {
    const {
      investigator,
      showDialog,
    } = this.props;
    return (
      <View>
        { map(sections, (section, idx) => (
          <NotesSection
            key={idx}
            title={section.title}
            notes={section.notes[investigator.code] || []}
            notesSection={section}
            index={idx}
            notesChanged={this._notesChanged}
            showDialog={showDialog}
            isInvestigator
          />
        )) }
      </View>
    );
  }

  renderCounts(counts) {
    const {
      investigator,
    } = this.props;
    return (
      <View>
        { map(counts, (section, idx) => (
          <EditCountComponent
            key={idx}
            index={idx}
            title={section.title}
            count={section.counts[investigator.code] || 0}
            countChanged={this._countChanged}
            isInvestigator
            useTally
          />
        )) }
      </View>
    );
  }

  renderTrauma() {
    const {
      investigator,
      investigatorData,
      showTraumaDialog,
    } = this.props;
    return (
      <EditTraumaComponent
        investigator={investigator}
        investigatorData={investigatorData}
        showTraumaDialog={showTraumaDialog}
      />
    );
  }

  render() {
    const {
      investigatorNotes: {
        sections,
        counts,
      },
    } = this.props;
    return (
      <View style={styles.investigatorNotes}>
        { this.renderTrauma() }
        { this.renderSections(sections) }
        { this.renderCounts(counts) }
      </View>
    );
  }
}

export default listOfDecks(
  deckRowWithDetails(InvestigatorSectionDeckDetails, {
    compact: true,
    viewDeckButton: true,
  })
);

const styles = StyleSheet.create({
  investigatorNotes: {
    flex: 1,
    marginRight: 8,
  },
});

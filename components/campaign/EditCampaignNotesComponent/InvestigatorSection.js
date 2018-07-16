import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import CountSection from './CountSection';
import NotesSection from './NotesSection';
import InvestigatorImage from '../../core/InvestigatorImage';

/**
 * Fill this out for a single investigator section.
 */
export default class InvestigatorSection extends React.Component {
  static propTypes = {
    investigator: PropTypes.object,
    investigatorNotes: PropTypes.object,
    updateInvestigatorNotes: PropTypes.func.isRequired,
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
          <CountSection
            key={idx}
            index={idx}
            title={section.title}
            count={section.counts[investigator.code] || 0}
            countChanged={this._countChanged}
            isInvestigator
          />
        )) }
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
      <View style={styles.investigatorBlock}>
        <InvestigatorImage card={investigator} />
        <View style={styles.investigatorNotes}>
          { this.renderSections(sections) }
          { this.renderCounts(counts) }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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

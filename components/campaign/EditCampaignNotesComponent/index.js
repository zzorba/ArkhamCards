import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';

import CountSection from './CountSection';
import InvestigatorSection from './InvestigatorSection';
import NotesSection from './NotesSection';

class EditCampaignNotesComponent extends React.Component {
  static propTypes = {
    updateCampaignNotes: PropTypes.func.isRequired,
    campaignNotes: PropTypes.object,
    investigators: PropTypes.array,
    investigatorCards: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._notesChanged = this.notesChanged.bind(this);
    this._countChanged = this.countChanged.bind(this);
    this._updateInvestigatorNotes = this.updateInvestigatorNotes.bind(this);
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
          />
        )) }
      </View>
    );
  }

  renderCounts(counts) {
    return (
      <View>
        { map(counts, (section, idx) => (
          <CountSection
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
        { map(investigators, code => (
          <InvestigatorSection
            key={code}
            investigator={investigatorCards[code]}
            investigatorNotes={investigatorNotes}
            updateInvestigatorNotes={this._updateInvestigatorNotes}
          />
        )) }
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
          { this.renderSections(sections) }
          { this.renderCounts(counts) }
          { this.renderInvestigatorSection() }
        </View>
      </View>
    );
  }
}

export default connectRealm(EditCampaignNotesComponent, {
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
  underline: {
    borderBottomWidth: 1,
    borderColor: '#000000',
    marginBottom: 4,
  },
});

import React from 'react';
import PropTypes from 'prop-types';
import { filter, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import NoteRow from './NoteRow';
import typography from '../../styles/typography';

export default class NotesSection extends React.Component {
  static propTypes = {
    notesChanged: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      notes: [''],
    };

    this._syncNotes = this.syncNotes.bind(this);
    this._updateNote = this.updateNote.bind(this);
  }

  syncNotes() {
    const {
      notesChanged,
    } = this.props;
    notesChanged(filter(this.state.notes, note => note !== ''));
  }

  updateNote(index, note) {
    const notes = [...this.state.notes];
    notes[index] = note;
    if (index === (notes.length - 1) && note !== '') {
      // If they add something to last one, grow it.
      notes.push('');
    }
    this.setState({
      notes,
    }, this._syncNotes);
  }

  render() {
    return (
      <View style={styles.underline}>
        <Text style={[typography.bigLabel, styles.margin]}>
          Campaign Notes
        </Text>
        <View style={styles.margin}>
          { map(this.state.notes, (note, idx) => (
            <NoteRow
              key={idx}
              index={idx}
              note={note}
              updateNote={this._updateNote}
              last={idx === (this.state.notes.length - 1)}
            />)
          ) }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  margin: {
    marginLeft: 8,
    marginRight: 8,
  },
  underline: {
    borderBottomWidth: 1,
    borderColor: '#000000',
    marginBottom: 4,
  },
});

import React from 'react';
import { filter, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import NoteRow from './NoteRow';
import { ShowTextEditDialog } from 'components/core/withDialogs';
import { s, xs } from 'styles/space';
import typography from 'styles/typography';
interface Props {
  notesChanged: (index: number, notes: string[]) => void;
  index: number;
  title: string;
  notes: string[];
  showDialog: ShowTextEditDialog;
  isInvestigator?: boolean;
}

export default class NotesSection extends React.Component<Props> {
  notes() {
    return [
      ...this.props.notes,
      '',
    ];
  }

  syncNotes(notes: string[]) {
    const {
      notesChanged,
      index,
    } = this.props;
    notesChanged(index, filter(notes, note => note !== ''));
  }

  _updateNote = (index: number | 'last', note: string) => {
    let notes = this.notes();
    if (index === 'last') {
      index = notes.length - 1;
    }
    notes[index] = note;
    if (note === '') {
      notes = filter(notes, note => note !== '');
      notes.push('');
    } else if (index === (notes.length - 1)) {
      // If they add something to last one, grow it.
      notes.push('');
    }
    this.syncNotes(notes);
  };

  _updateLastNote = (ignoreIndex: number | 'last', note: string) => {
    this._updateNote(this.notes().length - 1, note);
  };

  render() {
    const {
      title,
      isInvestigator,
      showDialog,
    } = this.props;
    const notes = this.notes();
    return (
      <View style={isInvestigator ? {} : styles.container}>
        <Text style={[typography.smallLabel, styles.margin]}>
          { title.toUpperCase() }
        </Text>
        <View>
          { map(filter(notes, note => note !== ''), (note, idx) => (
            <NoteRow
              key={`${idx}-${note}`}
              title={title}
              index={idx}
              note={note}
              updateNote={this._updateNote}
              showDialog={showDialog}
            />)
          ) }
          <NoteRow
            key="last"
            title={title}
            index={-1}
            note=""
            updateNote={this._updateLastNote}
            showDialog={showDialog}
            last
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: s,
    paddingLeft: s,
    paddingRight: s,
  },
  margin: {
    marginTop: xs,
  },
});

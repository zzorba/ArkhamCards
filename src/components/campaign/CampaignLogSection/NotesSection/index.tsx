import React, { useCallback, useContext, useEffect, useReducer } from 'react';
import { filter, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import NoteRow from './NoteRow';
import { ShowTextEditDialog } from '@components/core/withDialogs';
import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  notesChanged: (index: number, notes: string[]) => void;
  index: number;
  title: string;
  notes: string[];
  showDialog: ShowTextEditDialog;
  isInvestigator?: boolean;
}

interface UpdateNoteAction {
  type: 'update';
  index: number;
  note: string;
}

interface AppendNoteAction {
  type: 'append';
  note: string;
}

interface SyncNotesAction {
  type: 'sync';
  notes: string[];
}

function notesReducer(notes: string[], action: UpdateNoteAction | AppendNoteAction | SyncNotesAction): string[] {
  switch (action.type) {
    case 'update': {
      const newNotes = [...notes];
      if (action.index < newNotes.length) {
        newNotes[action.index] = action.note;
      } else {
        newNotes.push(action.note);
      }
      return filter(newNotes, note => note !== '');
    }
    case 'append':
      return filter([...notes, action.note], note => note !== '');
    case 'sync':
      return action.notes;
  }
}

export default function NotesSection(props: Props) {
  const { notesChanged, index, title, notes, showDialog, isInvestigator } = props;
  const { typography } = useContext(StyleContext);
  const [currentNotes, updateCurrentNotes] = useReducer(notesReducer, notes);
  useEffect(() => {
    if (notes !== currentNotes) {
      notesChanged(index, currentNotes);
    }
  }, [notesChanged, index, notes, currentNotes]);

  const updateNote = useCallback((note: string, index: number) => {
    updateCurrentNotes({ type: 'update', index, note });
  }, [updateCurrentNotes]);

  const appendNote = useCallback((note: string) => {
    updateCurrentNotes({ type: 'append', note });
  }, [updateCurrentNotes]);

  return (
    <View style={isInvestigator ? {} : styles.container}>
      <Text style={[
        typography.mediumGameFont,
        typography.center,
        typography.underline,
        styles.margin,
      ]}>
        { title }
      </Text>
      <View>
        { map(notes, (note, idx) => (
          <NoteRow
            key={idx}
            title={title}
            index={idx}
            note={note}
            updateNote={updateNote}
            showDialog={showDialog}
          />)
        ) }
        <NoteRow
          key="last"
          title={title}
          index={notes.length}
          note=""
          updateNote={appendNote}
          appendNote={appendNote}
          showDialog={showDialog}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: s,
    paddingLeft: s,
    paddingRight: s,
  },
  margin: {
    marginTop: s,
    marginBottom: xs,
  },
});

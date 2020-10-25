import React, { useCallback, useContext, useMemo } from 'react';
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

export default function NotesSection({ notesChanged, index, title, notes, showDialog, isInvestigator }: Props) {
  const { typography } = useContext(StyleContext);
  const liveNotes = useMemo(() => [...notes, ''], [notes]);
  const syncNotes = useCallback((notes: string[]) => {
    notesChanged(index, filter(notes, note => note !== ''));
  }, [notesChanged, index]);

  const updateNote = useCallback((index: number | 'last', note: string) => {
    let updatedNotes = [...liveNotes];
    if (index === 'last') {
      index = updatedNotes.length - 1;
    }
    updatedNotes[index] = note;
    if (note === '') {
      updatedNotes = filter(updatedNotes, note => note !== '');
      updatedNotes.push('');
    } else if (index === (liveNotes.length - 1)) {
      // If they add something to last one, grow it.
      updatedNotes.push('');
    }
    syncNotes(updatedNotes);
  }, [liveNotes, syncNotes]);

  const updateLastNote = useCallback((ignoreIndex: number | 'last', note: string) => {
    updateNote(liveNotes.length - 1, note);
  }, [updateNote, liveNotes]);

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
        { map(filter(liveNotes, note => note !== ''), (note, idx) => (
          <NoteRow
            key={`${idx}-${note}`}
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
          index={-1}
          note=""
          updateNote={updateLastNote}
          showDialog={showDialog}
          last
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

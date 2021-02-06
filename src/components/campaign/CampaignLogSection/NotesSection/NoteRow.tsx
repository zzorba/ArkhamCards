import React, { useCallback, useMemo } from 'react';
import { startsWith } from 'lodash';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { t } from 'ttag';

import TextBoxButton from '@components/core/TextBoxButton';
import { ShowTextEditDialog } from '@components/core/useTextEditDialog';
import DeckButton from '@components/deck/controls/DeckButton';
import MiniPickerStyleButton from '@components/deck/controls/MiniPickerStyleButton';

interface Props {
  title: string;
  index: number;
  note: string;
  updateNote: (note: string, index: number) => void;
  appendNote?: (note: string) => void;
  showDialog: ShowTextEditDialog;
}

export default function NoteRow(props: Props) {
  const { title, index, note, updateNote, appendNote, showDialog } = props;
  const onChange = useCallback((newNote: string) => {
    updateNote(newNote, index);
  }, [updateNote, index]);

  const onPress = useCallback(() => {
    showDialog(
      title,
      note,
      onChange,
      note !== '',
      3,
      appendNote
    );
  }, [title, note, showDialog, appendNote, onChange]);

  const [value, crossedOut] = useMemo(() => {
    const crossedOut = startsWith(note, '~');
    return [crossedOut ? note.substring(1) : note, crossedOut];
  }, [note]);

  return (
    <View style={styles.row}>
      { appendNote ? (
        <MiniPickerStyleButton
          first
          last
          icon="edit"
          title={t`Add note`}
          valueLabel=""
          editable
          onPress={onPress}
        />
      ) : (
        <TouchableOpacity onPress={onPress}>
          <TextBoxButton
            crossedOut={crossedOut}
            value={value}
            pointerEvents="none"
            ellipsizeMode="tail"
            multiline
          />
        </TouchableOpacity>
      ) }
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 8,
  },
});

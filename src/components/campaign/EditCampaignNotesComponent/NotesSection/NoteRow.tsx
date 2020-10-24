import React, { useCallback } from 'react';
import { startsWith } from 'lodash';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { t } from 'ttag';
import TextBoxButton from '@components/core/TextBoxButton';
import { ShowTextEditDialog } from '@components/core/withDialogs';

interface Props {
  title: string;
  index: number | 'last';
  note: string;
  updateNote: (index: number | 'last', note: string) => void;
  last?: boolean;
  showDialog: ShowTextEditDialog;
}

export default function NoteRow({ title, index, note, updateNote, last, showDialog }: Props) {
  const onChange = useCallback((note: string) => {
    updateNote(index, note);
  }, [index, updateNote]);

  const onPress = useCallback(() => {
    showDialog(
      title,
      note,
      onChange,
      note !== '', 3,
      last ? onChange : undefined
    );
  }, [title, note, showDialog, last, onChange]);

  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onPress}>
        <TextBoxButton
          crossedOut={startsWith(note, '~')}
          value={startsWith(note, '~') ? note.substring(1) : note}
          placeholder={last ? t`Add note` : undefined}
          pointerEvents="none"
          ellipsizeMode="tail"
          multiline
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 8,
  },
});

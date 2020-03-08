import React from 'react';
import { startsWith } from 'lodash';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { t } from 'ttag';
import TextBoxButton from 'components/core/TextBoxButton';
import { ShowTextEditDialog } from 'components/core/withDialogs';

interface Props {
  title: string;
  index: number | 'last';
  note: string;
  updateNote: (index: number | 'last', note: string) => void;
  last?: boolean;
  showDialog: ShowTextEditDialog;
}

export default class NoteRow extends React.Component<Props> {
  _onChange = (note: string) => {
    const {
      index,
      updateNote,
    } = this.props;
    updateNote(index, note);
  };

  _onPress = () => {
    const {
      title,
      note,
      showDialog,
      last,
    } = this.props;
    showDialog(
      title,
      note,
      this._onChange,
      note !== '', 3,
      last ? this._onChange : undefined
    );
  };

  render() {
    const {
      note,
      last,
    } = this.props;
    return (
      <View style={styles.row}>
        <TouchableOpacity onPress={this._onPress}>
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
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 8,
  },
});

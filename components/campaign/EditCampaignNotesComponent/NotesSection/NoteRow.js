import React from 'react';
import PropTypes from 'prop-types';
import { startsWith } from 'lodash';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import L from '../../../../app/i18n';
import TextBoxButton from '../../../core/TextBoxButton';

export default class NoteRow extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    note: PropTypes.string.isRequired,
    updateNote: PropTypes.func.isRequired,
    last: PropTypes.bool,
    showDialog: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
    this._onChange = this.onChange.bind(this);
  }

  onChange(note) {
    const {
      index,
      updateNote,
    } = this.props;
    updateNote(index, note);
  }

  onPress() {
    const {
      title,
      note,
      showDialog,
      last,
    } = this.props;
    showDialog(title, note, this._onChange, note !== '', 3, last ? this._onChange : null);
  }

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
            placeholder={last ? L('Add note') : null}
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

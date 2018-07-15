import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';

import TextBox from '../../core/TextBox';

export default class NoteRow extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    note: PropTypes.string.isRequired,
    updateNote: PropTypes.func.isRequired,
    last: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this._onChange = this.onChange.bind(this);
  }

  onChange(note) {
    const {
      index,
      updateNote,
    } = this.props;
    updateNote(index, note);
  }

  render() {
    const {
      note,
      last,
    } = this.props;
    return (
      <View style={styles.row}>
        <TextBox
          value={note}
          onChangeText={this._onChange}
          placeholder={last ? 'Add a campaign note' : null}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 4,
  },
});

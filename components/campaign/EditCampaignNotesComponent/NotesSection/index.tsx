import React from 'react';
import PropTypes from 'prop-types';
import { filter, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import NoteRow from './NoteRow';
import typography from '../../../../styles/typography';
import { ShowTextEditDialog } from '../../../core/withDialogs';

interface Props {
  notesChanged: (index: number, notes: string[]) => void;
  index: number;
  title: string;
  notes: string[];
  showDialog: ShowTextEditDialog;
  isInvestigator?: boolean;
}

interface State {
  notes: string[];
}

export default class NotesSection extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      notes: [...props.notes, ''],
    };
  }

  _syncNotes = () => {
    const {
      notesChanged,
      index,
    } = this.props;
    const {
      notes,
    } = this.state;
    notesChanged(index, filter(notes, note => note !== ''));
  };

  _updateNote = (index: number | 'last', note: string) => {
    if (index === 'last') {
      index = this.state.notes.length - 1;
    }
    let notes = this.state.notes.slice();
    notes[index] = note;
    if (note === '') {
      notes = filter(notes, note => note !== '');
      notes.push('');
    } else if (index === (notes.length - 1)) {
      // If they add something to last one, grow it.
      notes.push('');
    }
    this.setState({
      notes,
    }, this._syncNotes);
  };

  _updateLastNote = (ignoreIndex: number | 'last', note: string) => {
    this._updateNote(this.state.notes.length - 1, note);
  };

  render() {
    const {
      title,
      isInvestigator,
      showDialog,
    } = this.props;
    const {
      notes,
    } = this.state;
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
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
  },
  margin: {
    marginTop: 4,
  },
});

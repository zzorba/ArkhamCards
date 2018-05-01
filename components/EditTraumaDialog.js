import React from 'react';
import PropTypes from 'prop-types';

import DialogPicker from './core/DialogPicker';


const ADD_MENTAL = 'Add Mental';
const REMOVE_MENTAL = 'Remove Mental';
const ADD_PHYSICAL = 'Add Physical';
const REMOVE_PHYSICAL = 'Remove Physical';
const SET_KILLED = 'Killed';
const REMOVE_KILLED = 'Undo Killed';
const SET_INSANE = 'Insane';
const REMOVE_INSANE = 'Undo Insane';

export default class EditTraumaDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    updateTrauma: PropTypes.func.isRequired,
    trauma: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._onChoice = this.onChoice.bind(this);
  }

  options() {
    const {
      trauma,
    } = this.props;
    if (trauma.killed) {
      return [REMOVE_KILLED];
    }
    if (trauma.insane) {
      return [REMOVE_INSANE];
    }

    const options = [];
    options.push(ADD_MENTAL);
    if (trauma.mental > 0) {
      options.push(REMOVE_MENTAL);
    }
    options.push(ADD_PHYSICAL);
    if (trauma.physical > 0) {
      options.push(REMOVE_PHYSICAL);
    }
    options.push(SET_KILLED);
    options.push(SET_INSANE);
    return options;
  }

  onChoice(value) {
    const {
      trauma,
      updateTrauma,
    } = this.props;
    let mental = trauma.mental || 0;
    let physical = trauma.physical || 0;
    let killed = trauma.killed || false;
    let insane = trauma.insane || false;
    switch (value) {
      case ADD_MENTAL:
        mental++;
        break;
      case REMOVE_MENTAL:
        mental--;
        break;
      case ADD_PHYSICAL:
        physical++;
        break;
      case REMOVE_PHYSICAL:
        physical--;
        break;
      case SET_KILLED:
        killed = true;
        break;
      case REMOVE_KILLED:
        killed = false;
        break;
      case SET_INSANE:
        insane = true;
        break;
      case REMOVE_INSANE:
        insane = false;
        break;
      default: break;
    }
    updateTrauma({
      mental,
      physical,
      killed,
      insane,
    });
  }

  render() {
    const {
      navigator,
    } = this.props;

    return (
      <DialogPicker
        navigator={navigator}
        header="Edit Trauma"
        options={this.options()}
        onSelectionChanged={this._onChoice}
        selectedOption={null}
      />
    );
  }
}

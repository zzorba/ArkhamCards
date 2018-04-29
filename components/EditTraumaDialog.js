import React from 'react';
import PropTypes from 'prop-types';

import DialogPicker from './core/DialogPicker';


const ADD_MENTAL = 'Add Mental';
const REMOVE_MENTAL = 'Remove Mental';
const ADD_PHYSICAL = 'Add Physical';
const REMOVE_PHYSICAL = 'Remove Physical';

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
    const options = [ADD_MENTAL];
    if (trauma.mental > 0) {
      options.push(REMOVE_MENTAL);
    }
    options.push(ADD_PHYSICAL);
    if (trauma.physical > 0) {
      options.push(REMOVE_PHYSICAL);
    }
    return options;
  }

  onChoice(value) {
    const {
      trauma,
      updateTrauma,
    } = this.props;
    let mental = trauma.mental || 0;
    let physical = trauma.physical || 0;
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
      default: break;
    }
    updateTrauma({
      mental,
      physical,
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

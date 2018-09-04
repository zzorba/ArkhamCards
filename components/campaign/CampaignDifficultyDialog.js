import React from 'react';
import PropTypes from 'prop-types';
import { keys } from 'lodash';

import L from '../../app/i18n';
import DialogPicker from '../core/DialogPicker';
import { DIFFICULTY } from '../../constants';

const OPTIONS = keys(DIFFICULTY);

export default class CampaignDifficultyDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    updateDifficulty: PropTypes.func.isRequired,
    difficulty: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this._onChoice = this.onChoice.bind(this);
  }

  onChoice(value) {
    this.props.updateDifficulty(value);
  }

  render() {
    const {
      navigator,
      difficulty,
    } = this.props;

    return (
      <DialogPicker
        navigator={navigator}
        header={L('Selected Difficulty')}
        options={OPTIONS}
        onSelectionChanged={this._onChoice}
        selectedOption={difficulty}
      />
    );
  }
}

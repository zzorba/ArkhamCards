import React from 'react';
import PropTypes from 'prop-types';

import DialogPicker from './core/DialogPicker';

const EASY = 'Easy';
const STANDARD = 'Standard';
const HARD = 'Hard';
const EXPERT = 'Expert';

const OPTIONS = [EASY, STANDARD, HARD, EXPERT];

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
        header="Selected Difficulty"
        options={OPTIONS}
        onSelectionChanged={this._onChoice}
        selectedOption={difficulty}
      />
    );
  }
}

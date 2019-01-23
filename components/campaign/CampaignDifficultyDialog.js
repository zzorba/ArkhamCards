import React from 'react';
import PropTypes from 'prop-types';
import { findKey, keys, map } from 'lodash';

import L from '../../app/i18n';
import DialogPicker from '../core/DialogPicker';
import { DIFFICULTY, difficultyStrings } from './constants';

export default class CampaignDifficultyDialog extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    updateDifficulty: PropTypes.func.isRequired,
    difficulty: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this._onChoice = this.onChoice.bind(this);
  }

  onChoice(value) {
    this.props.updateDifficulty(
      findKey(difficultyStrings(), entry => entry === value));
  }

  render() {
    const {
      componentId,
      difficulty,
    } = this.props;
    const strings = difficultyStrings();
    const options = map(keys(DIFFICULTY), code => strings[code]);

    return (
      <DialogPicker
        componentId={componentId}
        header={L('Selected Difficulty')}
        options={options}
        onSelectionChanged={this._onChoice}
        selectedOption={strings[difficulty]}
      />
    );
  }
}

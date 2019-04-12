import React from 'react';
import { find, map } from 'lodash';

import { t } from 'ttag';
import { CampaignDifficultyType, DIFFICULTIES } from '../../actions/types';
import DialogPicker from '../core/DialogPicker';
import { difficultyString } from './constants';

interface Props {
  componentId: string;
  updateDifficulty: (difficulty: CampaignDifficultyType) => void;
  difficulty: CampaignDifficultyType;
}

export default class CampaignDifficultyDialog extends React.Component<Props> {
  _onChoice = (value: string) => {
    const difficulty = find(DIFFICULTIES, code =>
      difficultyString(code) === value);
    if (difficulty) {
      this.props.updateDifficulty(difficulty);
    }
  }

  render() {
    const {
      componentId,
      difficulty,
    } = this.props;
    const options = map(DIFFICULTIES, code => difficultyString(code));

    return (
      <DialogPicker
        componentId={componentId}
        header={t`Selected Difficulty`}
        options={options}
        onSelectionChanged={this._onChoice}
        selectedOption={difficultyString(difficulty)}
      />
    );
  }
}

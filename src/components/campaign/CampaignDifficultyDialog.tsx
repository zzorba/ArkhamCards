import { map } from 'lodash';

import { t } from 'ttag';
import { CampaignDifficulty, DIFFICULTIES } from '@actions/types';
import { showOptionDialog } from '@components/nav/helper';
import { difficultyString } from './constants';


export function showCampaignDifficultyDialog(
  sortChanged: (difficulty: CampaignDifficulty) => void
) {
  showOptionDialog(
    t`Selected Difficulty`,
    map(DIFFICULTIES, difficultyString),
    (index: number) => {
      sortChanged(DIFFICULTIES[index])
    }
  );
}

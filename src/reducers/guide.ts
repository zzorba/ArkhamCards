import { find, forEach, map } from 'lodash';

import {
  GUIDE_SET_COUNT,
  GUIDE_SET_DECISION,
  GUIDE_CLEAR_COUNT,
  GUIDE_CLEAR_DECISION,
  GUIDE_RESET_SCENARIO,
  GuideActions,
  GuideState,
} from 'actions/types';

export interface GuidesState {
  all: {
    [id: string]: GuideState;
  };
}

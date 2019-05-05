import {
  SET_TABOO_SET,
  SetTabooSetAction,
} from '../../actions/types';

export function setTabooSet(tabooId?: number): SetTabooSetAction {
  return {
    type: SET_TABOO_SET,
    tabooId,
  };
}

import {
  SET_TABOO_SET,
  SET_SINGLE_CARD_VIEW,
  SetTabooSetAction,
  SetSingleCardViewAction,
} from 'actions/types';

export function setTabooSet(tabooId?: number): SetTabooSetAction {
  return {
    type: SET_TABOO_SET,
    tabooId,
  };
}

export function setSingleCardView(value: boolean): SetSingleCardViewAction {
  return {
    type: SET_SINGLE_CARD_VIEW,
    singleCardView: value,
  };
}

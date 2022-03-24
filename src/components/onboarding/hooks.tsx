import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState, getOnboardingDismissed } from '@reducers';
import { DISMISS_ONBOARDING } from '@actions/types';

export function useShowOnboarding(
  onboarding: string
): [boolean, () => void] {
  const dispatch = useDispatch();
  const dismissed = useSelector((state: AppState) => getOnboardingDismissed(state, onboarding));
  const dismiss = useCallback(() => {
    dispatch({
      type: DISMISS_ONBOARDING,
      onboarding,
    });
  }, [dispatch, onboarding]);
  return [!dismissed, dismiss];
}
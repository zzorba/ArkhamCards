import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState, getOnboardingDismissed } from '@reducers';
import { SYNC_DISMISS_ONBOARDING } from '@actions/types';
import { useUpdateOnboarding } from '@data/remote/settings';

export function useShowOnboarding(
  onboarding: string
): [boolean, () => void] {
  const dispatch = useDispatch();
  const updateRemoteOnboarding = useUpdateOnboarding();
  const dismissed = useSelector((state: AppState) => getOnboardingDismissed(state, onboarding));
  const dismiss = useCallback(() => {
    updateRemoteOnboarding({ [onboarding]: true });
    dispatch({
      type: SYNC_DISMISS_ONBOARDING,
      updates: { [onboarding]: true },
    });
  }, [dispatch, onboarding, updateRemoteOnboarding]);
  return [!dismissed, dismiss];
}
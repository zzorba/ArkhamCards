import React, { useContext, useMemo } from 'react';
import { find } from 'lodash';
import { t } from 'ttag';

import OnboardingToast from './OnboardingToast';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import StyleContext from '@styles/StyleContext';
import { useOnboardingCarousel } from './OnboardingCarousel';
import OnboardingSlide from './OnboardingSlide';

export default function useCampaignSharingOnboarding(campaigns: MiniCampaignT[], refreshing: boolean): [React.ReactNode, React.ReactNode] {
  const { user, loading: userLoading } = useContext(ArkhamCardsAuthContext);
  const { colors } = useContext(StyleContext);
  const slides: React.ReactNode[] = useMemo(() => {
    const hasRemoteCampaigns = refreshing || !!find(campaigns, c => c.remote);
    if (hasRemoteCampaigns) {
      return [];
    }
    return [
      (
        <OnboardingSlide
          key="slide1"
          title={t`Sharing campaigns`}
          body="This is the campaign sharing feature"
          faction="mystic"
        />
      ),
      ...(!user && !userLoading ? [
        <OnboardingSlide
          key="slide2"
          title={t`Sign up with Arkham Cards`}
          body="First you need to sign up for an Arkham Cards account"
          faction="seeker"
        />,
      ] : []),
      (
        <OnboardingSlide
          key="slide2"
          title={t`Upload a campaign`}
          body="Choose the campaign you want to share, and upload it."
          faction="survivor"
        />
      ),
      (
        <OnboardingSlide
          key="slide3"
          title={t`Add a friend`}
          body="After uploading you can search for and add friends based on their username, and add them to the campaign."
          faction="guardian"
        />
      ),
      (
        <OnboardingSlide
          key="slide3"
          title={t`Enjoy the campaign`}
          body="Each player can ."
          faction="guardian"
        />
      ),
    ];
  }, [user, userLoading, refreshing, campaigns]);
  const [dialog, showDialog] = useOnboardingCarousel(slides);
  return [
    <OnboardingToast
      key="toast"
      background={colors.faction.mystic.background}
      setting="campaign_sync"
      text={t`Did you know campaigns can be shared with friends using this app?`}
      hide={!slides?.length}
      onPress={showDialog}
    />,
    dialog,
  ];
}

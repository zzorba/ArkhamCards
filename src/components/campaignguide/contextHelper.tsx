import {
  StandaloneId,
  STANDALONE,
  CampaignId,
} from '@actions/types';
import { createSelector } from 'reselect';
import CampaignGuide from '@data/scenario/CampaignGuide';
import { getCampaignGuide } from '@data/scenario';
import {
  AppState,
  getLangPreference,
} from '@reducers';
import { useSelector } from 'react-redux';
import { useMemo, useEffect, useState } from 'react';
import { useCampaign, useCampaignGuideState, useCampaignInvestigators } from '@data/hooks';
import CampaignGuideStateT from '@data/interfaces/CampaignGuideStateT';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';
import Card from '@data/types/Card';

export interface SingleCampaignGuideData {
  campaign: SingleCampaignT;
  campaignGuide: CampaignGuide;
  campaignState: CampaignGuideStateT;
  linkedCampaignState?: CampaignGuideStateT;
  campaignInvestigators?: CampaignInvestigator[];
  parallelInvestigators?: Card[];
}

const makeCampaignGuideSelector = (): (state: AppState, campaign?: SingleCampaignT) => { campaignCode: string; standaloneId?: StandaloneId; lang: string } | undefined =>
  createSelector(
    (state: AppState) => getLangPreference(state),
    (state: AppState, campaign?: SingleCampaignT) => campaign?.cycleCode,
    (state: AppState, campaign?: SingleCampaignT) => campaign?.standaloneId,
    (lang: string, campaignCode?: string, standaloneId?: StandaloneId) => {
      if (!campaignCode) {
        return undefined;
      }
      return { campaignCode, standaloneId, lang };
    }
  );

function useCampaignGuide(campaign?: SingleCampaignT) {
  const campaignGuideSelector = useMemo(makeCampaignGuideSelector, []);
  const campaignGuideData = useSelector((state: AppState) => campaignGuideSelector(state, campaign));
  const [guide, setGuide] = useState<CampaignGuide | undefined>(undefined);
  useEffect(() => {
    if (!campaignGuideData) {
      return;
    }
    let canceled = false;
    (async() => {
      if (campaignGuideData.campaignCode === STANDALONE && campaignGuideData.standaloneId) {
        const guide = await getCampaignGuide(campaignGuideData.standaloneId.campaignId, campaignGuideData.lang);
        if (!canceled) {
          setGuide(guide);
        }
      } else {
        const guide = await getCampaignGuide(campaignGuideData.campaignCode, campaignGuideData.lang);
        if (!canceled) {
          setGuide(guide);
        }
      }
    })();
    return () => {
      canceled = true;
    }
  }, [campaignGuideData, setGuide]);
  return guide;
}

export type SingleCampaignGuideStatus = 'loading' | 'update';

export function useSingleCampaignGuideData(
  campaignId: CampaignId,
  live: boolean
): [SingleCampaignGuideData | undefined, SingleCampaignGuideStatus | undefined] {
  const campaign = useCampaign(campaignId, live);
  const [campaignInvestigators, parallelInvestigators, campaignInvestigatorsLoading] = useCampaignInvestigators(campaign);
  const campaignGuide = useCampaignGuide(campaign);

  const campaignState = useCampaignGuideState(campaignId, live);
  const linkedCampaignState = useCampaignGuideState(campaign?.linkedCampaignId, false);
  return useMemo(() => {
    if (!campaign || !campaign.cycleCode || !campaignState || campaignInvestigatorsLoading) {
      return [undefined, 'loading'];
    }
    if (!campaignGuide) {
      return [undefined, 'update'];
    }
    return [{
      campaign,
      campaignGuide,
      campaignState,
      linkedCampaignState,
      campaignInvestigators: campaignInvestigatorsLoading ? undefined : campaignInvestigators,
      parallelInvestigators: campaignInvestigatorsLoading ? undefined : parallelInvestigators,
    }, undefined];
  }, [campaign, campaignGuide, campaignState, linkedCampaignState, campaignInvestigators, parallelInvestigators, campaignInvestigatorsLoading]);
}

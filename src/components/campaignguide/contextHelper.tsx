import {
  StandaloneId,
  STANDALONE,
  CampaignId,
} from '@actions/types';
import { createSelector } from 'reselect';
import CampaignGuide from '@data/scenario/CampaignGuide';
import Card from '@data/types/Card';
import { getCampaignGuide } from '@data/scenario';
import {
  AppState,
  getLangPreference,
} from '@reducers';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useCampaign, useCampaignGuideState, useCampaignInvestigators } from '@data/hooks';
import CampaignGuideStateT from '@data/interfaces/CampaignGuideStateT';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import { useParallelInvestigators } from '@components/core/hooks';
import { map } from 'lodash';

export interface SingleCampaignGuideData {
  campaign: SingleCampaignT;
  campaignGuide: CampaignGuide;
  campaignState: CampaignGuideStateT;
  linkedCampaignState?: CampaignGuideStateT;
  campaignInvestigators?: Card[];
  parallelInvestigators?: Card[];
}

const makeCampaignGuideSelector = (): (state: AppState, campaign?: SingleCampaignT) => CampaignGuide | undefined =>
  createSelector(
    (state: AppState) => getLangPreference(state),
    (state: AppState, campaign?: SingleCampaignT) => campaign?.cycleCode,
    (state: AppState, campaign?: SingleCampaignT) => campaign?.standaloneId,
    (lang: string, campaignCode?: string, standaloneId?: StandaloneId) => {
      if (!campaignCode) {
        return undefined;
      }
      if (campaignCode === STANDALONE && standaloneId) {
        return getCampaignGuide(standaloneId.campaignId, lang);
      }
      return getCampaignGuide(campaignCode, lang);
    }
  );

export type SingleCampaignGuideStatus = 'loading' | 'update';

export function useSingleCampaignGuideData(
  campaignId: CampaignId,
  live: boolean
): [SingleCampaignGuideData | undefined, SingleCampaignGuideStatus | undefined] {
  const campaign = useCampaign(campaignId, live);
  const [campaignInvestigators, campaignInvestigatorsLoading] = useCampaignInvestigators(campaign);
  const campaignInvestigatorCodes = useMemo(() => campaign?.investigators, [campaign]);
  const [parallelInvestigators, parallelInvestigatorsLoading] = useParallelInvestigators(campaignInvestigatorCodes)
  const campaignGuideSelector = useMemo(makeCampaignGuideSelector, []);
  const campaignGuide = useSelector((state: AppState) => campaignGuideSelector(state, campaign));

  const campaignState = useCampaignGuideState(campaignId, live);
  const linkedCampaignState = useCampaignGuideState(campaign?.linkedCampaignId, false);
  return useMemo(() => {
    if (!campaign || !campaign.cycleCode || !campaignState || campaignInvestigatorsLoading || parallelInvestigatorsLoading) {
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
      parallelInvestigators: parallelInvestigatorsLoading ? undefined : parallelInvestigators,
    }, undefined];
  }, [campaign, campaignGuide, campaignState, linkedCampaignState,
    campaignInvestigators, campaignInvestigatorsLoading, parallelInvestigators, parallelInvestigatorsLoading]);
}

import {
  StandaloneId,
  STANDALONE,
  CampaignId,
} from '@actions/types';
import { createSelector } from 'reselect';
import CampaignGuide from '@data/scenario/CampaignGuide';
import Card, { CardsMap } from '@data/types/Card';
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

export interface SingleCampaignGuideData {
  campaign: SingleCampaignT;
  campaignGuide: CampaignGuide;
  campaignState: CampaignGuideStateT;
  linkedCampaignState?: CampaignGuideStateT;
  campaignInvestigators: Card[];
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
  investigators: undefined | CardsMap,
  live: boolean
): [SingleCampaignGuideData | undefined, SingleCampaignGuideStatus | undefined] {
  const campaign = useCampaign(campaignId, live);
  const [campaignInvestigators] = useCampaignInvestigators(campaign, investigators);
  const campaignGuideSelector = useMemo(makeCampaignGuideSelector, []);
  const campaignGuide = useSelector((state: AppState) => campaignGuideSelector(state, campaign));

  const campaignState = useCampaignGuideState(campaignId, live);
  const linkedCampaignState = useCampaignGuideState(campaign?.linkedCampaignId, false);
  return useMemo(() => {
    if (!campaign || !campaign.cycleCode || !campaignState) {
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
      campaignInvestigators,
    }, undefined];
  }, [campaign, campaignGuide, campaignState, linkedCampaignState, campaignInvestigators]);
}

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
import { useCampaign, useCampaignGuideState, useCampaignInvestigators, useLiveCampaign, useLiveCampaignGuideState } from '@data/hooks';
import CampaignGuideStateT from '@data/interfaces/CampaignGuideStateT';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';

export interface CampaignGuideReduxData {
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


export function useLiveCampaignGuideReduxData(campaignId: CampaignId, investigators?: CardsMap): CampaignGuideReduxData | undefined {
  const [campaign, campaignInvestigators] = useLiveCampaign(campaignId, investigators);
  const campaignState = useLiveCampaignGuideState(campaignId);
  const linkedCampaignState = useCampaignGuideState(campaign?.linkedCampaignId);

  const campaignGuideSelector = useMemo(makeCampaignGuideSelector, []);
  const campaignGuide = useSelector((state: AppState) => campaignGuideSelector(state, campaign));

  return useMemo(() => {
    if (!campaign) {
      return undefined;
    }
    if (!campaignGuide || !campaignState) {
      return undefined;
    }
    return {
      campaign,
      campaignGuide,
      campaignState,
      linkedCampaignState,
      campaignInvestigators,
    };
  }, [campaign, campaignGuide, campaignState, linkedCampaignState, campaignInvestigators]);
}

export function useCampaignGuideReduxData(campaignId: CampaignId, investigators: undefined | CardsMap): CampaignGuideReduxData | undefined {
  const campaign = useCampaign(campaignId);
  const [campaignInvestigators] = useCampaignInvestigators(campaign, investigators);

  const campaignGuideSelector = useMemo(makeCampaignGuideSelector, []);
  const campaignGuide = useSelector((state: AppState) => campaignGuideSelector(state, campaign));

  const campaignState = useCampaignGuideState(campaignId);
  const linkedCampaignState = useCampaignGuideState(campaign?.linkedCampaignId);

  return useMemo(() => {
    if (!campaign) {
      console.log('No campaign');
      return undefined;
    }
    if (!campaignGuide || !campaignState) {
      console.log('no guide/guide state')
      return undefined;
    }
    console.log(campaignState.numInputs())
    return {
      campaign,
      campaignGuide,
      campaignState,
      linkedCampaignState,
      campaignInvestigators,
    };
  }, [campaign, campaignGuide, campaignState, linkedCampaignState, campaignInvestigators]);
}

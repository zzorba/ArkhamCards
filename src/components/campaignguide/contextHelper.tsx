import {
  Deck,
  SingleCampaign,
  CampaignGuideState,
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
  makeLatestCampaignInvestigatorsSelector,
  getLangPreference,
  makeLatestDecksSelector,
} from '@reducers';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useCampaign, useCampaignGuideState } from '@data/remote/hooks';

export interface CampaignGuideReduxData {
  campaign: SingleCampaign;
  campaignGuide: CampaignGuide;
  campaignState: CampaignGuideState;
  linkedCampaignState?: CampaignGuideState;
  campaignInvestigators: Card[];
  latestDecks: Deck[];
}

const makeCampaignGuideSelector = (): (state: AppState, campaign?: SingleCampaign) => CampaignGuide | undefined =>
  createSelector(
    (state: AppState) => getLangPreference(state),
    (state: AppState, campaign?: SingleCampaign) => campaign?.cycleCode,
    (state: AppState, campaign?: SingleCampaign) => campaign?.standaloneId,
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

export function useCampaignGuideReduxData(campaignId: CampaignId, investigators?: CardsMap): CampaignGuideReduxData | undefined {
  const campaign = useCampaign(campaignId);

  const campaignGuideSelector = useMemo(makeCampaignGuideSelector, []);
  const latestCampaignInvestigatorsSelector = useMemo(makeLatestCampaignInvestigatorsSelector, []);
  const latestDecksSelector = useMemo(makeLatestDecksSelector, []);

  const campaignGuide = useSelector((state: AppState) => campaignGuideSelector(state, campaign));
  const campaignInvestigators = useSelector((state: AppState) => latestCampaignInvestigatorsSelector(state, investigators, campaign));
  const campaignState = useCampaignGuideState(campaignId);
  const latestDecks = useSelector((state: AppState) => latestDecksSelector(state, campaign));

  const linkedCampaignState = useCampaignGuideState(campaign?.linkedCampaignUuid ? { ...campaignId, campaignId: campaign.linkedCampaignUuid } : undefined);
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
      latestDecks,
      campaignInvestigators,
    };
  }, [campaign, campaignGuide, campaignState, linkedCampaignState, latestDecks, campaignInvestigators]);
}

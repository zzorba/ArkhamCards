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
import Card, { CardsMap } from '@data/Card';
import { getCampaignGuide } from '@data/scenario';
import {
  AppState,
  makeCampaignGuideStateSelector,
  makeLatestCampaignInvestigatorsSelector,
  getLangPreference,
  makeCampaignSelector,
  makeLatestDecksSelector,
} from '@reducers';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

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
  const campaignSelector = useMemo(makeCampaignSelector, []);
  const campaignGuideSelector = useMemo(makeCampaignGuideSelector, []);
  const latestCampaignInvestigatorsSelector = useMemo(makeLatestCampaignInvestigatorsSelector, []);
  const campaignGuideStateSelector = useMemo(makeCampaignGuideStateSelector, []);
  const latestDecksSelector = useMemo(makeLatestDecksSelector, []);
  const linkedCampaignStateSelector = useMemo(makeCampaignGuideStateSelector, []);

  const campaign = useSelector((state: AppState) => campaignSelector(state, campaignId.campaignId));
  const campaignGuide = useSelector((state: AppState) => campaignGuideSelector(state, campaign));
  const campaignInvestigators = useSelector((state: AppState) => latestCampaignInvestigatorsSelector(state, investigators, campaign));
  const campaignState = useSelector((state: AppState) => campaignGuideStateSelector(state, campaignId.campaignId));
  const latestDecks = useSelector((state: AppState) => latestDecksSelector(state, campaign));
  const linkedCampaignState = useSelector((state: AppState) => campaign?.linkedCampaignUuid ? linkedCampaignStateSelector(state, campaign.linkedCampaignUuid) : undefined);
  return useMemo(() => {
    if (!campaign) {
      return undefined;
    }
    if (!campaignGuide) {
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

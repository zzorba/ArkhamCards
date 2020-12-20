import { flatMap } from 'lodash';
import {
  Deck,
  SingleCampaign,
  CampaignGuideState,
  DecksMap,
  StandaloneId,
  STANDALONE,
} from '@actions/types';
import { createSelector } from 'reselect';
import CampaignGuide from '@data/scenario/CampaignGuide';
import Card, { CardsMap } from '@data/Card';
import { getCampaignGuide } from '@data/scenario';
import {
  AppState,
  makeCampaignGuideStateSelector,
  makeLatestCampaignInvestigatorsSelector,
  getAllDecks,
  makeLatestCampaignDeckIdsSelector,
  getLangPreference,
  makeCampaignSelector,
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

const makeCampaignGuideSelector = () =>
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

const makeLatestDecksSelector = () =>
  createSelector(
    (state: AppState) => getAllDecks(state),
    makeLatestCampaignDeckIdsSelector(),
    (decks: DecksMap, latestDeckIds: number[]) => flatMap(latestDeckIds, deckId => decks[deckId])
  );


export function useCampaignGuideReduxData(campaignId: number, investigators?: CardsMap): CampaignGuideReduxData | undefined {
  const campaignSelector = useMemo(makeCampaignSelector, []);
  const campaignGuideSelector = useMemo(makeCampaignGuideSelector, []);
  const latestCampaignInvestigatorsSelector = useMemo(makeLatestCampaignInvestigatorsSelector, []);
  const campaignGuideStateSelector = useMemo(makeCampaignGuideStateSelector, []);
  const latestDecksSelector = useMemo(makeLatestDecksSelector, []);
  const linkedCampaignStateSelector = useMemo(makeCampaignGuideStateSelector, []);

  const campaign = useSelector((state: AppState) => campaignSelector(state, campaignId));
  const campaignGuide = useSelector((state: AppState) => campaignGuideSelector(state, campaign));
  const campaignInvestigators = useSelector((state: AppState) => latestCampaignInvestigatorsSelector(state, investigators, campaign));
  const campaignState = useSelector((state: AppState) => campaignGuideStateSelector(state, campaignId));
  const latestDecks = useSelector((state: AppState) => latestDecksSelector(state, campaign));
  const linkedCampaignState = useSelector((state: AppState) => campaign?.linkedCampaignId ? linkedCampaignStateSelector(state, campaign.linkedCampaignId) : undefined);
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

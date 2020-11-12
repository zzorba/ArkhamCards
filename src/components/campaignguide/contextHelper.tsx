import { flatMap } from 'lodash';
import {
  Deck,
  SingleCampaign,
  CampaignGuideState,
  DecksMap,
} from '@actions/types';
import { createSelector } from 'reselect';
import CampaignGuide from '@data/scenario/CampaignGuide';
import Card, { CardsMap } from '@data/Card';
import { getCampaignGuide } from '@data/scenario';
import {
  AppState,
  getCampaign,
  getCampaignGuideState,
  getLatestCampaignInvestigators,
  getAllDecks,
  getLatestCampaignDeckIds,
  getLangPreference,
} from '@reducers';

export interface CampaignGuideReduxData {
  campaign: SingleCampaign;
  campaignGuide: CampaignGuide;
  campaignState: CampaignGuideState;
  linkedCampaignState?: CampaignGuideState;
  campaignInvestigators: Card[];
  latestDecks: Deck[];
}

const campaignGuideCycleCode = (campaign: SingleCampaign) => campaign.cycleCode;
const campaignGuideLangPreference = (campaign: SingleCampaign, state: AppState) => getLangPreference(state);
const selectCampaignGuide = createSelector(campaignGuideCycleCode, campaignGuideLangPreference, getCampaignGuide);

const latestCampaignDecksDecks = (campaign: SingleCampaign, state: AppState) => getAllDecks(state);
const latestCampaignDecksDeckIds = (campaign: SingleCampaign, state: AppState) => getLatestCampaignDeckIds(state, campaign);
const selectLatestDecks = createSelector(
  latestCampaignDecksDecks,
  latestCampaignDecksDeckIds,
  (decks: DecksMap, latestDeckIds: number[]) => flatMap(latestDeckIds, deckId => decks[deckId])
);

const cgrdCampaign = (c: SingleCampaign) => c;
const cgrdCampaignGuide = (c: SingleCampaign, cg: CampaignGuide) => cg;
const cgrdCampaignState = (c: SingleCampaign, cg: CampaignGuide, cs: CampaignGuideState) => cs;
const cgrdLinkedCampaignState = (c: SingleCampaign, cg: CampaignGuide, cs: CampaignGuideState, lcs: CampaignGuideState | undefined) => lcs;
const cgrdLatestDecks = (c: SingleCampaign, cg: CampaignGuide, cs: CampaignGuideState, lcs: CampaignGuideState | undefined, ld: Deck[]) => ld;
const cgrdInvestigators = (c: SingleCampaign, cg: CampaignGuide, cs: CampaignGuideState, lcs: CampaignGuideState | undefined, ld: Deck[], i: Card[]) => i;

const selectCampaignGuideReduxData = createSelector(
  cgrdCampaign,
  cgrdCampaignGuide,
  cgrdCampaignState,
  cgrdLinkedCampaignState,
  cgrdLatestDecks,
  cgrdInvestigators,
  (campaign, campaignGuide, campaignState, linkedCampaignState, latestDecks, campaignInvestigators) => {
    return {
      campaign,
      campaignGuide,
      campaignState,
      linkedCampaignState,
      latestDecks,
      campaignInvestigators,
    };
  }
);

export function campaignGuideReduxData(
  campaignId: number,
  investigators: CardsMap,
  state: AppState
): CampaignGuideReduxData | undefined {
  const campaign = getCampaign(state, campaignId);
  if (!campaign) {
    return undefined;
  }
  const campaignGuide = selectCampaignGuide(campaign, state);
  if (!campaignGuide) {
    return undefined;
  }
  const campaignInvestigators = getLatestCampaignInvestigators(state, investigators, campaign);
  const campaignState = getCampaignGuideState(state, campaignId);
  const latestDecks = selectLatestDecks(campaign, state);
  const linkedCampaignState = campaign.linkedCampaignId ? getCampaignGuideState(state, campaign.linkedCampaignId) : undefined;

  return selectCampaignGuideReduxData(
    campaign,
    campaignGuide,
    campaignState,
    linkedCampaignState,
    latestDecks,
    campaignInvestigators
  );
}

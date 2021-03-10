import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { AppState, MyDecksState, getAllDecks, getMyDecksState, makeCampaignGuideStateSelector, makeCampaignSelector, makeLatestDecksSelector, getDeck } from '@reducers';
import { CampaignId, DeckId, getCampaignLastUpdated, getLastUpdated } from '@actions/types';
import { CampaignGuideStateRedux, LatestDeckRedux, SingleCampaignRedux } from './types';
import CampaignGuideStateT from '@data/interfaces/CampaignGuideStateT';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import LatestDeckT from '@data/interfaces/LatestDeckT';

export function useCampaignGuideFromRedux(campaignId?: CampaignId): CampaignGuideStateT | undefined {
  const campaignGuideStateSelector = useMemo(makeCampaignGuideStateSelector, []);
  const reduxCampaignGuideState = useSelector((state: AppState) => campaignId ? campaignGuideStateSelector(state, campaignId.campaignId) : undefined);
  return useMemo(() => {
    if (!reduxCampaignGuideState || campaignId?.serverId) {
      return undefined;
    }
    return new CampaignGuideStateRedux(reduxCampaignGuideState, new Date(getLastUpdated(reduxCampaignGuideState)));
  }, [reduxCampaignGuideState, campaignId]);
}

export function useCampaignFromRedux(campaignId: CampaignId | undefined): SingleCampaignT | undefined {
  const getCampaign = useMemo(makeCampaignSelector, []);
  const reduxCampaign = useSelector((state: AppState) => campaignId ? getCampaign(state, campaignId.campaignId) : undefined);
  const getLatestCampaignDecks = useMemo(makeLatestDecksSelector, []);
  const latestDecks = useSelector((state: AppState) => getLatestCampaignDecks(state, reduxCampaign));
  return useMemo(() => {
    if (!reduxCampaign || campaignId?.serverId) {
      return undefined;
    }
    return new SingleCampaignRedux(reduxCampaign, latestDecks, getCampaignLastUpdated(reduxCampaign));
  }, [reduxCampaign, latestDecks, campaignId]);
}

export function useLatestDeckRedux(deckId: DeckId): LatestDeckT | undefined {
  const decks = useSelector(getAllDecks);
  const deck = getDeck(decks, deckId);
  const previousDeck = deck?.previousDeckId ? getDeck(decks, deck.previousDeckId) : undefined;
  return useMemo(() => deck && new LatestDeckRedux(deck, previousDeck, undefined), [deck, previousDeck]);
}

export function useMyDecksRedux(): MyDecksState {
  return useSelector(getMyDecksState);
}
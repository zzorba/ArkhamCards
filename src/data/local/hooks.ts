import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { AppState, MyDecksState, getAllDecks, getMyDecksState, makeCampaignGuideStateSelector, makeCampaignSelector, makeLatestDecksSelector, getDeck, getEffectiveDeckId, makeDeckSelector, makeChaosBagResultsSelector } from '@reducers';
import { Campaign, CampaignId, DeckId, getCampaignLastUpdated, getLastUpdated } from '@actions/types';
import { CampaignGuideStateRedux, ChaosBagResultsRedux, LatestDeckRedux, SingleCampaignRedux } from './types';
import CampaignGuideStateT from '@data/interfaces/CampaignGuideStateT';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import ChaosBagResultsT from '@data/interfaces/ChaosBagResultsT';


export function useDeckFromRedux(id: DeckId | undefined, campaignId?: CampaignId): LatestDeckT | undefined {
  const effectiveDeckIdSelector = useCallback((state: AppState) => id !== undefined ? getEffectiveDeckId(state, id) : undefined, [id]);
  const effectiveDeckId = useSelector(effectiveDeckIdSelector);
  const deckSelector = useMemo(makeDeckSelector, []);
  const previousDeckSelector = useMemo(makeDeckSelector, []);
  const theDeck = useSelector((state: AppState) => effectiveDeckId !== undefined ? deckSelector(state, effectiveDeckId) : undefined) || undefined;
  const thePreviousDeck = useSelector((state: AppState) => (theDeck && theDeck.previousDeckId) ? previousDeckSelector(state, theDeck.previousDeckId) : undefined);
  const getCampaign = useMemo(makeCampaignSelector, []);
  const reduxCampaign = useSelector((state: AppState) => campaignId ? getCampaign(state, campaignId.campaignId) : undefined);

  return theDeck ? new LatestDeckRedux(theDeck, thePreviousDeck, reduxCampaign) : undefined;
}

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

export function useLatestDeckRedux(deckId: DeckId, deckToCampaign?: { [uuid: string]: Campaign }): LatestDeckT | undefined {
  const decks = useSelector(getAllDecks);
  const deck = getDeck(decks, deckId);
  const previousDeck = deck?.previousDeckId ? getDeck(decks, deck.previousDeckId) : undefined;
  return useMemo(() => {
    return deck && new LatestDeckRedux(deck, previousDeck, deckToCampaign?.[deckId.uuid]);
  }, [deckId.uuid, deckToCampaign, deck, previousDeck]);
}

export function useChaosBagResultsRedux({ campaignId }: CampaignId): ChaosBagResultsT {
  const chaosBagResultsSelector = useMemo(makeChaosBagResultsSelector, []);
  const chaosBagResults = useSelector((state: AppState) => chaosBagResultsSelector(state, campaignId));
  return useMemo(() => {
    return new ChaosBagResultsRedux(chaosBagResults);
  }, [chaosBagResults]);
}

export function useMyDecksRedux(): MyDecksState {
  return useSelector(getMyDecksState);
}
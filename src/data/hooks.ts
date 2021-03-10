import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { flatMap, concat, sortBy, reverse } from 'lodash';

import { getCampaigns, MyDecksState } from '@reducers';
import { Campaign, CampaignId, DeckId } from '@actions/types';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import Card, { CardsMap } from '@data/types/Card';
import { useMyDecksRemote, useCachedCampaignRemote, useLiveCampaignGuideStateRemote, useLiveCampaignRemote, useRemoteCampaigns, useCachedCampaignGuideStateRemote, useLatestDeckRemote } from '@data/remote/hooks';
import CampaignGuideStateT from './interfaces/CampaignGuideStateT';
import { useCampaignFromRedux, useCampaignGuideFromRedux, useLatestDeckRedux, useMyDecksRedux } from './local/hooks';
import LatestDeckT from './interfaces/LatestDeckT';

export function useCampaigns(): [MiniCampaignT[], boolean, undefined | (() => void)] {
  const campaigns = useSelector(getCampaigns);
  const [serverCampaigns, loading, refresh] = useRemoteCampaigns();

  const allCampaigns = useMemo(() => {
    return sortBy(
      concat(
        campaigns,
        serverCampaigns
      ),
      c => -c.updatedAt.getTime());
  }, [campaigns, serverCampaigns]);
  return [allCampaigns, loading, refresh];
}

export function useLiveCampaignGuideState(campaignId: undefined | CampaignId): CampaignGuideStateT | undefined {
  const reduxState = useCampaignGuideFromRedux(campaignId);
  const remoteState = useLiveCampaignGuideStateRemote(campaignId);
  return useMemo(() => {
    if (!campaignId) {
      return undefined;
    }
    if (!campaignId.serverId) {
      return reduxState;
    }
    return remoteState;
  }, [campaignId, reduxState, remoteState]);
}

export function useCampaignGuideState(campaignId?: CampaignId): CampaignGuideStateT | undefined {
  const reduxGuide = useCampaignGuideFromRedux(campaignId);
  const remoteGuide = useCachedCampaignGuideStateRemote(campaignId);
  return useMemo(() => {
    if (!campaignId) {
      return undefined;
    }
    if (!campaignId.serverId) {
      return reduxGuide;
    }
    return remoteGuide;
  }, [campaignId, reduxGuide, remoteGuide]);
}

export function useCampaign(campaignId: CampaignId | undefined): SingleCampaignT | undefined {
  const reduxCampaign = useCampaignFromRedux(campaignId);
  const remoteCampaign = useCachedCampaignRemote(campaignId);
  return useMemo(() => {
    if (!campaignId) {
      return undefined;
    }
    if (!campaignId.serverId) {
      return reduxCampaign;
    }
    return remoteCampaign;
  }, [reduxCampaign, remoteCampaign, campaignId]);
}


export function useLiveCampaign(
  campaignId: undefined | CampaignId,
  investigators: undefined | CardsMap,
): [SingleCampaignT | undefined, Card[], boolean] {
  const reduxCampaign = useCampaignFromRedux(campaignId);
  const remoteCampaign = useLiveCampaignRemote(campaignId);
  const campaign: SingleCampaignT | undefined = useMemo(() => {
    if (!campaignId) {
      return undefined;
    }
    if (!campaignId?.serverId) {
      return reduxCampaign;
    }
    return remoteCampaign;
  }, [campaignId, reduxCampaign, remoteCampaign]);
  const [allInvestigators, loading] = useCampaignInvestigators(campaign, investigators);
  return [campaign, allInvestigators, loading];
}

const NO_INVESTIGATORS: Card[] = [];
export function useCampaignInvestigators(campaign: undefined | SingleCampaignT, investigators: CardsMap | undefined): [Card[], boolean] {
  const campaignInvestigators = campaign?.investigators;
  return useMemo(() => {
    if (!campaignInvestigators || !investigators) {
      return [NO_INVESTIGATORS, true];
    }
    return [flatMap(campaignInvestigators, i => investigators[i] || []), false];
  }, [campaignInvestigators, investigators]);
}


export function useMyDecks(): [MyDecksState, () => void] {
  const { myDecks, error, refreshing, myDecksUpdated } = useMyDecksRedux();
  const [remoteMyDecks, remoteRefreshing, refresh] = useMyDecksRemote();
  const mergedMyDecks = useMemo(() => {
    return reverse(sortBy(
      [...myDecks, ...remoteMyDecks],
      r => r.date_update
    ));
  }, [myDecks, remoteMyDecks]);
  return [{
    myDecks: mergedMyDecks,
    error,
    refreshing: refreshing || remoteRefreshing,
    myDecksUpdated,
  }, refresh];
}

export function useLatestDeck(deckId: DeckId, deckToCampaign?: { [uuid: string]: Campaign }): LatestDeckT | undefined {
  const reduxDeck = useLatestDeckRedux(deckId, deckToCampaign);
  const remoteDeck = useLatestDeckRemote(deckId);
  return deckId?.serverId ? remoteDeck : reduxDeck;
}
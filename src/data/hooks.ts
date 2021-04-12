import { useCallback, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filter, flatMap, concat, sortBy, reverse } from 'lodash';

import { getCampaigns, MyDecksState } from '@reducers';
import { Campaign, CampaignId, DeckId } from '@actions/types';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import Card, { CardsMap } from '@data/types/Card';
import { useMyDecksRemote, useRemoteCampaigns, useCampaignGuideStateRemote, useLatestDeckRemote, useCampaignRemote, useDeckFromRemote, useCampaignDeckFromRemote } from '@data/remote/hooks';
import CampaignGuideStateT from './interfaces/CampaignGuideStateT';
import { useCampaignFromRedux, useCampaignGuideFromRedux, useDeckFromRedux, useLatestDeckRedux, useMyDecksRedux } from './local/hooks';
import LatestDeckT from './interfaces/LatestDeckT';
import { refreshMyDecks } from '@actions';
import { DeckActions } from './remote/decks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import MiniDeckT from './interfaces/MiniDeckT';

export function useCampaigns(): [MiniCampaignT[], boolean, undefined | (() => void)] {
  const { user } = useContext(ArkhamCardsAuthContext);
  const campaigns = useSelector(getCampaigns);
  const [serverCampaigns, loading, refresh] = useRemoteCampaigns();
  const allCampaigns = useMemo(() => {
    const toSort = user ? concat(campaigns, serverCampaigns) : campaigns;
    return sortBy(toSort, c => -c.updatedAt.getTime());
  }, [campaigns, serverCampaigns, user]);
  return [allCampaigns, !!user && loading, refresh];
}

export function useCampaignGuideState(campaignId?: CampaignId, live?: boolean): CampaignGuideStateT | undefined {
  const reduxGuide = useCampaignGuideFromRedux(campaignId);
  const remoteGuide = useCampaignGuideStateRemote(campaignId, live);
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

export function useCampaign(campaignId: CampaignId | undefined, live?: boolean): SingleCampaignT | undefined {
  const reduxCampaign = useCampaignFromRedux(campaignId);
  const remoteCampaign = useCampaignRemote(campaignId, live);
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


export function useCampaignDeck(id: DeckId | undefined, campaignId: CampaignId | undefined): LatestDeckT | undefined {
  const reduxDeck = useDeckFromRedux(id, campaignId);
  const remoteDeck = useCampaignDeckFromRemote(id, campaignId);
  return useMemo(() => {
    if (!campaignId?.serverId || reduxDeck) {
      return reduxDeck;
    }
    return remoteDeck;
  }, [remoteDeck, reduxDeck, campaignId]);
}

export function useDeck(id: DeckId | undefined, fetch?: boolean): LatestDeckT | undefined {
  const reduxDeck = useDeckFromRedux(id);
  const remoteDeck = useDeckFromRemote(id, fetch || false);
  return useMemo(() => {
    if (!id?.serverId || reduxDeck) {
      return reduxDeck;
    }
    return remoteDeck;
  }, [remoteDeck, reduxDeck, id]);
}

export function useMyDecks(deckActions: DeckActions): [MyDecksState, () => void] {
  const dispatch = useDispatch();
  const { user } = useContext(ArkhamCardsAuthContext);
  const { myDecks, error, refreshing, myDecksUpdated } = useMyDecksRedux();
  const [remoteMyDecks, remoteRefreshing, refreshRemoteDecks] = useMyDecksRemote(deckActions);
  const onRefresh = useCallback(() => {
    if (!refreshing) {
      refreshRemoteDecks();
      dispatch(refreshMyDecks(user, deckActions));
    }
  }, [dispatch, user, deckActions, refreshing, refreshRemoteDecks]);
  const mergedMyDecks = useMemo(() => {
    if (!user) {
      return myDecks;
    }
    const remoteDeckLocalIds = new Set(flatMap(remoteMyDecks, d => d.id.local ? d.id.uuid : []));
    const remoteDeckArkhamDbIds = new Set(flatMap(remoteMyDecks, d => d.id.local ? [] : d.id.id));
    const filteredMyDecks = filter(myDecks, d => {
      return d.id.local ? !remoteDeckLocalIds.has(d.id.uuid) : remoteDeckArkhamDbIds.has(d.id.id);
    });
    return reverse(sortBy(
      [...filteredMyDecks, ...remoteMyDecks],
      r => r.date_update
    ));
  }, [myDecks, remoteMyDecks, user]);
  return [{
    myDecks: mergedMyDecks,
    error,
    refreshing: refreshing || (!!user && remoteRefreshing),
    myDecksUpdated,
  }, onRefresh];
}

export function useLatestDeck(deckId: MiniDeckT, deckToCampaign?: { [uuid: string]: Campaign }): LatestDeckT | undefined {
  const reduxDeck = useLatestDeckRedux(deckId.id, deckToCampaign);
  const remoteDeck = useLatestDeckRemote(deckId.id, deckId.campaign_id);
  return deckId.id.serverId ? remoteDeck : reduxDeck;
}
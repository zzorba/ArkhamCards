import { useCallback, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { flatMap, concat, sortBy, reverse } from 'lodash';

import { getCampaigns, MyDecksState } from '@reducers';
import { Campaign, CampaignId, DeckId } from '@actions/types';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import Card, { CardsMap } from '@data/types/Card';
import { useMyDecksRemote, useRemoteCampaigns, useCampaignGuideStateRemote, useLatestDeckRemote, useCampaignRemote } from '@data/remote/hooks';
import CampaignGuideStateT from './interfaces/CampaignGuideStateT';
import { useCampaignFromRedux, useCampaignGuideFromRedux, useLatestDeckRedux, useMyDecksRedux } from './local/hooks';
import LatestDeckT from './interfaces/LatestDeckT';
import { refreshMyDecks } from '@actions';
import { DeckActions } from './remote/decks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';

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
  }, onRefresh];
}

export function useLatestDeck(deckId: DeckId, deckToCampaign?: { [uuid: string]: Campaign }): LatestDeckT | undefined {
  const reduxDeck = useLatestDeckRedux(deckId, deckToCampaign);
  const remoteDeck = useLatestDeckRemote(deckId);
  return deckId?.serverId ? remoteDeck : reduxDeck;
}
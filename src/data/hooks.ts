import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filter, flatMap, concat, map, sortBy, reverse, uniq, forEach } from 'lodash';

import {
  AppState,
  getCampaigns,
  MyDecksState,
  makeCampaignChaosBagSelector,
} from '@reducers';
import { Campaign, CampaignId, DeckId } from '@actions/types';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import ChaosBagResultsT from '@data/interfaces/ChaosBagResultsT';
import {
  useMyDecksRemote,
  useRemoteCampaigns,
  useCampaignGuideStateRemote,
  useLatestDeckRemote,
  useCampaignRemote,
  useDeckFromRemote,
  useCampaignDeckFromRemote,
  useChaosBagResultsFromRemote,
  useDeckHistoryRemote,
} from '@data/remote/hooks';
import CampaignGuideStateT from './interfaces/CampaignGuideStateT';
import {
  useCampaignFromRedux,
  useCampaignGuideFromRedux,
  useChaosBagResultsRedux,
  useDeckFromRedux,
  useDeckHistoryRedux,
  useLatestDeckRedux,
  useMyDecksRedux,
} from './local/hooks';
import LatestDeckT from './interfaces/LatestDeckT';
import { refreshMyDecks } from '@actions';
import { DeckActions, syncCampaignDecksFromArkhamDB } from './remote/decks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import MiniDeckT from './interfaces/MiniDeckT';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { useInvestigatorSets, useParallelInvestigators, usePlayerCards } from '@components/core/hooks';
import { ChaosBag } from '@app_constants';
import { CampaignInvestigator } from './scenario/GuidedCampaignLog';
import Card from './types/Card';
import InvestigatorSet from './types/InvestigatorSet';
import DatabaseContext from './sqlite/DatabaseContext';
import { PlayerCardContext } from './sqlite/PlayerCardContext';
import { AGATHA_MYSTIC_CODE, AGATHA_SEEKER_CODE } from './deck/specialCards';

export function useCampaigns(): [
  MiniCampaignT[],
  boolean,
  undefined | (() => void)
  ] {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const { investigatorSets } = useContext(PlayerCardContext);
  const selector = useCallback((state: AppState) => getCampaigns(state, investigatorSets), [investigatorSets]);
  const campaigns = useSelector(selector);
  const [serverCampaigns, loading, refresh] = useRemoteCampaigns();
  const allCampaigns = useMemo(() => {
    const serverIds = new Set(map(serverCampaigns, (c) => c.uuid));
    const toSort = userId
      ? concat(
        filter(campaigns, (c) => !serverIds.has(c.uuid)),
        serverCampaigns
      )
      : campaigns;
    return sortBy(toSort, (c) => -c.updatedAt.getTime());
  }, [campaigns, serverCampaigns, userId]);
  return [allCampaigns, loading, refresh];
}

/**
 * Hook to fetch ALL InvestigatorSet objects from the database.
 * InvestigatorSets are small metadata objects (~100 total), so fetching all is efficient.
 * This allows campaign constructors to work synchronously with all the data they need.
 */
export function useAllInvestigatorSets(): [InvestigatorSet[], boolean] {
  const { db } = useContext(DatabaseContext);
  const [investigatorSets, setInvestigatorSets] = useState<InvestigatorSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;

    async function fetchAllInvestigatorSets() {
      try {
        const sets = await db.getAllInvestigatorSets();
        if (!canceled) {
          setInvestigatorSets(sets);
          setLoading(false);
        }
      } catch (e) {
        console.log('Error fetching all investigator sets:', e);
        if (!canceled) {
          setInvestigatorSets([]);
          setLoading(false);
        }
      }
    }

    fetchAllInvestigatorSets();

    return () => {
      canceled = true;
    };
  }, [db]);

  return [investigatorSets, loading];
}

export function useCampaignGuideState(
  campaignId?: CampaignId,
  live?: boolean
): CampaignGuideStateT | undefined {
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

export function useCampaign(
  campaignId: CampaignId | undefined,
  live?: boolean
): SingleCampaignT | undefined {
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

export function useCampaignInvestigators(
  campaign: undefined | SingleCampaignT
): [CampaignInvestigator[], Card[], false] | [undefined, undefined, true] {
  const campaignInvestigators = campaign?.investigators;
  const decks = campaign?.latestDecks();
  const allInvestigatorCodes = useMemo(() => uniq([...campaign?.investigators ?? [], ...flatMap(Object.values(campaign?.investigatorPrintings ?? {}), x => x ?? [])]), [campaign?.investigatorPrintings, campaign?.investigators]);

  // Fetch investigator sets for all investigator codes to understand reprints/alternates
  const [investigatorSets, investigatorSetsLoading] = useInvestigatorSets(allInvestigatorCodes);

  // Expand codes to include all alternate codes from investigatorSets
  const expandedInvestigatorCodes = useMemo(() => {
    const codes = new Set(allInvestigatorCodes);
    forEach(allInvestigatorCodes, code => {
      const alternates = investigatorSets[code];
      if (alternates) {
        forEach(alternates, alt => codes.add(alt));
      }
    });
    return Array.from(codes);
  }, [allInvestigatorCodes, investigatorSets]);

  const [allInvestigators] = usePlayerCards(expandedInvestigatorCodes, false);
  const campaignInvestigatorCodes = useMemo(() => campaign?.investigators, [campaign]);
  const [parallelInvestigators, parallelInvestigatorsLoading] = useParallelInvestigators(campaignInvestigatorCodes)
  const investigatorPrintings = campaign?.investigatorPrintings;
  return useMemo(() => {
    if (!campaignInvestigators || !allInvestigators || parallelInvestigatorsLoading || investigatorSetsLoading) {
      return [undefined, undefined, true];
    }
    const result: CampaignInvestigator[] = flatMap(campaignInvestigators, (code) => {
      // Find deck that matches this investigator code
      // The deck.investigator might be a printing code, so we need to resolve it to canonical
      const deck = decks?.find((deck) => {
        if (deck.investigator === code) {
          return true;
        }
        // Check if the deck's investigator resolves to the same canonical code
        const deckInvestigatorSet = investigatorSets[deck.investigator];
        const canonicalDeckCode = deckInvestigatorSet?.[0] ?? deck.investigator;

        // Special case: Allow Agatha printings to match canonical or vice versa
        if (code === AGATHA_MYSTIC_CODE || code === AGATHA_SEEKER_CODE) {
          // If campaign code is an Agatha printing, allow it to match canonical or same printing
          return canonicalDeckCode === code || deck.investigator === code;
        }
        if (deck.investigator === AGATHA_MYSTIC_CODE || deck.investigator === AGATHA_SEEKER_CODE) {
          // If deck is an Agatha printing, allow it to match canonical or same printing
          return canonicalDeckCode === code || deck.investigator === code;
        }

        return canonicalDeckCode === code;
      });
      const card_code = deck?.deck.meta?.alternate_front ?? investigatorPrintings?.[code] ?? code;
      const card = parallelInvestigators.find(c => c.code === card_code) ?? allInvestigators[card_code] ?? allInvestigators[code];
      if (!card) {
        return [];
      }
      return {
        code,
        card,
        alternate_code: card.alternate_of_code ? card.code : undefined,
      };
    });
    return [
      result,
      parallelInvestigators,
      false,
    ];
  }, [decks, investigatorPrintings, campaignInvestigators, parallelInvestigators, parallelInvestigatorsLoading, allInvestigators, investigatorSetsLoading, investigatorSets]);
}

function shouldUseReduxDeck(
  id: DeckId,
  userId: string | undefined,
  reduxDeck: LatestDeckT | undefined,
  remoteDeck: LatestDeckT | undefined
) {
  return (
    !id.local &&
    reduxDeck &&
    (!userId ||
      !remoteDeck ||
      !remoteDeck.owner ||
      userId === remoteDeck.owner.id)
  );
}

export function useCampaignDeck(
  id: DeckId | undefined,
  campaignId: CampaignId | undefined
): LatestDeckT | undefined {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const reduxDeck = useDeckFromRedux(id, campaignId);
  const remoteDeck = useCampaignDeckFromRemote(id, campaignId);
  return useMemo(() => {
    if (!id) {
      return undefined;
    }
    if (
      !campaignId?.serverId ||
      shouldUseReduxDeck(id, userId, reduxDeck, remoteDeck)
    ) {
      return reduxDeck;
    }
    return remoteDeck;
  }, [remoteDeck, reduxDeck, userId, campaignId, id]);
}

export function useDeck(
  id: DeckId | undefined,
  fetch?: boolean
): LatestDeckT | undefined {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const reduxDeck = useDeckFromRedux(id);
  const remoteDeck = useDeckFromRemote(id, fetch || false);
  return useMemo(() => {
    if (!id) {
      return undefined;
    }
    if (!id.serverId || shouldUseReduxDeck(id, userId, reduxDeck, remoteDeck)) {
      // Server/ArkhamDB decks should use the local cache.
      return reduxDeck;
    }
    return remoteDeck;
  }, [remoteDeck, reduxDeck, userId, id]);
}

export function useNonGuideChaosBag(id: CampaignId): ChaosBag {
  const chaosBagSelector = useMemo(makeCampaignChaosBagSelector, []);
  const reduxData = useSelector((state: AppState) =>
    chaosBagSelector(state, id.campaignId)
  );
  const remoteData = useCampaign(id);

  return useMemo(() => {
    if (!id.serverId) {
      return reduxData;
    }
    return remoteData?.chaosBag ?? reduxData;
  }, [id, remoteData, reduxData]);
}

export function useChaosBagResults(id: CampaignId): ChaosBagResultsT {
  const reduxData = useChaosBagResultsRedux(id);
  const remoteData = useChaosBagResultsFromRemote(id);
  return useMemo(() => {
    if (!id.serverId) {
      return reduxData;
    }
    return remoteData || reduxData;
  }, [id, remoteData, reduxData]);
}

export function useArkhamDbError(): string | undefined {
  const { error, refreshing } = useMyDecksRedux();
  return refreshing ? undefined : error;
}

export function useMyDecks(
  deckActions: DeckActions
): [MyDecksState, (cacheArkhamDb: boolean) => Promise<void>] {
  const dispatch: ThunkDispatch<AppState, unknown, Action> = useDispatch();
  const { userId, arkhamDb } = useContext(ArkhamCardsAuthContext);
  const { myDecks, error, refreshing, myDecksUpdated } = useMyDecksRedux();
  const [remoteMyDecks, remoteRefreshing, refreshRemoteDecks] =
    useMyDecksRemote(deckActions);
  const onRefresh = useCallback(
    async(cacheArkhamDb: boolean) => {
      if (!refreshing) {
        const remoteDecksPromise = userId && refreshRemoteDecks();
        const arkhamDbDeckPromise =
          arkhamDb && dispatch(refreshMyDecks(cacheArkhamDb));
        if (remoteDecksPromise && arkhamDbDeckPromise) {
          try {
            const remoteDecks = await remoteDecksPromise;
            const arkhamDbDecks = await arkhamDbDeckPromise;
            syncCampaignDecksFromArkhamDB(
              arkhamDbDecks,
              remoteDecks,
              deckActions
            );
          } catch (error) {
            console.log('Could not sync decks at the moment');
            console.log(error);
          }
        }
      }
    },
    [dispatch, userId, arkhamDb, deckActions, refreshing, refreshRemoteDecks]
  );
  const mergedMyDecks = useMemo(() => {
    if (!userId) {
      return myDecks;
    }
    const remoteDeckLocalIds = new Set(
      flatMap(remoteMyDecks, (d) => (d.id.local ? d.id.uuid : []))
    );
    const remoteDeckArkhamDbIds = new Set(
      flatMap(remoteMyDecks, (d) => (d.id.local ? [] : d.id.id))
    );
    const filteredMyDecks = filter(myDecks, (d) => {
      return !(d.id.local
        ? remoteDeckLocalIds.has(d.id.uuid)
        : remoteDeckArkhamDbIds.has(d.id.id));
    });
    return reverse(
      sortBy([...filteredMyDecks, ...remoteMyDecks], (r) => r.date_update)
    );
  }, [myDecks, remoteMyDecks, userId]);
  return [
    {
      myDecks: mergedMyDecks,
      error: refreshing ? undefined : error,
      refreshing: refreshing || (!!userId && remoteRefreshing),
      myDecksUpdated,
    },
    onRefresh,
  ];
}

export function useLatestDeck(
  deckId: MiniDeckT,
  deckToCampaign?: { [uuid: string]: Campaign }
): LatestDeckT | undefined {
  const reduxDeck = useLatestDeckRedux(deckId.id, deckToCampaign);
  const remoteDeck = useLatestDeckRemote(deckId.id, deckId.campaign_id);
  return deckId.id.serverId ? remoteDeck : reduxDeck;
}

export function useDeckHistory(
  id: DeckId,
  investigator: string,
  campaign: MiniCampaignT | undefined
): [LatestDeckT[] | undefined, boolean, undefined | (() => Promise<void>)] {
  const reduxDeck = useDeckHistoryRedux(id);
  const [remoteDeck, loading, refresh] = useDeckHistoryRemote(
    id,
    investigator,
    campaign
  );
  if (!id.serverId || (!id.local && reduxDeck.length)) {
    return [reduxDeck, false, undefined];
  }
  return [remoteDeck, loading, refresh];
}

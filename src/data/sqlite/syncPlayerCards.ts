import { forEach, groupBy, mapValues, sortBy, uniqBy } from 'lodash';

import Card, { CardsMap } from '../types/Card';
import TabooSet from '../types/TabooSet';
import Database from './Database';
import { PlayerCards } from './DatabaseContext';
import { INVESTIGATOR_CARDS_QUERY, SYNC_CARDS_QUERY } from './query';

export interface InvestigatorCardState {
  [tabooSet: string]: CardsMap;
}
export interface PlayerCardState {
  playerCards: {
    [tabooSet: string]: PlayerCards;
  };
  tabooSets: TabooSet[];
}

const VERBOSE = false;
export default async function syncPlayerCards(
  db: Database,
  updateInvestigatorContext: (state: InvestigatorCardState) => void,
  updateContext: (state: PlayerCardState) => void
) {
  try {
    const start = new Date();
    const tabooSetsP = db.tabooSets().then(ts => ts.createQueryBuilder().getMany());
    const investigatorsP = db.cardsQuery().then(qb => qb.where(INVESTIGATOR_CARDS_QUERY).getMany());
    const cardsP = db.cardsQuery().then(qb => qb.where(SYNC_CARDS_QUERY).getMany());
    const investigators = await investigatorsP;
    VERBOSE && console.log(`Fetched investigators in: ${(new Date()).getTime() - start.getTime()}`);
    const investigatorsByTaboo = mapValues(
      groupBy(investigators, card => card.taboo_set_id || 0),
      allCards => {
        const investigators: CardsMap = {};
        forEach(allCards, card => {
          investigators[card.code] = card;
        });
        return investigators;
      }
    );
    const investigatorCards: {
      [key: string]: CardsMap;
    } = {};
    forEach(investigatorsByTaboo, (tabooSet, tabooSetId) => {
      if (tabooSetId === '0') {
        investigatorCards[tabooSetId] = tabooSet;
      } else {
        const baseTaboos = investigatorsByTaboo['0'];
        investigatorCards[tabooSetId] = {
          ...baseTaboos,
          ...tabooSet,
        };
      }
    });
    updateInvestigatorContext(investigatorCards);

    const cards = await cardsP;
    VERBOSE && console.log(`Fetched player cards in: ${(new Date()).getTime() - start.getTime()}`);
    const playerCards: {
      [key: string]: PlayerCards;
    } = {};
    const cardsByTaboo = mapValues(
      groupBy(cards, card => card.taboo_set_id || 0),
      allCards => {
        const investigators: CardsMap = {};
        const cards: CardsMap = {};
        const weaknessCards: Card[] = [];
        forEach(allCards, card => {
          cards[card.code] = card;
          if (card.type_code === 'investigator') {
            investigators[card.code] = card;
          }
          if (card.isBasicWeakness() && !card.duplicate_of_code) {
            weaknessCards.push(card);
          }
        });
        return {
          investigators,
          cards,
          weaknessCards,
        };
      }
    );
    forEach(cardsByTaboo, (tabooSet, tabooSetId) => {
      if (tabooSetId === '0') {
        playerCards[tabooSetId] = tabooSet;
      } else {
        const baseTaboos = cardsByTaboo['0'];
        playerCards[tabooSetId] = {
          investigators: {
            ...baseTaboos.investigators,
            ...tabooSet.investigators,
          },
          cards: {
            ...baseTaboos.cards,
            ...tabooSet.cards,
          },
          weaknessCards: sortBy(
            uniqBy(
              [...tabooSet.weaknessCards, ...baseTaboos.weaknessCards],
              card => card.code
            ),
            card => card.name
          ),
        };
      }
    });
    const tabooSets = await tabooSetsP;
    updateContext({
      playerCards,
      tabooSets,
    });
  } catch(e) {
    console.log(`Error fetching player cards: ${e}`);
  }
}
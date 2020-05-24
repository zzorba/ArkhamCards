import { forEach, groupBy, mapValues } from 'lodash';

import { CardsMap } from './Card';
import TabooSet from './TabooSet';
import Database from './Database';
import { PlayerCards } from './DatabaseContext';
import { PLAYER_CARDS_QUERY } from './query';

export interface PlayerCardState {
  playerCards: {
    [tabooSet: string]: PlayerCards;
  };
  tabooSets: TabooSet[];
}

export default async function syncPlayerCards(
  db: Database,
  updateContext: (state: PlayerCardState) => void
) {
  console.log('Syncing Player Cards')
  const tabooSets = await (await db.tabooSets()).createQueryBuilder().getMany();
  const qb = await db.cardsQuery();
  const cards = await qb.where(PLAYER_CARDS_QUERY).getMany();
  console.log(`Player Cards Loaded: ${cards.length}`);
  const playerCards: {
    [key: string]: PlayerCards
  } = {};
  const cardsByTaboo = mapValues(
    groupBy(cards, card => card.taboo_set_id || 0),
    allCards => {
      const investigators: CardsMap = {};
      const cards: CardsMap = {};
      forEach(allCards, card => {
        cards[card.code] = card;
        if (card.type_code === 'investigator') {
          investigators[card.code] = card;
        }
      });
      return {
        investigators,
        cards,
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
      };
    }
  });
  updateContext({
    playerCards,
    tabooSets,
  });
}
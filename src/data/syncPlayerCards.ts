import { forEach, groupBy, mapValues, sortBy, uniqBy } from 'lodash';

import Card, { CardsMap } from './Card';
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
  try {
    const tabooSets = await (await db.tabooSets()).createQueryBuilder().getMany();
    const qb = await db.cardsQuery();
    const cards = await qb.where(PLAYER_CARDS_QUERY).getMany();
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
          if (card.isBasicWeakness()) {
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
    updateContext({
      playerCards,
      tabooSets,
    });
  } catch(e) {
    console.log(`Error fetching player cards: ${e}`);
  }
}
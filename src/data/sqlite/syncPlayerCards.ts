import { forEach, groupBy, mapValues } from 'lodash';

import { CardsMap } from '../types/Card';
import TabooSet from '../types/TabooSet';
import Database from './Database';
import { PlayerCards } from './DatabaseContext';
import { BASIC_WEAKNESS_QUERY_WITH_RBW } from './query';

export interface PlayerCardState {
  playerCards: {
    [tabooSet: string]: PlayerCards;
  };
  tabooSets: TabooSet[];
}

const VERBOSE = false;
export default async function syncPlayerCards(
  db: Database,
  updateContext: (state: PlayerCardState) => void
) {
  try {
    const start = new Date();
    const tabooSetsP = db.tabooSets().then(ts => ts.createQueryBuilder().setFindOptions({ loadEagerRelations: false }).getMany());
    const weaknessCardsP = db.cardsQuery().then(qb => qb.where(BASIC_WEAKNESS_QUERY_WITH_RBW).getMany());

    const cards = await weaknessCardsP;
    VERBOSE && console.log(`***********\nFetched weakness cards in: ${(new Date()).getTime() - start.getTime()}\n**************`);
    const playerCards: {
      [key: string]: PlayerCards;
    } = {};
    const cardsByTaboo = mapValues(
      groupBy(cards, card => card.taboo_set_id || 0),
      allCards => {
        const weaknessCards: CardsMap = {};
        forEach(allCards, card => {
          if (card.isBasicWeakness() && !card.duplicate_of_code) {
            weaknessCards[card.code] = card;
          }
        });
        return {
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
          weaknessCards: {
            ...baseTaboos.weaknessCards,
            ...tabooSet.weaknessCards,
          },
        };
      }
    });
    const tabooSets = await tabooSetsP;
    forEach(tabooSets, tabooSet => {
      if (!playerCards[tabooSet.id]) {
        playerCards[tabooSet.id] = playerCards['0'];
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
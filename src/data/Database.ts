import { findIndex, forEach } from 'lodash';
import { createConnection, Connection, Repository, EntitySubscriberInterface, SelectQueryBuilder } from 'typeorm/browser';

import Card from './Card';
import EncounterSet from './EncounterSet';
import FaqEntry from './FaqEntry';
import TabooSet from './TabooSet'
import { QueryClause, QuerySort } from './types';
import { tabooSetQuery } from './query';

export default class Database {
  connectionP: Promise<Connection>;

  constructor() {

    this.connectionP = createConnection({
      type: 'react-native',
      database: 'arkham',
      location: 'default',
      logging: [
        'error',
        //'query',
        'schema',
      ],
      synchronize: true,
      entities: [
        Card,
        EncounterSet,
        FaqEntry,
        TabooSet,
      ]
    });
  }

  async cards(): Promise<Repository<Card>> {
    const connection = await this.connectionP;
    return connection.getRepository(Card);
  }

  async cardsQuery(): Promise<SelectQueryBuilder<Card>> {
    const cards = await this.cards();
    return cards.createQueryBuilder('c').leftJoin('c.linked_card', 'linked_card');
  }

  async tabooSets(): Promise<Repository<TabooSet>> {
    const connection = await this.connectionP;
    return connection.getRepository(TabooSet);
  }

  async faqEntries(): Promise<Repository<FaqEntry>> {
    const connection = await this.connectionP;
    return connection.getRepository(FaqEntry);
  }

  async encounterSets(): Promise<Repository<EncounterSet>> {
    const connection = await this.connectionP;
    return connection.getRepository(EncounterSet);
  }

  async addSubscriber(subscriber: EntitySubscriberInterface) {
    const connection = await this.connectionP;
    connection.subscribers.push(subscriber);
  }

  async removeSubscriber(subscriber: EntitySubscriberInterface) {
    const connection = await this.connectionP;
    const index = findIndex(connection.subscribers, sub => sub === subscriber);
    if (index !== -1) {
      connection.subscribers.splice(index, 1);
    }
  }

  async getCards(
    query: QueryClause[],
    tabooSetId?: number,
    sort?: QuerySort[],
    orQuery?: QueryClause[],
  ): Promise<Card[]> {
    const cardsQuery = await this.applyCardsQuery(query, tabooSetId, sort, orQuery);
    return await cardsQuery.getMany();
  }

  async getCard(
    query: QueryClause[],
    tabooSetId?: number,
    sort?: QuerySort[],
  ): Promise<Card | undefined> {
    const cardsQuery = await this.applyCardsQuery(query, tabooSetId, sort);
    return await cardsQuery.getOne();
  }

  async getCardCount(
    query: QueryClause[],
    tabooSetId?: number
  ): Promise<number> {
    const cardsQuery = await this.applyCardsQuery(query, tabooSetId);
    return await cardsQuery.getCount();
  }


private async applyCardsQuery(
  query: QueryClause[],
  tabooSetId?: number,
  sort?: QuerySort[],
  orQuery?: QueryClause[]
): Promise<SelectQueryBuilder<Card>> {
  let cardsQuery = await this.cardsQuery();
  if (query.length) {
    const [firstQuery, ...restQueries] = query;
    cardsQuery = cardsQuery.where(firstQuery.q, firstQuery.params);
    forEach(restQueries, ({ q, params}) => {
      cardsQuery = cardsQuery.andWhere(q, params);
    });
    cardsQuery = cardsQuery.andWhere(tabooSetQuery(tabooSetId));
  }
  if (orQuery && orQuery.length) {
    cardsQuery = cardsQuery.orWhere(tabooSetQuery(tabooSetId));
    forEach(orQuery, ({ q, params}) => {
      cardsQuery = cardsQuery.andWhere(q, params);
    });
  }
  if (sort && sort.length) {
    const [firstSort, ...restSorts] = sort;
    cardsQuery = cardsQuery.orderBy(firstSort.s, firstSort.direction);
    forEach(restSorts, ({ s, direction }) => {
      cardsQuery = cardsQuery.addOrderBy(s, direction);
    });
  }
  return cardsQuery;
}

}

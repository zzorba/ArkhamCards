import { findIndex, forEach, pull } from 'lodash';
import { createConnection, Brackets, Connection, Repository, EntitySubscriberInterface, SelectQueryBuilder } from 'typeorm/browser';

import Card from './Card';
import EncounterSet from './EncounterSet';
import FaqEntry from './FaqEntry';
import TabooSet from './TabooSet';
import { QuerySort } from './types';
import { tabooSetQuery } from './query';
import syncPlayerCards, { PlayerCardState } from './syncPlayerCards';

type DatabaseListener = () => void;

export default class Database {
  static SCHEMA_VERSION: number = 11;
  connectionP: Promise<Connection>;

  state?: PlayerCardState;
  listeners: DatabaseListener[] = [];

  constructor(latestVersion?: number) {
    const recreate = !latestVersion || latestVersion < Database.SCHEMA_VERSION;

    this.connectionP = createConnection({
      type: 'react-native',
      database: 'arkham4',
      location: 'default',
      logging: [
        'error',
        // 'query',
        'schema',
      ],
      dropSchema: recreate,
      synchronize: recreate,
      // migrations:['migrations/migration.js'],
      entities: [
        Card,
        EncounterSet,
        FaqEntry,
        TabooSet,
      ],
    });
  }

  addListener(change: () => void) {
    this.listeners.push(change);
  }

  removeListener(change: () => void) {
    pull(this.listeners, change);
  }

  reloadPlayerCards() {
    // console.log('RELOADING PLAYER CARDS');
    return syncPlayerCards(this, this._updatePlayerCards);
  }

  private _updatePlayerCards = (state: PlayerCardState) => {
    // console.log('PLAYER CARDS UDPATED');
    this.state = state;
    forEach(this.listeners, listener => listener());
  };

  async cards(): Promise<Repository<Card>> {
    const connection = await this.connectionP;
    return connection.getRepository(Card);
  }

  async cardsQuery(): Promise<SelectQueryBuilder<Card>> {
    const cards = await this.cards();
    return cards.createQueryBuilder('c').leftJoinAndSelect('c.linked_card', 'linked_card');
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
    query?: Brackets,
    tabooSetId?: number,
    sort?: QuerySort[]
  ): Promise<Card[]> {
    const cardsQuery = await this.applyCardsQuery(query, tabooSetId, sort);
    return await cardsQuery.getMany();
  }

  async getCard(
    query?: Brackets,
    tabooSetId?: number,
    sort?: QuerySort[],
  ): Promise<Card | undefined> {
    const cardsQuery = await this.applyCardsQuery(query, tabooSetId, sort);
    return await cardsQuery.getOne();
  }

  async getCardCount(
    query?: Brackets,
    tabooSetId?: number,
  ): Promise<number> {
    const cardsQuery = await this.applyCardsQuery(query, tabooSetId);
    return await cardsQuery.getCount();
  }

  private async applyCardsQuery(
    query?: Brackets,
    tabooSetId?: number,
    sort?: QuerySort[]
  ): Promise<SelectQueryBuilder<Card>> {
    let cardsQuery = await this.cardsQuery();
    cardsQuery.where(tabooSetQuery(tabooSetId));
    if (query) {
      cardsQuery = cardsQuery.andWhere(query);
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

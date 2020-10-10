import { findIndex, forEach, pull } from 'lodash';
import { createConnection, Brackets, Connection, Repository, EntitySubscriberInterface, SelectQueryBuilder, InsertResult } from 'typeorm/browser';

import Card from './Card';
import EncounterSet from './EncounterSet';
import FaqEntry from './FaqEntry';
import TabooSet from './TabooSet';
import Rule from './Rule';
import { QuerySort } from './types';
import { tabooSetQuery } from './query';
import syncPlayerCards, { PlayerCardState } from './syncPlayerCards';

type DatabaseListener = () => void;

export default class Database {
  static SCHEMA_VERSION: number = 17;
  connectionP: Promise<Connection>;

  state?: PlayerCardState;
  listeners: DatabaseListener[] = [];

  constructor(latestVersion?: number) {
    const recreate = !latestVersion || latestVersion !== Database.SCHEMA_VERSION;

    this.connectionP = createConnection({
      type: 'react-native',
      database: 'arkham4',
      location: 'default',
      logging: [
        'error',
        //'query',
        'schema',
      ],
      dropSchema: recreate,
      synchronize: recreate,
      // maxQueryExecutionTime: 4000,
      // migrations:['migrations/migration.js'],
      entities: [
        Card,
        EncounterSet,
        FaqEntry,
        TabooSet,
        Rule,
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

  async rules(): Promise<Repository<Rule>> {
    const connection = await this.connectionP;
    return connection.getRepository(Rule);
  }

  async cardsQuery(): Promise<SelectQueryBuilder<Card>> {
    const cards = await this.cards();
    return cards.createQueryBuilder('c')
      .leftJoinAndSelect('c.linked_card', 'linked_card');
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

  async clearCache(): Promise<void> {
    const connection = await this.connectionP;
    if (connection.queryResultCache) {
      await connection.queryResultCache.clear();
    }
  }

  async insertCards(
    cards: Card[]
  ): Promise<InsertResult> {
    const query = (await this.cards())
      .createQueryBuilder()
      .insert()
      .into(Card)
      .values(cards)
      .orIgnore();
    return await query.execute();
  }

  async insertRules(
    rules: Rule[]
  ): Promise<InsertResult> {
    const query = (await this.rules())
      .createQueryBuilder()
      .insert()
      .into(Rule)
      .values(rules)
      .orIgnore();
    return await query.execute();
  }

  async getRules(
    page: number,
    pageSize: number,
    query?: Brackets
  ): Promise<Rule[]> {
    let rulesQuery = (await this.rules()).createQueryBuilder('r');
    if (query) {
      rulesQuery = rulesQuery.where(query);
    }
    rulesQuery = rulesQuery.leftJoinAndSelect('r.rules', 'rule');
    return await rulesQuery
      .orderBy('r.order', 'ASC')
      .skip(pageSize * page)
      .take(pageSize).getMany();
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
      console.log("Apply sorts");
      const [firstSort, ...restSorts] = sort;
      cardsQuery = cardsQuery.orderBy(firstSort.s, firstSort.direction);
      forEach(restSorts, ({ s, direction }) => {
        cardsQuery = cardsQuery.addOrderBy(s, direction);
      });
    }
    return cardsQuery;
  }
}

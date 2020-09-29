import { findIndex, forEach, pull } from 'lodash';
import { createConnection, Brackets, Connection, Repository, EntitySubscriberInterface, SelectQueryBuilder, InsertResult } from 'typeorm/browser';

import Card from './Card';
import EncounterSet from './EncounterSet';
import FaqEntry from './FaqEntry';
import TabooSet from './TabooSet';
import { QuerySort } from './types';
import { tabooSetQuery } from './query';
import syncPlayerCards, { PlayerCardState } from './syncPlayerCards';

type DatabaseListener = () => void;

export default class Database {
  static SCHEMA_VERSION: number = 16;
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
      ],
    });
    this.connectionP.then(connection => {
      connection.query('EXPLAIN QUERY PLAN SELECT "c"."id" AS "c_id", "c"."code" AS "c_code", "c"."name" AS "c_name", "c"."real_name" AS "c_real_name", "c"."renderName" AS "c_renderName", "c"."type_code" AS "c_type_code", "c"."alternate_of_code" AS "c_alternate_of_code", "c"."taboo_set_id" AS "c_taboo_set_id", "c"."taboo_placeholder" AS "c_taboo_placeholder", "c"."taboo_text_change" AS "c_taboo_text_change", "c"."pack_code" AS "c_pack_code", "c"."pack_name" AS "c_pack_name", "c"."type_name" AS "c_type_name", "c"."subtype_code" AS "c_subtype_code", "c"."subtype_name" AS "c_subtype_name", "c"."slot" AS "c_slot", "c"."real_slot" AS "c_real_slot", "c"."faction_code" AS "c_faction_code", "c"."faction_name" AS "c_faction_name", "c"."faction2_code" AS "c_faction2_code", "c"."faction2_name" AS "c_faction2_name", "c"."position" AS "c_position", "c"."enemy_damage" AS "c_enemy_damage", "c"."enemy_horror" AS "c_enemy_horror", "c"."enemy_fight" AS "c_enemy_fight", "c"."enemy_evade" AS "c_enemy_evade", "c"."encounter_code" AS "c_encounter_code", "c"."encounter_name" AS "c_encounter_name", "c"."encounter_position" AS "c_encounter_position", "c"."encounter_size" AS "c_encounter_size", "c"."exceptional" AS "c_exceptional", "c"."xp" AS "c_xp", "c"."extra_xp" AS "c_extra_xp", "c"."victory" AS "c_victory", "c"."vengeance" AS "c_vengeance", "c"."renderSubname" AS "c_renderSubname", "c"."subname" AS "c_subname", "c"."firstName" AS "c_firstName", "c"."illustrator" AS "c_illustrator", "c"."text" AS "c_text", "c"."flavor" AS "c_flavor", "c"."cost" AS "c_cost", "c"."real_text" AS "c_real_text", "c"."back_name" AS "c_back_name", "c"."back_text" AS "c_back_text", "c"."back_flavor" AS "c_back_flavor", "c"."quantity" AS "c_quantity", "c"."spoiler" AS "c_spoiler", "c"."advanced" AS "c_advanced", "c"."stage" AS "c_stage", "c"."clues" AS "c_clues", "c"."shroud" AS "c_shroud", "c"."doom" AS "c_doom", "c"."health" AS "c_health", "c"."health_per_investigator" AS "c_health_per_investigator", "c"."sanity" AS "c_sanity", "c"."deck_limit" AS "c_deck_limit", "c"."traits" AS "c_traits", "c"."real_traits" AS "c_real_traits", "c"."is_unique" AS "c_is_unique", "c"."exile" AS "c_exile", "c"."hidden" AS "c_hidden", "c"."myriad" AS "c_myriad", "c"."permanent" AS "c_permanent", "c"."double_sided" AS "c_double_sided", "c"."url" AS "c_url", "c"."octgn_id" AS "c_octgn_id", "c"."imagesrc" AS "c_imagesrc", "c"."backimagesrc" AS "c_backimagesrc", "c"."skill_willpower" AS "c_skill_willpower", "c"."skill_intellect" AS "c_skill_intellect", "c"."skill_combat" AS "c_skill_combat", "c"."skill_agility" AS "c_skill_agility", "c"."skill_wild" AS "c_skill_wild", "c"."restrictions_all_investigators" AS "c_restrictions_all_investigators", "c"."restrictions_investigator" AS "c_restrictions_investigator", "c"."deck_requirements" AS "c_deck_requirements", "c"."deck_options" AS "c_deck_options", "c"."altArtInvestigator" AS "c_altArtInvestigator", "c"."cycle_name" AS "c_cycle_name", "c"."cycle_code" AS "c_cycle_code", "c"."has_restrictions" AS "c_has_restrictions", "c"."has_upgrades" AS "c_has_upgrades", "c"."traits_normalized" AS "c_traits_normalized", "c"."real_traits_normalized" AS "c_real_traits_normalized", "c"."real_slots_normalized" AS "c_real_slots_normalized", "c"."uses" AS "c_uses", "c"."bonded_name" AS "c_bonded_name", "c"."bonded_from" AS "c_bonded_from", "c"."linked_card_id" AS "c_linked_card_id", "linked_card"."id" AS "linked_card_id", "linked_card"."code" AS "linked_card_code", "linked_card"."name" AS "linked_card_name", "linked_card"."real_name" AS "linked_card_real_name", "linked_card"."renderName" AS "linked_card_renderName", "linked_card"."type_code" AS "linked_card_type_code", "linked_card"."alternate_of_code" AS "linked_card_alternate_of_code", "linked_card"."taboo_set_id" AS "linked_card_taboo_set_id", "linked_card"."taboo_placeholder" AS "linked_card_taboo_placeholder", "linked_card"."taboo_text_change" AS "linked_card_taboo_text_change", "linked_card"."pack_code" AS "linked_card_pack_code", "linked_card"."pack_name" AS "linked_card_pack_name", "linked_card"."type_name" AS "linked_card_type_name", "linked_card"."subtype_code" AS "linked_card_subtype_code", "linked_card"."subtype_name" AS "linked_card_subtype_name", "linked_card"."slot" AS "linked_card_slot", "linked_card"."real_slot" AS "linked_card_real_slot", "linked_card"."faction_code" AS "linked_card_faction_code", "linked_card"."faction_name" AS "linked_card_faction_name", "linked_card"."faction2_code" AS "linked_card_faction2_code", "linked_card"."faction2_name" AS "linked_card_faction2_name", "linked_card"."position" AS "linked_card_position", "linked_card"."enemy_damage" AS "linked_card_enemy_damage", "linked_card"."enemy_horror" AS "linked_card_enemy_horror", "linked_card"."enemy_fight" AS "linked_card_enemy_fight", "linked_card"."enemy_evade" AS "linked_card_enemy_evade", "linked_card"."encounter_code" AS "linked_card_encounter_code", "linked_card"."encounter_name" AS "linked_card_encounter_name", "linked_card"."encounter_position" AS "linked_card_encounter_position", "linked_card"."encounter_size" AS "linked_card_encounter_size", "linked_card"."exceptional" AS "linked_card_exceptional", "linked_card"."xp" AS "linked_card_xp", "linked_card"."extra_xp" AS "linked_card_extra_xp", "linked_card"."victory" AS "linked_card_victory", "linked_card"."vengeance" AS "linked_card_vengeance", "linked_card"."renderSubname" AS "linked_card_renderSubname", "linked_card"."subname" AS "linked_card_subname", "linked_card"."firstName" AS "linked_card_firstName", "linked_card"."illustrator" AS "linked_card_illustrator", "linked_card"."text" AS "linked_card_text", "linked_card"."flavor" AS "linked_card_flavor", "linked_card"."cost" AS "linked_card_cost", "linked_card"."real_text" AS "linked_card_real_text", "linked_card"."back_name" AS "linked_card_back_name", "linked_card"."back_text" AS "linked_card_back_text", "linked_card"."back_flavor" AS "linked_card_back_flavor", "linked_card"."quantity" AS "linked_card_quantity", "linked_card"."spoiler" AS "linked_card_spoiler", "linked_card"."advanced" AS "linked_card_advanced", "linked_card"."stage" AS "linked_card_stage", "linked_card"."clues" AS "linked_card_clues", "linked_card"."shroud" AS "linked_card_shroud", "linked_card"."doom" AS "linked_card_doom", "linked_card"."health" AS "linked_card_health", "linked_card"."health_per_investigator" AS "linked_card_health_per_investigator", "linked_card"."sanity" AS "linked_card_sanity", "linked_card"."deck_limit" AS "linked_card_deck_limit", "linked_card"."traits" AS "linked_card_traits", "linked_card"."real_traits" AS "linked_card_real_traits", "linked_card"."is_unique" AS "linked_card_is_unique", "linked_card"."exile" AS "linked_card_exile", "linked_card"."hidden" AS "linked_card_hidden", "linked_card"."myriad" AS "linked_card_myriad", "linked_card"."permanent" AS "linked_card_permanent", "linked_card"."double_sided" AS "linked_card_double_sided", "linked_card"."url" AS "linked_card_url", "linked_card"."octgn_id" AS "linked_card_octgn_id", "linked_card"."imagesrc" AS "linked_card_imagesrc", "linked_card"."backimagesrc" AS "linked_card_backimagesrc", "linked_card"."skill_willpower" AS "linked_card_skill_willpower", "linked_card"."skill_intellect" AS "linked_card_skill_intellect", "linked_card"."skill_combat" AS "linked_card_skill_combat", "linked_card"."skill_agility" AS "linked_card_skill_agility", "linked_card"."skill_wild" AS "linked_card_skill_wild", "linked_card"."restrictions_all_investigators" AS "linked_card_restrictions_all_investigators", "linked_card"."restrictions_investigator" AS "linked_card_restrictions_investigator", "linked_card"."deck_requirements" AS "linked_card_deck_requirements", "linked_card"."deck_options" AS "linked_card_deck_options", "linked_card"."altArtInvestigator" AS "linked_card_altArtInvestigator", "linked_card"."cycle_name" AS "linked_card_cycle_name", "linked_card"."cycle_code" AS "linked_card_cycle_code", "linked_card"."has_restrictions" AS "linked_card_has_restrictions", "linked_card"."has_upgrades" AS "linked_card_has_upgrades", "linked_card"."traits_normalized" AS "linked_card_traits_normalized", "linked_card"."real_traits_normalized" AS "linked_card_real_traits_normalized", "linked_card"."real_slots_normalized" AS "linked_card_real_slots_normalized", "linked_card"."uses" AS "linked_card_uses", "linked_card"."bonded_name" AS "linked_card_bonded_name", "linked_card"."bonded_from" AS "linked_card_bonded_from", "linked_card"."linked_card_id" AS "linked_card_linked_card_id" FROM "card" "c" LEFT JOIN "card" "linked_card" ON "linked_card"."id"="c"."linked_card_id" WHERE ("c"."taboo_set_id" is null OR "c"."taboo_set_id" = 2) AND (((("c"."altArtInvestigator" != true AND ("c"."back_linked" is null OR NOT "c"."back_linked") AND ("c"."hidden" is null OR NOT "c"."hidden"))) AND ("c"."deck_limit" >= 0))) ORDER BY "c"."sort_by_type" ASC, "c"."renderName" ASC, "c"."xp" ASC').then(res => console.log(res));
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

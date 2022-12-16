import { chunk, uniq, filter, flatMap, forEach, groupBy, head, map, partition, sortBy, sumBy, values } from 'lodash';
import { Platform } from 'react-native';

import { CardCache, Pack, PacksActions, CUSTOM_PACKS_AVAILABLE, PACKS_AVAILABLE } from '@actions/types';
import { Rule as JsonRule } from '@data/scenario/types';
import Card, { CARD_NUM_COLUMNS, TranslationData } from '@data/types/Card';
import Rule from '@data/types/Rule';
import Database, { SqliteVersion } from '@data/sqlite/Database';
import TabooSet from '@data/types/TabooSet';
import FaqEntry from '@data/types/FaqEntry';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { GetCardsCacheDocument, GetCardsCacheQuery, GetCardsCacheQueryVariables, GetCardsDocument, GetCardsQuery, GetCardsQueryVariables } from '@generated/graphql/apollo-schema';
import { Dispatch } from 'react';
import CardReprintInfo from '@data/types/CardReprintInfo';

const VERBOSE = false;

const OLD_SQLITE_NUM_VARIABLES = 999;
const NEW_SQLITE_NUM_VARIABLES = 32766;

function computeMaxInset(sqliteVersion: SqliteVersion): number {
  if (sqliteVersion.major === 3 && sqliteVersion.minor >= 32) {
    return Math.floor(NEW_SQLITE_NUM_VARIABLES / CARD_NUM_COLUMNS) - 1;
  }
  if (Platform.OS === 'ios') {
    return 50;
  }
  return Math.floor(OLD_SQLITE_NUM_VARIABLES / CARD_NUM_COLUMNS);
}

async function insertChunk<T>(
  sqliteVersion: SqliteVersion,
  things: T[],
  insert: (things: T[]
) => Promise<any>, maxInsert?: number) {
  const cardsPerInsert = computeMaxInset(sqliteVersion);
  const chunkThings = chunk(things, Math.min(cardsPerInsert, maxInsert || 500));
  for (let i = 0; i < chunkThings.length; i++) {
    await insert(chunkThings[i]);
  }
}

function rulesJson(lang?: string) {
  switch (lang) {
    case 'fr':
      return require('../../assets/generated/rules_fr.json');
    case 'es':
      return require('../../assets/generated/rules_es.json');
    case 'ru':
      return require('../../assets/generated/rules_ru.json');
    case 'de':
      return require('../../assets/generated/rules_de.json');
    case 'ko':
      return require('../../assets/generated/rules_ko.json');
    case 'zh':
      return require('../../assets/generated/rules_zh.json');
    case 'pl':
      return require('../../assets/generated/rules_pl.json');
    case 'it':
      return require('../../assets/generated/rules_it.json');
    case 'en':
    default:
      return require('../../assets/generated/rules.json');
  }
}


export const syncRules = async function(
  db: Database,
  sqliteVersion: SqliteVersion,
  lang?: string
): Promise<void> {
  const rules: JsonRule[] = rulesJson(lang);
  const allRules = flatMap(rules, (jsonRule, index) => {
    const rule = Rule.parse(lang || 'en', jsonRule, index);
    return [rule];
  });
  VERBOSE && console.log('Parsed all rules');

  const [simpleRules, complexRules] = partition(allRules, r => !r.rules);
  await insertChunk(sqliteVersion, simpleRules, async rules => await db.insertRules(rules));
  VERBOSE && console.log('Inserted all simple rules');

  for (let i = 0; i < complexRules.length; i++) {
    const r = complexRules[i];
    await db.insertRules([
      r,
      ...flatMap(r.rules || [], r2 => [r2, ...(r2.rules || [])]),
    ]);
  }
  VERBOSE && console.log('Inserted all complex rules');
};


function handleDerivativeData(dedupedCards: Card[], dupes: {
  [code: string]: Card[] | undefined;
}) {
  const flatCards = flatMap(dedupedCards, (c: Card) => {
    return c.linked_card ? [c, c.linked_card] : [c];
  });
  const encounter_card_counts: {
    [encounter_code: string]: number | undefined;
  } = {};

  // Clean up all the bonded stuff.
  const bondedNames: string[] = [];
  const playerCards: Card[] = [];
  forEach(flatCards, card => {
    if (dupes[card.code]) {
      card.reprint_pack_codes = uniq(map(dupes[card.code], c => c.pack_code));
      card.reprint_info = uniq(map(dupes[card.code], c => CardReprintInfo.parse(c)));
    }
    if (!card.hidden && card.encounter_code) {
      encounter_card_counts[card.encounter_code] = (encounter_card_counts[card.encounter_code] || 0) + (card.quantity || 1);
    }
    if (card.bonded_name) {
      bondedNames.push(card.bonded_name);
    }
    if ((card.deck_limit && card.deck_limit > 0) && !card.spoiler && !(card.xp === undefined || card.xp === null)) {
      playerCards.push(card);
    }
  });

  // Handle all upgrade stuff
  const cardsByName = values(groupBy(playerCards, card => card.real_name.toLowerCase()));
  forEach(cardsByName, cardsGroup => {
    if (cardsGroup.length > 1) {
      const maxXpCard = head(sortBy(cardsGroup, card => -(card.xp || 0)));
      if (maxXpCard) {
        forEach(cardsGroup, card => {
          const xp = card.xp || 0;
          card.has_upgrades = xp < (maxXpCard.xp || 0);
        });
      }
    }
  });

  // Handle all bonded card stuff, and encountercode sizes.
  const bondedSet = new Set(bondedNames);
  forEach(flatCards, card => {
    if (card.encounter_code) {
      card.encounter_size = encounter_card_counts[card.encounter_code] || 0;
      encounter_card_counts;
    }
    if (bondedSet.has(card.real_name)) {
      card.bonded_from = true;
    }
  });

  // Deal with duplicate ids?
  forEach(groupBy(flatCards, card => card.id), dupes => {
    if (dupes.length > 1) {
      forEach(dupes, (dupe, idx) => {
        dupe.id = `${dupe.id}_${idx}`;
      });
    }
  });
}
export const syncCards = async function(
  updateProgress: (progress: number, estimateMillis?: number, msg?: string) => void,
  db: Database,
  sqliteVersion: SqliteVersion,
  anonClient: ApolloClient<NormalizedCacheObject>,
  dispatch: Dispatch<PacksActions>,
  lang?: string,
  cache?: CardCache,
): Promise<CardCache | null> {
  VERBOSE && console.log('syncCards called');
  try {
    const cards = await db.cards();
    try {
      VERBOSE && console.log('Checking cache ')
      if (cache?.lastModified && cache?.lastModifiedTranslation) {
        VERBOSE && console.time('cache-check');
        const cacheResponse = await anonClient.query<GetCardsCacheQuery, GetCardsCacheQueryVariables>({
          query: GetCardsCacheDocument,
          variables: {
            locale: lang || 'en',
          },
          fetchPolicy: 'no-cache',
          canonizeResults: false,
        });
        const cardCount = await cards.count();
        VERBOSE && console.timeEnd('cache-check');
        const serverCache = cacheResponse?.data.all_card_updated[0];
        if (serverCache.card_count === cardCount &&
          serverCache.cards_updated_at === cache.lastModified &&
          serverCache.translation_updated_at === cache.lastModifiedTranslation
        ) {
          VERBOSE && console.log('Cache hit, skipping fetch');
          // Cache hit, no need to download cards our local database is in sync.
          return cache;
        }
      }
    } catch (e) {
      console.log(e.message);
    }
    VERBOSE && console.log('Starting download.');
    VERBOSE && console.time('download');
    updateProgress(0.2, Platform.OS === 'ios' ? 3000 : 5000);
    const cardsResponse = await anonClient.query<GetCardsQuery, GetCardsQueryVariables>({
      query: GetCardsDocument,
      variables: {
        locale: lang || 'en',
      },
      fetchPolicy: 'no-cache',
      canonizeResults: false,
    });
    updateProgress(0.2);
    VERBOSE && console.timeEnd('download');
    VERBOSE && console.log('Download completed!');

    const allEncounterSets: { [code: string]: string | undefined } = {};
    forEach(cardsResponse.data.card_encounter_set, encounterSet => {
      allEncounterSets[encounterSet.code] = encounterSet.name;
    });
    const packs: {
      [pack_code: string]: Pack & {
        cycle_code: string;
        cycle_name: string;
      };
    } = {};
    const standardPacks: Pack[] = [];
    const customPacks: Pack[] = [];
    forEach(cardsResponse.data.cycle, cycle => {
      const cycle_name = head(cycle.translations)?.name || cycle.real_name;
      const cycle_packs = map(cycle.packs, pack => {
        return {
          id: pack.code,
          code: pack.code,
          name: head(pack.translations)?.name || pack.real_name,
          position: pack.position || 0,
          cycle_position: cycle.position,
          cycle_code: cycle.code,
          cycle_name,
          known: 0,
          total: 0,
        }
      });

      forEach(cycle_packs, pack => {
        packs[pack.code] = pack;
        if (!cycle.official) {
          customPacks.push(pack);
        } else {
          standardPacks.push(pack);
        }
      });
    });

    dispatch({
      type: PACKS_AVAILABLE,
      packs: standardPacks,
      lang: lang || 'en',
      timestamp: new Date(),
      lastModified: undefined,
    });
    dispatch({ type: CUSTOM_PACKS_AVAILABLE, packs: customPacks, lang: lang || 'en' });

    const factionNames: { [code: string]: string } = {};
    forEach(cardsResponse.data.faction_name, faction => {
      factionNames[faction.code] = faction.name;
    });
    const typeNames: { [code: string]: string } = {};
    forEach(cardsResponse.data.card_type_name, type => {
      typeNames[type.code] = type.name;
    });

    const subTypeNames: { [code: string]: string } = {};
    forEach(cardsResponse.data.card_subtype_name, type => {
      subTypeNames[type.code] = type.name;
    });

    VERBOSE && console.time('parse');
    const total = cardsResponse.data.all_card.length;
    const translationData: TranslationData = {
      lang: lang || 'en',
      encounterSets: allEncounterSets,
      packs,
      cardTypeNames: typeNames,
      subTypeNames,
      factionNames,
    };
    const allCards = map(cardsResponse.data.all_card, (card, idx) => {
      if (idx % 500 === 0) {
        updateProgress(0.2 + (idx * 1.0 / total * 0.1));
      }
      return Card.fromGraphQl(card, translationData);
    });
    VERBOSE && console.timeEnd('parse');
    updateProgress(0.3)
    VERBOSE && console.time('clear-db');
    const encounterSets = await db.encounterSets();
    const tabooSets = await db.tabooSets();
    const rules = await db.rules();

    // Delete the tables.
    await cards.createQueryBuilder().delete().execute();
    await encounterSets.createQueryBuilder().delete().execute();
    await tabooSets.createQueryBuilder().delete().execute();
    await rules.createQueryBuilder().delete().execute();
    await db.clearCache();
    VERBOSE && console.timeEnd('clear-db');
    updateProgress(0.32);
    VERBOSE && console.time('rules');
    await syncRules(db, sqliteVersion, lang);
    updateProgress(0.38);
    VERBOSE && console.timeEnd('rules');
    const cardsToInsert: Card[] = [];
    const dupes: {
      [code: string]: Card[] | undefined;
    } = {};
    forEach(allCards, card => {
      if (card.duplicate_of_code) {
        dupes[card.duplicate_of_code] = [
          ...(dupes[card.duplicate_of_code] || []),
          card,
        ];
      }
      cardsToInsert.push(card);
    });
    VERBOSE && console.time('tabooSets');
    await tabooSets.insert(map(cardsResponse.data.taboo_set, tabooSet => {
      return TabooSet.fromGQL(tabooSet);
    }));
    VERBOSE && console.timeEnd('tabooSets');

    updateProgress(0.40);
    VERBOSE && console.time('derivedData');
    const linkedSet = new Set(flatMap(cardsToInsert, (c: Card) => c.linked_card ? [c.linked_card.code] : []));
    const dedupedCards = filter(cardsToInsert, (c: Card) => !!c.linked_card || !linkedSet.has(c.code));
    handleDerivativeData(dedupedCards, dupes)
    const [linkedCards, normalCards] = partition(dedupedCards, card => !!card.linked_card);
    VERBOSE && console.timeEnd('derivedData');
    const queryRunner = await db.startTransaction();
    try {
      const totalCards = (linkedCards.length + normalCards.length + sumBy(linkedCards, c => c.linked_card ? 1 : 0)) || 3000;
      let processedCards = 0;
      async function insertCards(c: Card[]) {
        await queryRunner.manager.insert(Card, c);
        if (processedCards / 200 < (processedCards + c.length) / 200) {
          updateProgress(0.40 + (processedCards / (1.0 * totalCards) * 0.50));
        }
        processedCards += c.length;
      }
      VERBOSE && console.time('linkedCards-backs');
      await insertChunk(
        sqliteVersion,
        flatMap(linkedCards, c => c.linked_card ? [c.linked_card] : []),
        insertCards
      );
      VERBOSE && console.timeEnd('linkedCards-backs');

      VERBOSE && console.time('linkedCards');
      await insertChunk(sqliteVersion, linkedCards, insertCards);
      VERBOSE && console.timeEnd('linkedCards');

      VERBOSE && console.time('normalCards');
      await insertChunk(sqliteVersion, normalCards, insertCards);
      VERBOSE && console.timeEnd('normalCards');
    } finally {
      VERBOSE && console.time('commit');
      await queryRunner.commitTransaction();
      VERBOSE && console.timeEnd('commit');
    }
    updateProgress(0.95);
    VERBOSE && console.time('countCards');
    const cardCount = await cards.count();
    VERBOSE && console.timeEnd('countCards');

    const updated = cardsResponse.data.all_card_updated[0];
    return {
      cardCount,
      lastModified: updated?.cards_updated_at,
      lastModifiedTranslation: updated?.translation_updated_at,
    };
  } catch (e) {
    console.log(e);
    console.log(e.stack)
    throw e;
  }
};

export const getFaqEntry = async function(db: Database, code: string) {
  const faqs = await db.faqEntries();
  const faqEntry = await faqs.createQueryBuilder()
    .where('code = :code')
    .setParameters({ code })
    .getOne();

  const headers = new Headers();
  if (faqEntry && faqEntry.lastModified) {
    headers.append('If-Modified-Since', faqEntry.lastModified);
  }
  const uri = `https://arkhamdb.com/api/public/faq/${code}.json`;
  const response = await fetch(uri, {
    method: 'GET',
    headers: headers,
  });
  if (response.status === 304) {
    return Promise.resolve(true);
  }
  const lastModified = response.headers.get('Last-Modified') || undefined;
  const json = await response.json();
  if (json.length) {
    faqs.save(FaqEntry.fromJson(code, json[0], lastModified));
    return true;
  }
  faqs.save(FaqEntry.empty(code, lastModified));
  return false;
};

export default {
  syncCards,
  getFaqEntry,
};

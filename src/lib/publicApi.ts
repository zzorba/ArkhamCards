import { chunk, filter, flatMap, forEach, groupBy, head, map, partition, sortBy, sumBy, uniq, values } from 'lodash';
import { Alert, Platform } from 'react-native';
import { t } from 'ttag';

import { CardCache, TabooCache, Pack } from '@actions/types';
import { Rule as JsonRule } from '@data/scenario/types';
import Card, { CARD_NUM_COLUMNS } from '@data/types/Card';
import Rule from '@data/types/Rule';
import Database, { SqliteVersion } from '@data/sqlite/Database';
import TabooSet from '@data/types/TabooSet';
import FaqEntry from '@data/types/FaqEntry';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { GetCustomCardsDocument, GetCustomCardsQuery, GetCustomCardsQueryVariables } from '@generated/graphql/apollo-schema';

const VERBOSE = false;

export const syncTaboos = async function(
  updateProgress: (progress: number, msg?: string) => void,
  db: Database,
  sqliteVersion: SqliteVersion,
  lang?: string,
  cache?: TabooCache
): Promise<TabooCache | null> {
  try {
    const langPrefix = lang && lang !== 'en' ? `${lang}.` : '';
    const uri = `https://${langPrefix}arkhamdb.com/api/public/taboos/`;
    const headers = new Headers();
    if (cache && cache.lastModified && cache.tabooCount > 0) {
      const cards = await db.cards();
      const tabooCount = await cards.createQueryBuilder()
        .where('taboo_set_id > 0')
        .getCount();
      if (tabooCount === cache.tabooCount) {
        headers.append('If-Modified-Since', cache.lastModified);
      }
    }
    const response = await fetch(uri, {
      method: 'GET',
      headers,
    });
    if (response.status === 304 && cache) {
      updateProgress(1.0);
      return cache;
    }
    const lastModified = response.headers.get('Last-Modified') || undefined;
    const json = await response.json();
    const allTabooCards = uniq(
      flatMap(json, tabooJson => {
        const cards = JSON.parse(tabooJson.cards);
        return map(cards, card => card.code);
      })
    );
    updateProgress(0.92);
    VERBOSE && console.log('Starting to update Taboos');
    const cardsRep = await db.cards();
    await cardsRep.createQueryBuilder().where('taboo_set_id > 0').delete().execute();
    VERBOSE && console.log('Deleted old Taboo cards');

    await cardsRep.createQueryBuilder()
      .update()
      .where('code in (:...codes) AND (taboo_set_id is null)', { codes: allTabooCards })
      .set({ taboo_set_id: 0 })
      .execute();
    VERBOSE && console.log('Found base taboo cards');
    const baseTabooCards: Card[] = await (await db.cards()).createQueryBuilder('c')
      .where('c.code IN (:...codes) AND c.taboo_set_id = 0')
      .leftJoin('c.linked_card', 'linked_card')
      .setParameters({ codes: allTabooCards })
      .addSelect(Card.ELIDED_FIELDS)
      .getMany();
    updateProgress(0.95);

    const tabooSetsRep = await db.tabooSets();
    await tabooSetsRep.createQueryBuilder().delete().execute();

    const queryRunner = await db.startTransaction();
    const tabooSets: TabooSet[] = [];
    try {
      for (let i = 0; i < json.length; i++) {
        const tabooJson = json[i];
        const cards = JSON.parse(tabooJson.cards);
        try {
          tabooSets.push(TabooSet.fromJson(tabooJson, cards.length));
          const tabooCardsToSave: {
            [key: string]: Card | undefined;
          } = {};
          forEach(baseTabooCards, card => {
            tabooCardsToSave[card.code] = Card.placeholderTabooCard(tabooJson.id, card);
          });

          for (let j = 0; j < cards.length; j++) {
            const cardJson = cards[j];
            const code: string = cardJson.code;
            const card = tabooCardsToSave[code];
            if (card) {
              try {
                tabooCardsToSave[code] = Card.fromTabooCardJson(tabooJson.id, cardJson, card);
              } catch (e) {
                Alert.alert(`${e}`);
                console.log(e);
              }
            } else {
              console.log(`Could not find old card: ${code}`);
            }
          }
          const cardsToInsert = flatMap(values(tabooCardsToSave), card => card ? [card] : []);
          // await cards.save(cardsToInsert);
          await insertChunk(sqliteVersion, cardsToInsert, async cards => {
            await queryRunner.manager.insert(Card, cards);
          }, 4);
        } catch (e) {
          console.log(e);
          Alert.alert(`${e}`);
        }
      }
    } finally {
      await queryRunner.commitTransaction();
      await queryRunner.release();
    }
    updateProgress(0.98);

    await tabooSetsRep.insert(tabooSets);
    const tabooCount = await cardsRep.createQueryBuilder()
      .where('taboo_set_id > 0')
      .getCount();
    updateProgress(1.0);

    return {
      tabooCount,
      lastModified,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

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
  await Promise.all(map(chunkThings, toInsert => insert(toInsert)));
}

function rulesJson(lang?: string) {
  switch (lang) {
    case 'fr':
      return require('../../assets/rules_fr.json');
    case 'es':
      return require('../../assets/rules_es.json');
    case 'ru':
      return require('../../assets/rules_ru.json');
    case 'de':
      return require('../../assets/rules_de.json');
    case 'ko':
      return require('../../assets/rules_ko.json');
    case 'zh':
      return require('../../assets/rules_zh.json');
    case 'en':
    default:
      return require('../../assets/rules.json');
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

  const [simpleRules, complexRules] = partition(allRules, r => !r.rules);
  await insertChunk(sqliteVersion, simpleRules, async rules => await db.insertRules(rules));
  forEach(complexRules, r => {
    db.insertRules([
      r,
      ...flatMap(r.rules || [], r2 => [r2, ...(r2.rules || [])]),
    ]);
  });
};
export const NON_LOCALIZED_CARDS = new Set(['en', 'pt']);

export const syncCards = async function(
  updateProgress: (progress: number, msg?: string) => void,
  db: Database,
  sqliteVersion: SqliteVersion,
  anonClient: ApolloClient<NormalizedCacheObject>,
  packs: Pack[],
  lang?: string,
  cache?: CardCache
): Promise<CardCache | null> {
  VERBOSE && console.log('syncCards called');
  try {
    updateProgress(0);
    VERBOSE && console.log('Starting sync of cards from ArkhamDB');
    const langPrefix = lang && !NON_LOCALIZED_CARDS.has(lang) ? `${lang}.` : '';
    const uri = `https://${langPrefix}arkhamdb.com/api/public/cards/?encounter=1`;
    const packsByCode: { [code: string]: Pack } = {};
    const cycleNames: {
      [cycle_position: number]: {
        name?: string;
        code?: string;
      };
    } = {};
    forEach(packs, pack => {
      packsByCode[pack.code] = pack;
      if (pack.position === 1) {
        cycleNames[pack.cycle_position] = pack;
      }
    });
    cycleNames[8] = { name: t`Edge of the Earth`, code: 'eoe' };
    cycleNames[50] = { name: t`Return to...`, code: 'return' };
    cycleNames[60] = { name: t`Investigator Starter Decks`, code: 'investigator' };
    cycleNames[70] = { name: t`Side stories`, code: 'side_stories' };
    cycleNames[80] = { name: t`Promotional`, code: 'promotional' };
    cycleNames[90] = { name: t`Parallel`, code: 'parallel' };
    updateProgress(0.01);

    const headers = new Headers();
    if (cache &&
      cache.lastModified &&
      cache.cardCount > 0
    ) {
      const cards = await db.cards();
      const cardCount = await cards.createQueryBuilder('card')
        .where('card.taboo_set_id is null OR card.taboo_set_id = 0')
        .getCount();
      if (cardCount === cache.cardCount) {
        headers.append('If-Modified-Since', cache.lastModified);
      }
    }
    updateProgress(0.03);

    const customCardsPromise = anonClient.query<GetCustomCardsQuery, GetCustomCardsQueryVariables>({
      query: GetCustomCardsDocument,
      variables: {
        locale: lang || 'en',
      },
      fetchPolicy: 'network-only',
    });
    const response = await fetch(uri, {
      method: 'GET',
      headers,
    });
    if (response.status === 304 && cache) {
      updateProgress(0.5);
      try {
        const customCardsResponse = await customCardsPromise;
        const customCards = map(customCardsResponse.data.card, customCard => Card.fromGraphQl(customCard, lang || 'en'));
        const queryRunner = await db.startTransaction();
        try {
          await insertChunk(sqliteVersion, customCards, async(c: Card[]) => {
            await queryRunner.manager.delete(Card, map(c, c => c.id));
            await queryRunner.manager.insert(Card, c);
          });
          updateProgress(0.7);
        } finally {
          await queryRunner.commitTransaction();
          await queryRunner.release();
        }
      } catch (e) {
        console.log(e);
      }
      updateProgress(0.9);
      return cache;
    }
    VERBOSE && console.log('Got results from ArkhamDB');

    const lastModified = response.headers.get('Last-Modified') || undefined;
    updateProgress(0.1);

    const json = await response.json();
    updateProgress(0.2);
    VERBOSE && console.log('Parsed ArkhamDB json');

    const encounterSets = await db.encounterSets();
    const cards = await db.cards();
    const tabooSets = await db.tabooSets();
    const rules = await db.rules();

    // Delete the tables.
    await cards.createQueryBuilder().delete().execute();
    await encounterSets.createQueryBuilder().delete().execute();
    await tabooSets.createQueryBuilder().delete().execute();
    await rules.createQueryBuilder().delete().execute();
    await db.clearCache();
    VERBOSE && console.log('Cleared old database');
    updateProgress(0.22);

    await syncRules(db, sqliteVersion, lang);
    updateProgress(0.25);

    // console.log(`${await cards.count() } cards after delete`);
    const genericInvestigator = Card.fromJson({
      pack_code: 'custom',
      pack_name: t`Custom`,
      type_code: 'investigator',
      type_name: t`Investigator`,
      faction_code: 'neutral',
      faction_name: t`Neutral`,
      position: 1,
      code: 'custom_001',
      name: 'Johnny Anybody',
      real_name: 'Johnny Anybody',
      subname: t`The Chameleon`,
      text: t`This is a custom investigator to allow for building of arbitrary decks.\n[elder_sign]: +X where X is whatever you want it to be.`,
      quantity: 1,
      skill_willpower: 3,
      skill_intellect: 3,
      skill_combat: 3,
      skill_agility: 3,
      health: 7,
      health_per_investigator: false,
      sanity: 7,
      deck_limit: 1,
      deck_requirements: {
        size: 30,
        card: {},
        random: [{ target: 'subtype', value: 'basicweakness' }],
      },
      deck_options: [{
        faction: ['guardian','seeker','rogue','mystic','survivor','neutral'],
        level: { min: 0, max: 5 },
      }],
      is_unique: true,
      double_sided: true,
      back_text: '<b>Deck Size</b>: 30.\n<b>Deckbuilding Options</b>: Guardian cards ([guardian]) level 0-5, Seeker cards ([seeker]) level 0-5, Rogue cards ([rogue]) level 0-5, Mystic cards ([mystic]) level 0-5, Survivor cards ([survivor]) level 0-5, Neutral cards level 0-5.\n<b>Deckbuilding Requirements</b> (do not count toward deck size): 1 random basic weakness.',
    }, packsByCode, cycleNames, lang || 'en');
    genericInvestigator.browse_visible = 4;
    const cardsToInsert: Card[] = [genericInvestigator];
    const dupes: {
      [code: string]: string[] | undefined;
    } = {};
    forEach(json, cardJson => {
      try {
        const card = Card.fromJson(cardJson, packsByCode, cycleNames, lang || 'en');
        if (card) {
          /*
          // Code to spit out investigator deck_options localization strings.
          if (card.type_code === 'investigator' && card.deck_options) {
            forEach(card.deck_options, option => {
              if (option.error) {
                console.log(`'${option.error}': t\`${option.error}\`,`);
              }
            });
          }
          */
          if (card.duplicate_of_code) {
            if (!dupes[card.duplicate_of_code]) {
              dupes[card.duplicate_of_code] = [];
            }
            dupes[card.duplicate_of_code]?.push(card.pack_code);
          }
          cardsToInsert.push(card);
        }
      } catch (e) {
        Alert.alert(`${e}`);
        console.log(e);
        console.log(cardJson);
      }
    });
    updateProgress(0.35);
    const linkedSet = new Set(flatMap(cardsToInsert, (c: Card) => c.linked_card ? [c.code, c.linked_card] : []));
    const dedupedCards = filter(cardsToInsert, (c: Card) => !!c.linked_card || !linkedSet.has(c.code));
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
        card.reprint_pack_codes = dupes[card.code];
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
    let customCards: Card[] = [];
    try {
      const customCardsResponse = await customCardsPromise;
      customCards = map(customCardsResponse.data.card, customCard => Card.fromGraphQl(customCard, lang || 'en'));
    } catch (e) {
      console.log(e);
    }
    const [linkedCards, normalCards] = partition(dedupedCards, card => !!card.linked_card);
    const queryRunner = await db.startTransaction();
    try {
      VERBOSE && console.log('Parsed all cards');
      const totalCards = (linkedCards.length + normalCards.length + customCards.length + sumBy(linkedCards, c => c.linked_card ? 1 : 0)) || 3000;
      let processedCards = 0;
      async function insertCards(c: Card[]) {
        await queryRunner.manager.insert(Card, c);
        processedCards += c.length;
        updateProgress(0.35 + (processedCards / (1.0 * totalCards) * 0.50));
      }
      await insertChunk(sqliteVersion, flatMap(linkedCards, c => c.linked_card ? [c.linked_card] : []), insertCards);
      // console.log('Inserted back-link cards');
      await insertChunk(sqliteVersion, linkedCards, insertCards);
      VERBOSE && console.log('Inserted front link cards');
      await insertChunk(sqliteVersion, normalCards, insertCards);
      if (customCards.length) {
        await insertChunk(sqliteVersion, customCards, insertCards);
      }
    } finally {
      await queryRunner.commitTransaction();
      await queryRunner.release();
    }

    VERBOSE && console.log('Inserted normal cards');
    updateProgress(0.90);
    const cardCount = await cards.createQueryBuilder('card')
      .where('card.taboo_set_id is null OR card.taboo_set_id = 0')
      .getCount();
    return {
      cardCount,
      lastModified,
    };
  } catch (e) {
    console.log(e);
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
  syncTaboos,
  getFaqEntry,
};

import { chunk, flatMap, forEach, groupBy, head, map, partition, sortBy, uniq, values } from 'lodash';
import { Alert } from 'react-native';
import { t } from 'ttag';

import { CardCache, TabooCache, Pack } from '@actions/types';
import Card from '@data/Card';
import Database from '@data/Database';
import EncounterSet from '@data/EncounterSet';
import TabooSet from '@data/TabooSet';
import FaqEntry from '@data/FaqEntry';

export const syncTaboos = async function(
  db: Database,
  lang?: string,
  cache?: TabooCache
): Promise<TabooCache | null> {
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
  const cardsRep = await db.cards();
  await cardsRep.createQueryBuilder().where('taboo_set_id > 0').delete().execute();

  const tabooSetsRep = await db.tabooSets();
  await tabooSetsRep.createQueryBuilder().delete().execute();

  const tabooSets: TabooSet[] = [];
  for (let i = 0; i < json.length; i++) {
    const tabooJson = json[i];
    const cards = JSON.parse(tabooJson.cards);
    try {
      tabooSets.push(TabooSet.fromJson(tabooJson, cards.length));
      for (let j = 0; j < allTabooCards.length; j++) {
        const tabooCode = allTabooCards[j];
        const card = await cardsRep.createQueryBuilder('card')
          .where('(card.code = :code AND (card.taboo_set_id is null OR card.taboo_set_id = 0))')
          .setParameters({ code: tabooCode })
          .getOne();
        if (card) {
          const tabooCard = Card.placeholderTabooCard(tabooJson.id, card);
          cardsRep.insert(tabooCard);
        }
      }
      for (let j = 0; j < cards.length; j++) {
        const cardJson = cards[j];
        const code: string = cardJson.code;
        const card = await cardsRep.createQueryBuilder()
          .where('(code = :code AND (taboo_set_id is null OR taboo_set_id = 0))')
          .setParameters({ code: cardJson.code })
          .getOne();
        if (card) {
          try {
            // Mark the original card as the 'vanilla' version.
            if (card.taboo_set_id !== 0) {
              await cardsRep.update({ id: card.id }, { taboo_set_id: 0 });
            }
            const tabooCard = Card.fromTabooCardJson(tabooJson.id, cardJson, card);
            await cardsRep.save(tabooCard);
          } catch (e) {
            Alert.alert(`${e}`);
            console.log(e);
          }
        } else {
          console.log(`Could not find old card: ${code}`);
        }
      }
    } catch (e) {
      Alert.alert(`${e}`);
      console.log(e);
    }
  }

  await tabooSetsRep.insert(tabooSets);

  const tabooCount = await cardsRep.createQueryBuilder()
    .where('taboo_set_id > 0')
    .getCount();
  return {
    tabooCount,
    lastModified,
  };
};

async function insertChunk<T>(things: T[], insert: (things: T[]) => Promise<void>) {
  const chunkThings = chunk(things, 10);
  for (let i = 0; i < chunkThings.length; i++) {
    const toInsert = chunkThings[i];
    await insert(toInsert);
  }
}

export const syncCards = async function(
  db: Database,
  packs: Pack[],
  lang?: string,
  cache?: CardCache
): Promise<CardCache | null> {
  const langPrefix = lang && lang !== 'en' ? `${lang}.` : '';
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
  cycleNames[50] = {};
  cycleNames[70] = {};
  cycleNames[80] = {};
  cycleNames[90] = {};
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
  try {
    const response = await fetch(uri, {
      method: 'GET',
      headers,
    });
    if (response.status === 304 && cache) {
      return cache;
    }

    const lastModified = response.headers.get('Last-Modified') || undefined;
    const json = await response.json();
    const encounterSets = await db.encounterSets();
    const cards = await db.cards();
    const tabooSets = await db.tabooSets();

    // Delete the tables.
    await cards.createQueryBuilder().delete().execute();
    await encounterSets.createQueryBuilder().delete().execute();
    await tabooSets.createQueryBuilder().delete().execute();
    console.log(await cards.count() + ' cards after delete');
    const cardsToInsert: Card[] = [];
    forEach(json, cardJson => {
      try {
        const card = Card.fromJson(cardJson, packsByCode, cycleNames, lang || 'en');
        if (card) {
          cardsToInsert.push(card);
        }
      } catch (e) {
        Alert.alert(`${e}`);
        console.log(e);
        console.log(cardJson);
      }
    });
    const [linkedCards, normalCards] = partition(cardsToInsert, card => !!card.linked_card);
    //console.log('Parsed all cards');
    await insertChunk(normalCards, async(c: Card[]) => {
      await cards.insert(c);
    });
    //console.log(`Inserting linked cards.`);
    for (let i = 0; i < linkedCards.length; i++) {
      // console.log(`Inserting ${linkedCards[i].code} - ${linkedCards[i].name}`)
      await cards.insert(linkedCards[i]);
    }
    const playerCards = await cards.createQueryBuilder()
      .where('deck_limit > 0 AND spoiler != true AND xp is not null AND (taboo_set_id is null OR taboo_set_id = 0)')
      .getMany();
    const cardsByName = values(groupBy(playerCards, card => card.real_name));

    //console.log(`Working on upgrades now.`);
    for (let i = 0; i < cardsByName.length; i++) {
      const cardsGroup = cardsByName[i];
      if (cardsGroup.length > 1) {
        const maxXpCard = head(sortBy(cardsGroup, card => -(card.xp || 0)));
        if (maxXpCard) {
          for (let j = 0; j < cardsGroup.length; j++) {
            const card = cardsGroup[j];
            const xp = card.xp || 0;
            await cards.update({ id: card.id }, { has_upgrades: xp < (maxXpCard.xp || 0) });
          }
        }
      }
    }
    const cardCount = await cards.createQueryBuilder('card')
      .where('card.taboo_set_id is null OR card.taboo_set_id = 0')
      .getCount();
    return {
      cardCount,
      lastModified,
    };
  } catch (e) {
    console.log(e);
    return Promise.resolve(null);
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

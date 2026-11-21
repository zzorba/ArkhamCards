import { find, flatMap, forEach, isNil, keys, map, omitBy, values } from 'lodash';
import { t } from 'ttag';

import Card from './types/Card';
import Database from './sqlite/Database';
import { Card_Type_Code_Enum, SingleCardFragment } from '@generated/graphql/apollo-schema';
import { DeckMeta, Slots } from '@actions/types';
import {
  ArkhamBuildDeckRequirements,
  ArkhamBuildFanMadeCard,
  ArkhamBuildFanMadeContent,
  ArkhamBuildRestrictions,
} from './types/ArkhamBuildFanMadeContent';

function cardTypeNames(): { [type_code: string]: string } {
  return {
    investigator: t`Investigator`,
    asset: t`Asset`,
    event: t`Event`,
    skill: t`Skill`,
    treachery: t`Treachery`,
    enemy: t`Enemy`,
    story: t`Story`,
    location: t`Location`,
  };
}

function factionNames(): { [faction_code: string]: string } {
  return {
    guardian: t`Guardian`,
    seeker: t`Seeker`,
    rogue: t`Rogue`,
    mystic: t`Mystic`,
    survivor: t`Survivor`,
    neutral: t`Neutral`,
    mythos: t`Mythos`,
  };
}

/**
 * Convert ArkhamDB style card requirements into the transposed sets format
 * that DeckRequirement.parse expects: [[code1, code2], [alternates...]].
 */
function simpleDeckRequirements(requirements: ArkhamBuildDeckRequirements) {
  const requiredCodes = keys(requirements.card);
  const alternates = flatMap(requiredCodes, code =>
    keys(requirements.card?.[code]).filter(alt => alt !== code)
  );
  const card = requiredCodes.length ? [
    requiredCodes,
    // Alternates are only expressible when there is a single required card.
    ...(requiredCodes.length === 1 && alternates.length ? [alternates] : []),
  ] : undefined;
  return {
    size: requirements.size,
    card,
    random: requirements.random,
  };
}

function cardFromArkhamBuildFanMade(
  raw: ArkhamBuildFanMadeCard,
  content: ArkhamBuildFanMadeContent
): Card | undefined {
  const type_code = find(values(Card_Type_Code_Enum), type => type === raw.type_code);
  if (!type_code) {
    return undefined;
  }
  const code = raw.code || raw.id;
  const pack_code = raw.pack_code || 'custom';
  const pack = content.packs?.[pack_code];
  const cycle = pack?.cycle_code ? content.cycles?.[pack.cycle_code] : undefined;
  const pack_name = pack?.real_name || pack?.name || t`Custom Content`;

  const fragment: SingleCardFragment & { translations: [] } = {
    id: code,
    code,
    // Custom cards are never taboo'd, so they are visible under every taboo set.
    taboo_set_id: null,
    official: false,
    version: 1,
    translations: [],
    type_code,
    subtype_code: raw.subtype_code,
    faction_code: raw.faction_code,
    faction2_code: raw.faction2_code,
    faction3_code: raw.faction3_code,
    pack_code,
    pack_position: raw.position ?? 0,
    position: raw.position ?? 0,
    quantity: raw.quantity ?? 1,
    deck_limit: raw.deck_limit ?? (raw.type_code === 'investigator' ? 1 : 2),
    encounter_code: raw.encounter_code,
    encounter_position: raw.encounter_position,
    real_name: raw.real_name || raw.name,
    real_subname: raw.real_subname || raw.subname,
    real_pack_name: pack_name,
    real_text: raw.real_text || raw.text,
    real_traits: raw.real_traits || raw.traits,
    real_slot: raw.real_slot || raw.slot,
    real_flavor: raw.real_flavor || raw.flavor,
    real_back_name: raw.real_back_name || raw.back_name,
    real_back_text: raw.real_back_text || raw.back_text,
    real_back_flavor: raw.real_back_flavor || raw.back_flavor,
    cost: raw.cost,
    xp: raw.xp,
    health: raw.health,
    sanity: raw.sanity,
    health_per_investigator: raw.health_per_investigator,
    is_unique: raw.is_unique,
    exceptional: raw.exceptional,
    myriad: raw.myriad,
    permanent: raw.permanent,
    double_sided: raw.double_sided,
    illustrator: raw.illustrator,
    skill_willpower: raw.skill_willpower,
    skill_intellect: raw.skill_intellect,
    skill_combat: raw.skill_combat,
    skill_agility: raw.skill_agility,
    skill_wild: raw.skill_wild,
    deck_options: raw.deck_options,
    simple_deck_requirements: raw.deck_requirements ? simpleDeckRequirements(raw.deck_requirements) : undefined,
    restrictions: raw.restrictions,
    imageurl: raw.image_url || raw.thumbnail_url,
    backimageurl: raw.back_image_url || raw.back_thumbnail_url,
  };

  return Card.fromGraphQl(fragment, {
    lang: 'en',
    encounterSets: {},
    packs: {
      [pack_code]: {
        id: pack_code,
        code: pack_code,
        name: pack_name,
        position: pack?.position ?? 0,
        cycle_position: cycle?.position ?? 999,
        cycle_code: cycle?.code ?? pack_code,
        cycle_name: cycle?.real_name || cycle?.name || pack_name,
        known: 0,
        total: 0,
      },
    },
    cardTypeNames: cardTypeNames(),
    subTypeNames: {},
    factionNames: factionNames(),
  });
}

/**
 * Write all of the custom cards in an arkham.build deck's fan_made_content
 * into the database, replacing any previous copies so edits made on
 * arkham.build are picked up the next time the deck is loaded.
 */
export async function upsertArkhamBuildCustomCards(
  db: Database,
  content: ArkhamBuildFanMadeContent
): Promise<Card[]> {
  const cards = flatMap(values(content.cards), raw => {
    const card = cardFromArkhamBuildFanMade(raw, content);
    return card ? [card] : [];
  });
  await db.replaceCards(cards);
  if (!cards.length) {
    return [];
  }
  // fromGraphQl produces plain objects; read back real Card instances for callers to cache.
  return await db.getCardsByCodes(cards.map(card => card.code));
}

export interface ParsedArkhamBuildMeta {
  meta: DeckMeta;
  fan_made_content?: ArkhamBuildFanMadeContent;
  hidden_slots?: Slots;
}

/**
 * arkham.build stores meta as a JSON string that can contain nested objects.
 * Split out the known object valued keys so DeckMeta stays string-only.
 */
export function parseArkhamBuildMeta(metaJson: string | undefined): ParsedArkhamBuildMeta {
  if (!metaJson) {
    return { meta: {} };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(metaJson);
  } catch (e) {
    return { meta: {} };
  }
  if (!parsed || typeof parsed !== 'object') {
    return { meta: {} };
  }
  const meta: DeckMeta = {};
  let fan_made_content: ArkhamBuildFanMadeContent | undefined;
  let hidden_slots: Slots | undefined;
  forEach(parsed, (value: unknown, key: string) => {
    if (key === 'fan_made_content') {
      if (value && typeof value === 'object' && 'cards' in value) {
        fan_made_content = value as ArkhamBuildFanMadeContent;
      }
    } else if (key === 'hidden_slots') {
      if (value && typeof value === 'object') {
        hidden_slots = value as Slots;
      }
    } else if (typeof value === 'string') {
      meta[key] = value;
    }
  });
  return { meta, fan_made_content, hidden_slots };
}

/**
 * Build the fan_made_content entries for the given codes, drawing card, pack
 * and cycle data from any of the known content blobs.
 */
export function buildFanMadeContent(
  codes: string[],
  sources: (ArkhamBuildFanMadeContent | undefined)[]
): ArkhamBuildFanMadeContent | undefined {
  const result: ArkhamBuildFanMadeContent = { cards: {}, packs: {}, cycles: {}, encounter_sets: {} };
  forEach(codes, code => {
    forEach(sources, source => {
      const card = source?.cards[code];
      if (!source || !card) {
        return true;
      }
      result.cards[code] = card;
      const pack = card.pack_code ? source.packs?.[card.pack_code] : undefined;
      if (pack && result.packs) {
        result.packs[pack.code] = pack;
        const cycle = pack.cycle_code ? source.cycles?.[pack.cycle_code] : undefined;
        if (cycle && result.cycles) {
          result.cycles[cycle.code] = cycle;
        }
      }
      const encounterSet = card.encounter_code ? source.encounter_sets?.[card.encounter_code] : undefined;
      if (encounterSet && result.encounter_sets) {
        result.encounter_sets[encounterSet.code] = encounterSet;
      }
      return false;
    });
  });
  return keys(result.cards).length ? result : undefined;
}

function deckRequirementsFromCard(
  card: Card,
  toUuid: (code: string) => string
): ArkhamBuildDeckRequirements | undefined {
  const requirements = card.deck_requirements;
  if (!requirements) {
    return undefined;
  }
  const required: { [code: string]: { [code: string]: string } } = {};
  forEach(requirements.card, requirement => {
    if (!requirement.code) {
      return;
    }
    const code = toUuid(requirement.code);
    required[code] = { [code]: code };
    forEach(requirement.alternates, alternate => {
      const alt = toUuid(alternate);
      required[code][alt] = alt;
    });
  });
  const random = flatMap(requirements.random, r => r.target && r.value ? [{ target: r.target, value: r.value }] : []);
  return {
    size: requirements.size,
    card: keys(required).length ? required : undefined,
    random: random.length ? random : undefined,
  };
}

function restrictionsFromCard(
  card: Card,
  toUuid: (code: string) => string
): ArkhamBuildRestrictions | undefined {
  if (!card.restrictions_all_investigators?.length) {
    return undefined;
  }
  const investigator: { [code: string]: string } = {};
  forEach(card.restrictions_all_investigators, code => {
    const id = toUuid(code);
    investigator[id] = id;
  });
  return { investigator };
}

function fanMadeCardFromCard(card: Card, uuid: string, toUuid: (code: string) => string): ArkhamBuildFanMadeCard {
  const result: ArkhamBuildFanMadeCard = {
    id: uuid,
    code: uuid,
    name: card.name,
    real_name: card.real_name,
    subname: card.subname,
    type_code: card.type_code,
    subtype_code: card.subtype_code,
    faction_code: card.faction_code || 'neutral',
    faction2_code: card.faction2_code,
    faction3_code: card.faction3_code,
    text: card.text,
    real_text: card.real_text,
    back_name: card.back_name,
    back_text: card.back_text,
    traits: card.traits,
    real_traits: card.real_traits,
    slot: card.slot,
    real_slot: card.real_slot,
    pack_code: card.pack_code,
    encounter_code: card.encounter_code,
    encounter_position: card.encounter_position,
    position: card.position,
    quantity: card.quantity,
    deck_limit: card.deck_limit,
    cost: card.cost,
    xp: card.xp,
    health: card.health,
    sanity: card.sanity,
    health_per_investigator: card.health_per_investigator,
    is_unique: card.is_unique,
    exceptional: card.exceptional,
    myriad: card.myriad,
    permanent: card.permanent,
    double_sided: card.double_sided,
    image_url: card.imageurl,
    thumbnail_url: card.thumbnail_url,
    back_image_url: card.backimageurl,
    flavor: card.flavor,
    back_flavor: card.back_flavor,
    illustrator: card.illustrator,
    skill_willpower: card.skill_willpower,
    skill_intellect: card.skill_intellect,
    skill_combat: card.skill_combat,
    skill_agility: card.skill_agility,
    skill_wild: card.skill_wild,
    // DeckOption is a plain data class, so a JSON round trip gives the raw shape back.
    deck_options: card.deck_options?.length ? JSON.parse(JSON.stringify(card.deck_options)) : undefined,
    deck_requirements: deckRequirementsFromCard(card, toUuid),
    restrictions: restrictionsFromCard(card, toUuid),
    official: false,
  };
  // sqlite hands back nulls for empty columns; leave those keys out entirely.
  return omitBy(result, isNil) as ArkhamBuildFanMadeCard;
}

/**
 * Build fan_made_content for our own custom cards, keyed by their uuid as
 * arkham.build expects. Cards without a uuid are skipped.
 */
export function fanMadeContentFromCards(cards: Card[]): ArkhamBuildFanMadeContent | undefined {
  const uuids: { [code: string]: string } = {};
  forEach(cards, card => {
    if (card.uuid) {
      uuids[card.code] = card.uuid;
    }
  });
  const toUuid = (code: string) => uuids[code] || code;
  const result: ArkhamBuildFanMadeContent = { cards: {}, packs: {}, cycles: {} };
  forEach(cards, card => {
    const uuid = uuids[card.code];
    if (!uuid) {
      return;
    }
    result.cards[uuid] = fanMadeCardFromCard(card, uuid, toUuid);
    if (result.packs && !result.packs[card.pack_code]) {
      result.packs[card.pack_code] = {
        code: card.pack_code,
        name: card.pack_name || card.pack_code,
        cycle_code: card.cycle_code,
        official: false,
      };
    }
    if (card.cycle_code && result.cycles && !result.cycles[card.cycle_code]) {
      result.cycles[card.cycle_code] = {
        code: card.cycle_code,
        name: card.cycle_name || card.cycle_code,
        official: false,
      };
    }
  });
  return keys(result.cards).length ? result : undefined;
}

export function mergeFanMadeContent(
  a: ArkhamBuildFanMadeContent | undefined,
  b: ArkhamBuildFanMadeContent | undefined
): ArkhamBuildFanMadeContent | undefined {
  if (!a || !b) {
    return a || b;
  }
  return {
    cards: { ...a.cards, ...b.cards },
    packs: { ...a.packs, ...b.packs },
    cycles: { ...a.cycles, ...b.cycles },
    encounter_sets: { ...a.encounter_sets, ...b.encounter_sets },
  };
}

// arkham.build meta keys that name a card in the key itself, e.g. `cus_<code>`.
const CODE_KEY_PREFIXES = ['cus_', 'attachments_', 'annotation_', 'card_pool_extension_'];
// Meta values that hold a card code, or a comma separated list of them.
const CODE_VALUE_KEYS = new Set(['alternate_front', 'alternate_back', 'transform_into', 'extra_deck']);
const CARD_POOL_CARD_PREFIX = 'card:';

function mapMetaValue(key: string, value: string, remap: (code: string) => string): string {
  if (CODE_VALUE_KEYS.has(key) || key.startsWith('attachments_')) {
    return map(value.split(','), remap).join(',');
  }
  if (key.startsWith('card_pool_extension_')) {
    // Entries are pack codes or `card:<code>`.
    return map(value.split(','), entry => entry.startsWith(CARD_POOL_CARD_PREFIX) ?
      `${CARD_POOL_CARD_PREFIX}${remap(entry.substring(CARD_POOL_CARD_PREFIX.length))}` :
      entry
    ).join(',');
  }
  return value;
}

function mapMetaKey(key: string, remap: (code: string) => string): string {
  const prefix = find(CODE_KEY_PREFIXES, p => key.startsWith(p));
  return prefix ? `${prefix}${remap(key.substring(prefix.length))}` : key;
}

/**
 * Every card code referenced by deck meta, in keys or values.
 */
export function metaCardCodes(meta: DeckMeta | undefined): string[] {
  const codes: string[] = [];
  const collect = (code: string) => {
    if (code) {
      codes.push(code);
    }
    return code;
  };
  forEach(meta, (value, key) => {
    mapMetaKey(key, collect);
    if (value) {
      mapMetaValue(key, value, collect);
    }
  });
  return codes;
}

/**
 * Rewrite the card codes in deck meta (keys and values) using the given mapping,
 * leaving anything unmapped as is.
 */
export function remapMetaCodes(meta: DeckMeta, codes: { [code: string]: string }): DeckMeta {
  const remap = (code: string) => codes[code] || code;
  const result: DeckMeta = {};
  forEach(meta, (value, key) => {
    result[mapMetaKey(key, remap)] = value ? mapMetaValue(key, value, remap) : value;
  });
  return result;
}

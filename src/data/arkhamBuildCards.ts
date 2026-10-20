import { forEach, filter } from 'lodash';

import Card, { CardStatusType, normalize_array, searchNormalize } from './types/Card';
import DeckOption from './types/DeckOption';
import DeckRequirement from './types/DeckRequirement';
import Database from './sqlite/Database';

const USES_REGEX = /.*Uses\s*\([0-9]+(\s\[per_investigator\])?\s(.+)\)\..*/;
const BONDED_REGEX = /.*Bonded\s*\((.+?)\)\..*/;
const SEAL_REGEX = /.*Seal \(.+\)\..*/;

export interface ArkhamBuildFanMadeCard {
  id: string;
  code: string;
  name: string;
  real_name?: string;
  subname?: string;
  real_subname?: string;
  type_code: string;
  faction_code: string;
  faction2_code?: string;
  faction3_code?: string;
  text?: string;
  real_text?: string;
  back_text?: string;
  real_back_text?: string;
  back_name?: string;
  real_back_name?: string;
  traits?: string;
  real_traits?: string;
  slot?: string;
  real_slot?: string;
  pack_code?: string;
  position?: number;
  quantity?: number;
  deck_limit?: number;
  cost?: number;
  xp?: number;
  health?: number;
  sanity?: number;
  is_unique?: boolean;
  exceptional?: boolean;
  myriad?: boolean;
  permanent?: boolean;
  double_sided?: boolean;
  image_url?: string;
  thumbnail_url?: string;
  back_image_url?: string;
  back_thumbnail_url?: string;
  flavor?: string;
  real_flavor?: string;
  back_flavor?: string;
  illustrator?: string;
  skill_willpower?: number;
  skill_intellect?: number;
  skill_combat?: number;
  skill_agility?: number;
  skill_wild?: number;
  deck_options?: any[];
  deck_requirements?: any;
  restrictions?: any;
  official?: boolean;
}

export interface ArkhamBuildFanMadeContent {
  cards: { [id: string]: ArkhamBuildFanMadeCard };
  packs?: { [code: string]: { code: string; name: string; real_name?: string; official?: boolean } };
  cycles?: { [code: string]: { code: string; name: string; real_name?: string; official?: boolean } };
  encounter_sets?: { [code: string]: any };
}

function cardFromArkhamBuildFanMade(raw: ArkhamBuildFanMadeCard, tabooSetId: number): Card {
  const card = new Card();

  card.code = raw.code || raw.id;
  card.id = `${card.code}-${tabooSetId}`;
  card.taboo_set_id = tabooSetId;
  card.status = CardStatusType.CUSTOM;

  card.name = raw.name;
  card.real_name = raw.real_name || raw.name;
  card.renderName = raw.name;
  card.type_code = raw.type_code as any;
  card.type_name = typeCodeToName(raw.type_code);
  card.faction_code = raw.faction_code as any;
  card.faction_name = raw.faction_code;
  card.faction2_code = raw.faction2_code as any;
  card.faction3_code = raw.faction3_code as any;
  card.pack_code = raw.pack_code || 'custom';
  card.pack_name = 'Custom Content';

  card.subname = raw.subname;
  card.renderSubname = raw.subname || raw.real_subname;
  card.firstName = raw.type_code === 'investigator' && raw.name.indexOf(' ') !== -1
    ? raw.name.substring(0, raw.name.indexOf(' ')).replace(/"/g, '')
    : raw.name;

  card.position = raw.position;
  card.quantity = raw.quantity || 1;
  card.deck_limit = raw.deck_limit ?? (raw.type_code === 'investigator' ? 1 : 2);
  card.cost = raw.cost;
  card.xp = raw.xp;
  card.health = raw.health;
  card.sanity = raw.sanity;
  card.is_unique = raw.is_unique;
  card.exceptional = raw.exceptional;
  card.permanent = raw.permanent;
  card.double_sided = raw.double_sided;
  card.illustrator = raw.illustrator;

  card.text = raw.text;
  card.real_text = raw.real_text || raw.text;
  card.flavor = raw.flavor || raw.real_flavor;
  card.back_name = raw.back_name || raw.real_back_name;
  card.back_text = raw.back_text || raw.real_back_text;
  card.back_flavor = raw.back_flavor;

  card.traits = raw.traits || raw.real_traits;
  card.real_traits = raw.real_traits || raw.traits;
  card.slot = raw.slot || raw.real_slot;
  card.real_slot = raw.real_slot || raw.slot;

  card.skill_willpower = raw.skill_willpower;
  card.skill_intellect = raw.skill_intellect;
  card.skill_combat = raw.skill_combat;
  card.skill_agility = raw.skill_agility;
  card.skill_wild = raw.skill_wild;

  // Effective skills
  const wild = raw.skill_wild || 0;
  if (raw.type_code !== 'investigator' && wild > 0) {
    card.eskill_willpower = (raw.skill_willpower || 0) > 0 ? (raw.skill_willpower || 0) + wild : undefined;
    card.eskill_intellect = (raw.skill_intellect || 0) > 0 ? (raw.skill_intellect || 0) + wild : undefined;
    card.eskill_combat = (raw.skill_combat || 0) > 0 ? (raw.skill_combat || 0) + wild : undefined;
    card.eskill_agility = (raw.skill_agility || 0) > 0 ? (raw.skill_agility || 0) + wild : undefined;
  }

  // Images - use arkham.build CDN URLs directly
  card.imageurl = raw.image_url || raw.thumbnail_url;
  card.backimageurl = raw.back_image_url || raw.back_thumbnail_url;

  // Deck options & requirements
  if (raw.deck_options) {
    card.deck_options = DeckOption.parseList(raw.deck_options);
  }
  if (raw.deck_requirements) {
    card.deck_requirements = DeckRequirement.parse(raw.deck_requirements);
  }

  // Restrictions
  if (raw.restrictions) {
    const investigatorCodes = raw.restrictions.investigator
      ? Object.keys(raw.restrictions.investigator)
      : undefined;
    card.has_restrictions = !!investigatorCodes?.length;
    card.restrictions_investigator = investigatorCodes?.[0];
  }

  // Derived fields
  const realText = card.real_text || '';
  const usesMatch = realText.match(USES_REGEX);
  const usesRaw = usesMatch ? usesMatch[2].toLowerCase() : undefined;
  card.uses = usesRaw === 'charge' ? 'charges' : usesRaw;

  const bondedMatch = realText.match(BONDED_REGEX);
  card.bonded_name = bondedMatch ? bondedMatch[1] : undefined;
  card.seal = !!realText.match(SEAL_REGEX);

  card.myriad = raw.myriad || (!!realText && realText.indexOf('Myriad.') !== -1);
  card.advanced = !!realText && realText.indexOf('Advanced.') !== -1;

  // Normalized fields
  card.real_traits_normalized = normalize_array(card.real_traits?.split('.')) || undefined;
  card.traits_normalized = normalize_array(card.traits?.split('.')) || undefined;
  card.real_slots_normalized = normalize_array(card.real_slot?.split('.')) || undefined;
  card.slots_normalized = normalize_array(card.slot?.split('.')) || undefined;

  // Search fields
  const lang = 'en';
  card.s_search_name = searchNormalize(
    filter([card.renderName, card.renderSubname], x => !!x).join(' '), lang
  );
  card.s_search_name_back = searchNormalize(
    filter([card.name, card.subname, card.back_name], x => !!x).join(' '), lang
  );
  card.s_search_game = searchNormalize(
    filter([card.text, card.traits], x => !!x).join(' '), lang
  );
  card.s_search_game_back = card.back_text ? searchNormalize(card.back_text, lang) : '';
  card.s_search_flavor = card.flavor ? searchNormalize(card.flavor, lang) : '';
  card.s_search_flavor_back = card.back_flavor ? searchNormalize(card.back_flavor, lang) : '';
  card.s_search_real_name = searchNormalize(
    filter([card.real_name, card.subname], x => !!x).join(' '), lang
  );
  card.s_search_real_name_back = searchNormalize(
    filter([card.real_name, card.subname], x => !!x).join(' '), lang
  );
  card.s_search_real_game = searchNormalize(
    filter([card.real_text, card.real_traits], x => !!x).join(' '), lang
  );

  // Sort fields
  card.sort_by_type = Card.typeHeaderOrder().indexOf(Card.typeSortHeader(card as any, undefined));
  card.sort_by_faction = Card.factionHeaderOrder().indexOf(
    Card.factionSortHeader(card as any, card as any, undefined)
  );
  card.sort_by_pack = -1;
  card.sort_by_cycle = 0;
  card.sort_by_slot = Card.slotPosition(card as any);

  // Browse visibility - custom cards only visible when in deck
  card.browse_visible = 16; // custom flag only
  if (card.deck_limit && card.deck_limit > 0) {
    card.browse_visible += 1; // goes in decks
  }

  card.mythos_card = false;
  card.cycle_code = raw.pack_code || 'custom';
  card.cycle_name = 'Custom Content';

  return card;
}

function typeCodeToName(typeCode: string): string {
  switch (typeCode) {
    case 'investigator': return 'Investigator';
    case 'asset': return 'Asset';
    case 'event': return 'Event';
    case 'skill': return 'Skill';
    case 'treachery': return 'Treachery';
    case 'enemy': return 'Enemy';
    default: return typeCode;
  }
}

/**
 * Parse fan_made_content from an arkham.build deck's meta and insert
 * any missing custom cards into the database.
 */
export async function ensureArkhamBuildCustomCards(
  db: Database,
  meta: any,
  tabooSetId: number
): Promise<void> {
  if (!meta) return;

  let fanMadeContent: ArkhamBuildFanMadeContent | undefined;
  if (typeof meta === 'string') {
    try {
      const parsed = JSON.parse(meta);
      fanMadeContent = parsed.fan_made_content;
    } catch (e) {
      return;
    }
  } else {
    fanMadeContent = meta.fan_made_content;
  }

  if (!fanMadeContent?.cards || Object.keys(fanMadeContent.cards).length === 0) {
    return;
  }

  const codes = Object.keys(fanMadeContent.cards);
  const existingCards = await db.getCardsByCodes(codes, tabooSetId);
  const existingCodes = new Set(existingCards.map(c => c.code));

  const newCards: Card[] = [];
  forEach(fanMadeContent.cards, (cardData) => {
    if (!existingCodes.has(cardData.code || cardData.id)) {
      newCards.push(cardFromArkhamBuildFanMade(cardData, tabooSetId));
    }
  });

  if (newCards.length > 0) {
    try {
      await db.insertCards(newCards);
    } catch (e) {
      console.log('[arkham.build] Error inserting custom cards:', e);
    }
  }
}

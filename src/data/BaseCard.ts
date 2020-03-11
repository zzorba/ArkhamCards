import { filter } from 'lodash';
import { t } from 'ttag';

import { TraumaAndCardData } from 'actions/types';
import { FactionCodeType, TypeCodeType, SkillCodeType } from '../constants';
import CardRestrictions from './CardRestrictions';
import DeckRequirement from './DeckRequirement';
import DeckOption from './DeckOption';

export default class BaseCard {
  protected static SCHEMA = {
    id: 'string',
    code: { type: 'string', indexed: true },
    taboo_set_id: 'int?',
    taboo_placeholder: 'bool?',
    taboo_text_change: 'string?',
    pack_code: 'string',
    pack_name: 'string',
    type_code: { type: 'string', indexed: true },
    type_name: 'string',
    subtype_code: 'string?',
    subtype_name: 'string?',
    slot: 'string?',
    faction_code: { type: 'string', optional: true, indexed: true },
    faction_name: 'string?',
    faction2_code: { type: 'string', optional: true, indexed: true },
    faction2_name: 'string?',
    position: 'int',
    enemy_damage: 'int?',
    enemy_horror: 'int?',
    enemy_fight: 'int?',
    enemy_evade: 'int?',
    encounter_code: 'string?',
    encounter_name: 'string?',
    encounter_position: 'int?',
    exceptional: 'bool?',
    xp: { type: 'int', optional: true, indexed: true },
    extra_xp: 'int?',
    victory: 'int?',
    vengeance: 'int?',
    renderName: 'string',
    renderSubname: 'string?',
    name: 'string',
    real_name: 'string',
    subname: 'string?',
    firstName: 'string?',
    illustrator: 'string?',
    text: 'string?',
    flavor: 'string?',
    cost: 'int?',
    real_text: 'string?',
    back_name: 'string?',
    back_text: 'string?',
    back_flavor: 'string?',
    quantity: 'int?',
    spoiler: 'bool?',
    stage: 'int?', // Act/Agenda deck
    clues: 'int?',
    shroud: 'int?',
    clues_fixed: 'bool?',
    doom: 'int?',
    health: 'int?',
    health_per_investigator: 'bool?',
    sanity: 'int?',
    deck_limit: 'int?',
    traits: 'string?',
    real_traits: 'string?',
    is_unique: 'bool?',
    exile: 'bool?',
    hidden: 'bool?',
    myriad: 'bool?',
    permanent: 'bool?',
    double_sided: 'bool',
    url: 'string?',
    octgn_id: 'string?',
    imagesrc: 'string?',
    backimagesrc: 'string?',
    skill_willpower: 'int?',
    skill_intellect: 'int?',
    skill_combat: 'int?',
    skill_agility: 'int?',
    skill_wild: 'int?',
    // Effective skills (add wilds to them)
    eskill_willpower: 'int?',
    eskill_intellect: 'int?',
    eskill_combat: 'int?',
    eskill_agility: 'int?',
    linked_to_code: 'string?',
    linked_to_name: 'string?',

    // Parsed data (from original)
    restrictions: 'CardRestrictions?',
    deck_requirements: 'DeckRequirement?',
    deck_options: 'DeckOption[]',
    linked_card: 'Card',
    back_linked: 'bool?',

    // Derived data.
    altArtInvestigator: 'bool?',
    cycle_name: 'string?',
    cycle_code: 'string?',
    has_restrictions: 'bool',
    has_upgrades: 'bool?',
    seal: 'bool?',
    traits_normalized: 'string?',
    real_traits_normalized: 'string?',
    slots_normalized: 'string?',
    uses: 'string?',
    bonded_name: { type: 'string', optional: true, indexed: true },
    heals_horror: 'bool?',
    sort_by_type: 'int',
    sort_by_faction: 'int',
    sort_by_pack: 'int',
  };
  public id!: string;
  public code!: string;
  public taboo_set_id!: number | null;
  public taboo_placeholder?: boolean;
  public taboo_text_change!: string | null;
  public pack_code!: string;
  public pack_name!: string;
  public type_code!: TypeCodeType;
  public type_name!: string;
  public subtype_code?: 'basicweakness' | 'weakness';
  public subtype_name!: string | null;
  public slot!: string | null;
  public faction_code?: FactionCodeType;
  public faction_name!: string | null;
  public faction2_code?: FactionCodeType;
  public faction2_name!: string | null;
  public position!: number;
  public enemy_damage!: number | null;
  public enemy_horror!: number | null;
  public enemy_fight!: number | null;
  public enemy_evade!: number | null;
  public encounter_code!: string | null;
  public encounter_name!: string | null;
  public encounter_position!: number | null;
  public exceptional?: boolean;
  public xp!: number | null;
  public extra_xp!: number | null;
  public victory!: number | null;
  public vengeance!: number | null;
  public renderName!: string;
  public renderSubname!: string | null;
  public name!: string;
  public real_name!: string;
  public subname!: string | null;
  public firstName!: string | null;
  public illustrator!: string | null;
  public text!: string | null;
  public flavor!: string | null;
  public cost!: number | null;
  public real_text!: string | null;
  public back_name!: string | null;
  public back_text!: string | null;
  public back_flavor!: string | null;
  public quantity!: number | null;
  public spoiler?: boolean;
  public stage!: number | null; // Act/Agenda deck
  public clues!: number | null;
  public shroud!: number | null;
  public clues_fixed?: boolean;
  public doom!: number | null;
  public health!: number | null;
  public health_per_investigator?: boolean;
  public sanity!: number | null;
  public deck_limit!: number | null;
  public traits!: string | null;
  public real_traits!: string | null;
  public is_unique?: boolean;
  public exile?: boolean;
  public hidden?: boolean;
  public myriad?: boolean;
  public permanent?: boolean;
  public double_sided?: boolean;
  public url!: string | null;
  public octgn_id!: string | null;
  public imagesrc!: string | null;
  public backimagesrc!: string | null;
  public skill_willpower!: number | null;
  public skill_intellect!: number | null;
  public skill_combat!: number | null;
  public skill_agility!: number | null;
  public skill_wild!: number | null;
  // Effective skills (add wilds to them)
  public eskill_willpower!: number | null;
  public eskill_intellect!: number | null;
  public eskill_combat!: number | null;
  public eskill_agility!: number | null;
  public linked_to_code!: string | null;
  public linked_to_name!: string | null;

  // Parsed data (from original)
  public restrictions?: CardRestrictions;
  public deck_requirements?: DeckRequirement;
  public deck_options!: DeckOption[];
  public linked_card?: BaseCard;
  public back_linked?: boolean;

  // Derived data.
  public altArtInvestigator?: boolean;
  public cycle_name!: string | null;
  public cycle_code!: string | null;
  public has_restrictions!: boolean;
  public has_upgrades?: boolean;
  public traits_normalized!: string | null;
  public real_traits_normalized!: string | null;
  public slots_normalized!: string | null;
  public uses!: string | null;
  public bonded_name!: string | null;
  public seal?: boolean;
  public heals_horror?: boolean;
  public sort_by_type!: number;
  public sort_by_faction!: number;
  public sort_by_pack!: number;

  public cardName(): string {
    return this.subname ? t`${this.name} <i>(${this.subname})</i>` : this.name;
  }

  factionCode(): FactionCodeType {
    return this.faction_code || 'neutral';
  }

  eliminated(traumaData?: TraumaAndCardData) {
    if (!traumaData) {
      return false;
    }
    if (traumaData.killed || traumaData.insane) {
      return true;
    }
    if ((this.health || 0) <= (traumaData.physical || 0) ||
      (this.sanity || 0) <= (traumaData.mental || 0)) {
      return true;
    }
    return false;
  }

  hasTrauma(traumaData?: TraumaAndCardData) {
    return this.eliminated(traumaData) || (traumaData && (
      (traumaData.physical || 0) > 0 ||
      (traumaData.mental || 0) > 0
    ));
  }

  traumaString(traumaData?: TraumaAndCardData) {
    if (!traumaData) {
      return t`None`;
    }
    const parts = [];
    if (traumaData.killed || (this.health || 0) <= (traumaData.physical || 0)) {
      return t`Killed`;
    }
    if (traumaData.insane || (this.sanity || 0) <= (traumaData.mental || 0)) {
      return t`Insane`;
    }
    if (traumaData.physical !== 0) {
      parts.push(t`${traumaData.physical} Physical`);
    }
    if (traumaData.mental !== 0) {
      parts.push(t`${traumaData.mental} Mental`);
    }
    if (!parts.length) {
      return t`None`;
    }
    return parts.join(', ');
  }

  realCost(linked?: boolean) {
    if (this.type_code !== 'asset' && this.type_code !== 'event') {
      return null;
    }
    if (
      this.code === '02010' ||
      this.code === '03238' ||
      this.cost === -2
    ) {
      return 'X';
    }
    if (this.permanent ||
      this.double_sided ||
      linked ||
      this.cost === null
    ) {
      return '-';
    }
    return `${this.cost}`;
  }

  costString(linked?: boolean) {
    const actualCost = this.realCost(linked);
    if (actualCost === null) {
      return '';
    }
    return t`Cost: ${actualCost}`;
  }

  skillCount(skill: SkillCodeType): number {
    switch (skill) {
      case 'willpower': return this.skill_willpower || 0;
      case 'intellect': return this.skill_intellect || 0;
      case 'combat': return this.skill_combat || 0;
      case 'agility': return this.skill_agility || 0;
      case 'wild': return this.skill_wild || 0;
      default: {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const _exhaustiveCheck: never = skill;
        return 0;
      }
    }
  }

  investigatorSelectOptions(): DeckOption[] {
    if (this.type_code === 'investigator' && this.deck_options) {
      return filter(this.deck_options, option => {
        return !!(option.faction_select && option.faction_select.length > 0) ||
          !!(option.deck_size_select && option.deck_size_select.length > 0);
      });
    }
    return [];
  }
}

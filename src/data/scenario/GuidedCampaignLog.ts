import { cloneDeep, find, forEach, sumBy } from 'lodash';
import {
  Effect,
  CampaignLogEffect,
  CampaignLogCountEffect,
  CampaignLogCardsEffect,
  InvestigatorStatus,
} from './types';

interface BasicEntry {
  id: string;
}

interface CampaignLogCardEntry extends BasicEntry {
  type: 'card';
  cards: string[];
}

interface CampaignLogCountEntry extends BasicEntry {
  type: 'count';
  count: number;
}

interface CampaignLogBasicEntry extends BasicEntry {
  type: 'basic';
}

type CampaignLogEntry = CampaignLogCountEntry |
  CampaignLogBasicEntry |
  CampaignLogCardEntry;

interface EntrySection {
  entries: CampaignLogEntry[];
  crossedOut: {
    [key: string]: true | undefined;
  };
  sectionCrossedOut?: boolean;
};

interface CountSection {
  count: number;
}

export interface EffectsWithInput {
  input?: string[];
  counterInput?: number;
  effects: Effect[];
}

interface ScenarioData {
  leadInvestigator?: string;
  investigatorStatus: {
    [code: string]: InvestigatorStatus;
  };
}

export default class GuidedCampaignLog {
  sections: {
    [section: string]: EntrySection | undefined;
  };
  countSections: {
    [section: string]: CountSection | undefined;
  };
  scenarioData: {
    [scenario: string]: ScenarioData | undefined;
  };

  static isCampaignLogEffect(effect: Effect): boolean {
    switch (effect.type) {
      case 'campaign_log':
      case 'campaign_log_count':
      case 'campaign_log_cards':
      case 'scenario_data':
        return true;
      default:
        return false;
    }
  }

  constructor(
    effectsWithInput: EffectsWithInput[],
    readThrough?: GuidedCampaignLog
  ) {
    const hasRelevantEffects = !!find(
      effectsWithInput,
      effects => !!find(
        effects.effects,
        effect => GuidedCampaignLog.isCampaignLogEffect(effect)
      )
    );
    if (!hasRelevantEffects) {
      // No relevant effects, so shallow copy will do.
      this.sections = readThrough ? readThrough.sections : {};
      this.countSections = readThrough ? readThrough.countSections : {};
      this.scenarioData = readThrough ? readThrough.scenarioData : {};
    } else {
      this.sections = readThrough ? cloneDeep(readThrough.sections) : {};
      this.countSections = readThrough ? cloneDeep(readThrough.countSections) : {};
      this.scenarioData = readThrough ? cloneDeep(readThrough.scenarioData) : {};
      forEach(effectsWithInput, ({ effects, input, counterInput }) => {
        forEach(effects, effect => {
          switch (effect.type) {
            case 'scenario_data':
              switch (effect.setting) {
                case 'investigator_status':
                  if (effect.investigator !== '$input_value') {
                    throw new Error('investigator_status should always be $input_value');
                  }

                  break;
                case 'lead_investigator':
                  break;
              }
              break;
            case 'campaign_log':
              this.handleCampaignLogEffect(effect, input);
              break;
            case 'campaign_log_count': {
              this.handleCampaignLogCountEffect(effect, counterInput);
              break;
            }
            case 'campaign_log_cards':
              this.handleCampaignLogCardsEffect(effect);
              break;
            default:
              break;
          }
        });
      });
    }
  }

  private handleCampaignLogEffect(effect: CampaignLogEffect, input?: string[]) {
    const section: EntrySection = this.sections[effect.section] || {
      entries: [],
      crossedOut: {},
    };
    const ids = (effect.id === '$input_value') ? input : [effect.id];
    forEach(ids, id => {
      if (effect.cross_out) {
        section.crossedOut[id] = true;
      } else {
       section.entries.push({
         type: 'basic',
         id,
       });
      }
    });
    this.sections[effect.section] = section;
  }

  private handleCampaignLogCountEffect(effect: CampaignLogCountEffect, counterInput?: number) {
    const value: number = (
      (effect.operation === 'add_input' || effect.operation == 'set_input') ? counterInput : effect.value
    ) || 0;
    if (!effect.id) {
      // Section entry
      const section = this.countSections[effect.section] || {
        count: 0,
      };
      const count = section.count;
      switch (effect.operation) {
        case 'add':
        case 'add_input':
          section.count = count + value;
          break;
        case 'set':
        case 'set_input':
          section.count = value;
          break;
      }
      this.countSections[effect.section] = section;
    } else {
      const section = this.sections[effect.section] || {
        entries: [],
        crossedOut: {},
      };
      // Normal entry
      const entry = find(section.entries, entry => entry.id === effect.id);
      const count = entry && entry.type === 'count' ? entry.count : 0;
      switch (effect.operation) {
        case 'add':
        case 'add_input':
          if (entry && entry.type === 'count') {
            entry.count = count + value;
          } else {
            section.entries.push({
              type: 'count',
              id: effect.id,
              count: count + value,
            });
          }
          break;
        case 'set':
        case 'set_input':
          if (entry && entry.type === 'count') {
            entry.count = value;
          } else {
            section.entries.push({
              type: 'count',
              id: effect.id,
              count: value,
            });
          }
          break;
      }
      this.sections[effect.section] = section;
    }
  }

  private cardsIds(effect: CampaignLogCardsEffect, input?: string[]): string[] | undefined {
    if (effect.id === '$input_value') {
      return input;
    }
    if (effect.id) {
      return [effect.id];
    }
    return undefined;
  }

  private handleCampaignLogCardsEffect(effect: CampaignLogCardsEffect, input?: string[]) {
    const sectionIds: string[] = effect.section === '$input_value' ? (input || []) : [effect.section];
    const ids: string[] | undefined = this.cardsIds(effect, input);
    forEach(sectionIds, sectionId => {
      const section: EntrySection = this.sections[sectionId] || {
        entries: [],
        crossedOut: {},
      };
      if (!ids) {
        // Section entry, probably just a cross out.
        if (effect.cross_out) {
          section.sectionCrossedOut = true;
        }
      } else {
        forEach(ids, id => {
          const cards: string[] = [];
          if (effect.section === '$input_value') {
            cards.push(sectionId);
          } else if (effect.id === '$input_value') {
            cards.push(id);
          } else if (effect.cards) {
            switch (effect.cards) {
              case '$input_value':
              case '$lead_investigator':
                forEach(input || [], card => cards.push(card));
                break;
            }
          }

          // Normal entry
          if (effect.cross_out) {
            section.crossedOut[id] = true;
          } else {
            const entry = find(section.entries, entry => entry.id === id);
            if (!entry) {
              section.entries.push({
                type: 'card',
                id,
                cards,
              });
            }
          }
        });
      }
      // Update the section
      this.sections[sectionId] = section;
    });
  }

  sectionExists(sectionId: string): boolean {
    const section = this.sections[sectionId];
    if (!section) {
      return false;
    }
    return !section.sectionCrossedOut;
  }

  check(sectionId: string, id: string): boolean {
    const section = this.sections[sectionId];
    if (!section) {
      return false;
    }
    if (section.crossedOut[id]) {
      return false;
    }
    const entry = find(section.entries, entry => entry.id === id);
    return !!entry;
  }

  count(sectionId: string, id: string): number {
    if (id === '$count') {
      const section = this.countSections[sectionId];
      if (section) {
        return section.count;
      }
      return 0;
    } else {
      const section = this.sections[sectionId];
      if (section) {
        if (id === '$num_entries') {
          return sumBy(
            section.entries,
            entry => section.crossedOut[entry.id] ? 0 : 1
          );
        }
        if (section.crossedOut[id]) {
          return 0;
        }
        const entry = find(section.entries, entry => entry.id === id);
        if (entry && entry.type === 'count') {
          return entry.count;
        }
      }
    }
    return 0;
  }
}

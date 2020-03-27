import { cloneDeep, find, forEach, sumBy } from 'lodash';
import {
  Effect,
  CampaignLogEffect,
  CampaignLogCountEffect,
  CampaignLogCardsEffect,
  ScenarioDataEffect,
  ScenarioStatus,
  InvestigatorStatus,
  Difficulty,
  EffectsWithInput,
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

interface ScenarioData {
  leadInvestigator?: string;
  investigatorStatus: {
    [code: string]: InvestigatorStatus;
  };
}

interface CampaignData {
  scenarioStatus: {
    [code: string]: ScenarioStatus | undefined;
  };
  scenarioReplayCount: {
    [code: string]: number | undefined;
  };
  result?: 'win' | 'lose';
  difficulty?: Difficulty;
  nextScenario?: string;
}

export default class GuidedCampaignLog {
  scenarioId: string;
  sections: {
    [section: string]: EntrySection | undefined;
  };
  countSections: {
    [section: string]: CountSection | undefined;
  };
  scenarioData: {
    [scenario: string]: ScenarioData | undefined;
  };
  campaignData: CampaignData;

  static isCampaignLogEffect(effect: Effect): boolean {
    switch (effect.type) {
      case 'campaign_log':
      case 'campaign_log_count':
      case 'campaign_log_cards':
      case 'scenario_data':
      case 'campaign_data':
        return true;
      default:
        return false;
    }
  }

  constructor(
    scenarioId: string,
    effectsWithInput: EffectsWithInput[],
    readThrough?: GuidedCampaignLog
  ) {
    this.scenarioId = scenarioId;
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
      this.campaignData = readThrough ? readThrough.campaignData : {
        scenarioStatus: {},
        scenarioReplayCount: {},
      };
    } else {
      this.sections = readThrough ? cloneDeep(readThrough.sections) : {};
      this.countSections = readThrough ? cloneDeep(readThrough.countSections) : {};
      this.scenarioData = readThrough ? cloneDeep(readThrough.scenarioData) : {};
      this.campaignData = readThrough ? cloneDeep(readThrough.campaignData) : {
        scenarioStatus: {},
        scenarioReplayCount: {},
      };
      forEach(effectsWithInput, ({ effects, input, counterInput }) => {
        forEach(effects, effect => {
          switch (effect.type) {
            case 'campaign_data':
              switch (effect.setting) {
                case 'result':
                  this.campaignData.result = effect.value;
                  break;
                case 'difficulty':
                  this.campaignData.difficulty = effect.value;
                  break;
                case 'skip_scenario':
                  this.campaignData.scenarioStatus[effect.scenario] = 'skipped';
                  break;
                case 'replay_scenario': {
                  const replayCount = this.campaignData.scenarioReplayCount[effect.scenario] || 0;
                  this.campaignData.scenarioReplayCount[effect.scenario] = replayCount + 1;
                  break;
                }
                case 'next_scenario':
                  this.campaignData.nextScenario = effect.scenario;
                  break;
                case 'choose_investigators':
                  // TODO: choose new investigators?
                  break;
              }
              break;
            case 'scenario_data':
              this.handleScenarioDataEffect(
                effect,
                scenarioId,
                input
              );
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

  private handleScenarioDataEffect(
    effect: ScenarioDataEffect,
    scenarioId: string,
    input: string[] | undefined
  ) {
    if (effect.setting === 'scenario_status') {
      this.campaignData.scenarioStatus[scenarioId] = effect.status;
      return;
    }
    // All investigator status from here on out.
    const scenario = this.scenarioData[scenarioId] || {
      investigatorStatus: {},
    };

    if (effect.investigator !== '$input_value') {
      throw new Error('investigator_status should always be $input_value');
    }
    if (!input) {
      throw new Error('input required for scenarioData effect');
    }
    switch (effect.setting) {
      case 'investigator_status':
        forEach(input, code => {
          scenario.investigatorStatus[code] = effect.investigator_status;
        });
        break;
      case 'lead_investigator':
        scenario.leadInvestigator = input[0];
        break;
    }
    this.scenarioData[scenarioId] = scenario;
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

  leadInvestigatorChoice(): string {
    const scenario = this.scenarioData[this.scenarioId];
    if (!scenario || !scenario.leadInvestigator) {
      throw new Error('Lead Investigator called before decision');
    }
    return scenario.leadInvestigator;
  }

  investigatorResolutionStatus(): {
    [code: string]: InvestigatorStatus;
  } {
    const scenario = this.scenarioData[this.scenarioId];
    if (!scenario) {
      throw new Error('investigatorResolutionStatus called before decision');
    }
    return scenario.investigatorStatus;
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

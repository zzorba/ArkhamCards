import { find, findIndex, filter, flatMap, forEach, reverse, slice } from 'lodash';
import { ngettext, msgid, t } from 'ttag';

import { GuideStartCustomSideScenarioInput } from '@actions/types';
import { ProcessedCampaign, ProcessedScenario, ScenarioId } from '@data/scenario';
import { createInvestigatorStatusStep } from './fixedSteps';
import GuidedCampaignLog from './GuidedCampaignLog';
import CampaignStateHelper from './CampaignStateHelper';
import ScenarioStateHelper from './ScenarioStateHelper';
import ScenarioGuide from './ScenarioGuide';
import { FullCampaign, Scenario, Supply } from './types';

export interface CampaignLog {
  campaignId: string;
  sections: {
    section: string;
    entries: {
      id: string;
      text: string;
    }[];
  }[];
  supplies: Supply[];
}

interface LogSection {
  section: string;
}

export interface LogEntryCard extends LogSection {
  type: 'card';
  code: string;
}

interface LogEntrySectionCount extends LogSection {
  type: 'section_count';
}

interface LogEntryText extends LogSection {
  type: 'text';
  text: string;
}

interface LogEntrySupplies extends LogSection {
  type: 'supplies';
  supply: Supply;
}

type LogEntry = LogEntrySectionCount | LogEntryCard | LogEntryText | LogEntrySupplies;
const CARD_REGEX = /\d\d\d\d\d[a-z]?/;
export const CAMPAIGN_SETUP_ID = '$campaign_setup';

/**
 * Wrapper utility to provide structured access to campaigns.
 */
export default class CampaignGuide {
  private campaign: FullCampaign;
  private log: CampaignLog;

  private sideCampaign: FullCampaign;

  constructor(
    campaign: FullCampaign,
    log: CampaignLog,
    sideCampaign: FullCampaign
  ) {
    this.campaign = campaign;
    this.log = log;
    this.sideCampaign = sideCampaign;
  }

  sideScenarios(): Scenario[] {
    return flatMap(
      this.sideCampaign.campaign.scenarios,
      scenarioId => find(this.sideCampaign.scenarios, scenario => scenario.id === scenarioId) || []
    );
  }

  campaignCycleCode() {
    return this.campaign.campaign.id;
  }

  campaignName() {
    return this.campaign.campaign.name;
  }

  campaignVersion() {
    return this.campaign.campaign.version;
  }

  getFullScenarioName(
    encodedScenarioId: string
  ): string | undefined {
    const scenarioId = this.parseScenarioId(encodedScenarioId);
    const scenario = find(
      this.campaign.scenarios,
      scenario => scenario.id === scenarioId.scenarioId
    );
    return scenario && scenario.full_name;
  }

  findScenarioData(
    id: string
  ): Scenario | undefined {
    return find(
      this.campaign.scenarios,
      scenario => scenario.id === id
    );
  }

  getScenario(
    id: string,
    campaignState: CampaignStateHelper
  ): ProcessedScenario | undefined {
    return find(
      this.processAllScenarios(campaignState).scenarios,
      scenario => scenario.scenarioGuide.id === id
    );
  }

  campaignLogSections() {
    return this.campaign.campaign.campaign_log;
  }

  prologueScenarioId(): string {
    return this.campaign.campaign.scenarios[0];
  }

  scenarioIds() {
    return this.campaign.campaign.scenarios;
  }

  processAllScenarios(
    campaignState: CampaignStateHelper,
  ): ProcessedCampaign {
    const scenarios: ProcessedScenario[] = [];
    let campaignLog: GuidedCampaignLog = new GuidedCampaignLog(
      [],
      this,
      campaignState
    );
    forEach(this.allScenarioIds(), scenarioId => {
      if (!find(scenarios, scenario => scenario.scenarioGuide.id === scenarioId)) {
        const scenario = this.findScenario(scenarioId);
        const nextScenarios = this.actuallyProcessScenario(
          scenario.id,
          scenario.scenario,
          campaignState,
          campaignLog
        );
        forEach(nextScenarios, scenario => {
          scenarios.push(scenario);
          campaignLog = scenario.latestCampaignLog;
        });
      }
    });
    let foundPlayable = false;
    forEach(scenarios, scenario => {
      if (scenario.type === 'playable') {
        if (foundPlayable) {
          scenario.type = 'locked';
        } else {
          foundPlayable = true;
        }
      }
      if (scenario.type === 'started') {
        foundPlayable = true;
      }
    });
    let foundUndoable = false;
    forEach(reverse(slice(scenarios)), scenario => {
      if (scenario.canUndo) {
        if (foundUndoable) {
          scenario.canUndo = false;
        } else {
          foundUndoable = true;
        }
      }
    });
    return {
      scenarios,
      campaignLog,
    };
  }

  nextScenario(
    campaignState: CampaignStateHelper,
    campaignLog: GuidedCampaignLog,
    includeSkipped: boolean
  ): {
    id: ScenarioId;
    scenario: Scenario;
  } | undefined {
    if (!campaignLog.scenarioId) {
      return this.findScenario(CAMPAIGN_SETUP_ID);
    }
    const parsedId = this.parseScenarioId(campaignLog.scenarioId);
    const entry = campaignState.sideScenario(parsedId.encodedScenarioId);
    if (entry) {
      const scenario = (entry.sideScenarioType === 'custom') ?
        this.getCustomScenario(entry) :
        find(
          this.sideCampaign.scenarios,
          scenario => scenario.id === entry.scenario
        );
      if (!scenario) {
        throw new Error(`Could not find side scenario: ${entry.scenario}`);
      }
      return {
        id: this.parseScenarioId(entry.scenario),
        scenario: this.insertCustomPlayScenarioStep(scenario),
      };
    }

    const campaignNextScenarioId = campaignLog.campaignNextScenarioId();
    if (campaignNextScenarioId) {
      return this.findScenario(campaignNextScenarioId);
    }

    const scenarios = filter(
      this.allScenarioIds(),
      scenarioId => includeSkipped || campaignLog.scenarioStatus(scenarioId) !== 'skipped'
    );
    const currentIndex = findIndex(
      scenarios,
      scenarioId => scenarioId === parsedId.scenarioId
    );
    if (currentIndex !== -1 && currentIndex + 1 < scenarios.length) {
      return this.findScenario(scenarios[currentIndex + 1]);
    }
    return undefined;
  }

  private findScenario(encodedScenarioId: string): {
    id: ScenarioId;
    scenario: Scenario;
  } {
    if (encodedScenarioId === CAMPAIGN_SETUP_ID) {
      return {
        id: this.parseScenarioId(CAMPAIGN_SETUP_ID),
        scenario: {
          id: CAMPAIGN_SETUP_ID,
          type: 'interlude',
          scenario_name: t`Campaign Setup`,
          full_name: t`Campaign Setup`,
          setup: this.campaign.campaign.setup,
          steps: this.campaign.campaign.steps,
        },
      };
    }
    const id = this.parseScenarioId(encodedScenarioId);
    const mainScenario = find(this.campaign.scenarios, scenario => scenario.id === id.scenarioId);
    if (mainScenario) {
      return {
        id,
        scenario: mainScenario,
      };
    }
    const sideScenario = find(this.sideCampaign.scenarios, scenario => scenario.id === id.scenarioId);
    if (sideScenario) {
      return {
        id,
        scenario: sideScenario,
      };
    }
    throw new Error(`Could not find scenario: ${encodedScenarioId}`);
  }

  parseScenarioId(encodedScenarioId: string): ScenarioId {
    if (encodedScenarioId.indexOf('#') === -1) {
      return {
        encodedScenarioId,
        scenarioId: encodedScenarioId,
        replayAttempt: undefined,
      };
    }
    const [scenarioId, replayCount] = encodedScenarioId.split('#');
    return {
      encodedScenarioId,
      scenarioId,
      replayAttempt: parseInt(replayCount, 10),
    };
  }

  nextScenarioName(
    campaignState: CampaignStateHelper,
    campaignLog: GuidedCampaignLog
  ): string | undefined {
    const scenario = this.nextScenario(campaignState, campaignLog, false);
    if (!scenario) {
      return undefined;
    }
    return scenario.scenario.full_name;
  }

  private actuallyProcessScenario(
    id: ScenarioId,
    scenario: Scenario,
    campaignState: CampaignStateHelper,
    campaignLog: GuidedCampaignLog
  ): ProcessedScenario[] {
    const scenarioGuide = new ScenarioGuide(
      id.encodedScenarioId,
      scenario,
      this,
      campaignLog
    );
    if (!campaignState.startedScenario(id.encodedScenarioId)) {
      if (
        (campaignLog.campaignData.result && scenarioGuide.scenarioType() !== 'epilogue') ||
        campaignLog.scenarioStatus(id.encodedScenarioId) === 'skipped'
      ) {
        return [{
          type: 'skipped',
          id,
          scenarioGuide,
          latestCampaignLog: campaignLog,
          canUndo: false,
          closeOnUndo: false,
          steps: [],
        }];
      }
      return [{
        type: 'playable',
        id,
        scenarioGuide,
        latestCampaignLog: campaignLog,
        canUndo: false,
        closeOnUndo: false,
        steps: [],
      }];
    }
    const scenarioState = new ScenarioStateHelper(id.encodedScenarioId, campaignState);
    const executedScenario = scenarioGuide.setupSteps(scenarioState);
    const firstResult: ProcessedScenario = {
      type: executedScenario.inProgress ? 'started' : 'completed',
      id,
      scenarioGuide,
      latestCampaignLog: executedScenario.latestCampaignLog,
      canUndo: true,
      closeOnUndo: campaignState.closeOnUndo(id.encodedScenarioId),
      steps: executedScenario.steps,
    };
    if (executedScenario.inProgress) {
      return [firstResult];
    }
    const latestCampaignLog = executedScenario.latestCampaignLog;
    const nextScenario = this.nextScenario(
      campaignState,
      latestCampaignLog,
      true
    );
    if (!nextScenario) {
      return [firstResult];
    }
    return [
      firstResult,
      ...this.actuallyProcessScenario(
        nextScenario.id,
        nextScenario.scenario,
        campaignState,
        latestCampaignLog
      ),
    ];
  }

  private getCustomScenario(entry: GuideStartCustomSideScenarioInput): Scenario {
    return {
      id: entry.scenario,
      scenario_name: entry.name,
      full_name: entry.name,
      setup: [
        'spend_xp_cost',
        '$play_scenario',
        '$end_of_scenario_status',
        '$earn_xp',
        '$upgrade_decks',
        '$proceed',
      ],
      steps: [
        createInvestigatorStatusStep('$end_of_scenario_status'),
        {
          id: '$earn_xp',
          text: t`Each investigator earns experience equal to the Victory X value of each card in the victory display.`,
          type: 'input',
          input: {
            type: 'counter',
            text: t`Victory display:`,
            effects: [
              {
                type: 'earn_xp',
                investigator: 'all',
              },
            ],
          },
        },
        {
          id: '$play_scenario',
          type: 'input',
          input: {
            type: 'play_scenario',
            no_resolutions: true,
          },
        },
        {
          id: 'spend_xp_cost',
          text: ngettext(
            msgid`Each investigator pays ${entry.xpCost} experience point to play this scenario.`,
            `Each investigator pays ${entry.xpCost} experience points to play this scenario.`,
            entry.xpCost
          ),
          effects: [
            {
              type: 'earn_xp',
              investigator: 'all',
              bonus: -entry.xpCost,
            },
          ],
        },
      ],
    };
  }

  private insertCustomPlayScenarioStep(
    scenario: Scenario
  ): Scenario {
    const campaignPlayScenarioStep = find(
      this.campaign.campaign.side_scenario_steps,
      step => step.id === '$play_scenario'
    );
    if (!campaignPlayScenarioStep ||
      campaignPlayScenarioStep.type !== 'input' ||
      campaignPlayScenarioStep.input.type !== 'play_scenario'
    ) {
      return scenario;
    }
    const scenarioPlayScenarioStep = find(
      scenario.steps,
      step => step.id === '$play_scenario'
    );
    if (!scenarioPlayScenarioStep ||
      scenarioPlayScenarioStep.type !== 'input' ||
      scenarioPlayScenarioStep.input.type !== 'play_scenario'
    ) {
      return {
        ...scenario,
        steps: [
          ...scenario.steps,
          ...this.campaign.campaign.side_scenario_steps || [],
        ],
      };
    }

    return {
      ...scenario,
      steps: [
        ...filter(scenario.steps, step => step.id !== '$play_scenario'),
        ...filter(this.campaign.campaign.side_scenario_steps, step => step.id !== '$play_scenario'),
        {
          id: '$play_scenario',
          type: 'input',
          input: {
            type: 'play_scenario',
            branches: [
              ...(campaignPlayScenarioStep.input.branches || []),
              ...(scenarioPlayScenarioStep.input.branches || []),
            ],
            campaign_log: [
              ...(campaignPlayScenarioStep.input.campaign_log || []),
              ...(scenarioPlayScenarioStep.input.campaign_log || []),
            ],
          },
        },
      ],
    };
  }

  private allScenarioIds() {
    return [
      CAMPAIGN_SETUP_ID,
      ...this.campaign.campaign.scenarios,
    ];
  }

  scenarioName(scenarioId: string): string | undefined {
    const scenario = find(this.campaign.scenarios, scenario => scenario.id === scenarioId);
    return scenario && scenario.scenario_name;
  }

  logSection(sectionId: string): LogSection | undefined {
    const section = find(
      this.campaign.campaign.campaign_log,
      logSection => logSection.id === sectionId
    );
    if (!section) {
      return undefined;
    }
    return {
      section: section.title,
    };
  }

  logEntry(sectionId: string, id: string): LogEntry {
    const section = find(
      this.campaign.campaign.campaign_log,
      logSection => logSection.id === sectionId
    );
    if (!section) {
      throw new Error(`Could not find section: ${sectionId}`);
    }
    if (section.type === 'supplies') {
      const supply = find(this.log.supplies, s => s.id === id);
      if (!supply) {
        throw new Error(`Could not find Supply: ${id}`);
      }
      return {
        type: 'supplies',
        section: section.title,
        supply,
      };
    }
    if (id === '$count') {
      return {
        type: 'section_count',
        section: section.title,
      };
    }
    const textSection = find(
      this.log.sections,
      s => s.section === sectionId
    );
    if (textSection) {
      if (id === '$num_entries') {
        return {
          type: 'section_count',
          section: section.title,
        };
      }
      const entry = find(
        textSection.entries,
        entry => entry.id === id
      );
      if (entry) {
        return {
          type: 'text',
          section: section.title,
          text: entry.text,
        };
      }
    }

    if (id.match(CARD_REGEX)) {
      return {
        type: 'card',
        section: section.title,
        code: id,
      };
    }
    // Try input value?
    if (sectionId !== '$input_value') {
      try {
        const entry = this.logEntry('$input_value', id);
        if (entry) {
          return {
            ...entry,
            section: sectionId,
          };
        }
      } catch (e) {
        throw new Error(`Could not find section(${sectionId}), id(${id}), textSection(${JSON.stringify(textSection)}), checked input value too`);
      }
    }
    throw new Error(`Could not find section(${sectionId}), id(${id}), textSection(${JSON.stringify(textSection)})`);
  }
}

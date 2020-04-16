import { find, findIndex, filter, forEach, map, reverse, slice } from 'lodash';
import { t } from 'ttag';

import { ProcessedCampaign, ProcessedScenario } from 'data/scenario';
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
const CAMPAIGN_SETUP_ID = '$campaign_setup';

/**
 * Wrapper utility to provide structured access to campaigns.
 */
export default class CampaignGuide {
  private campaign: FullCampaign;
  private log: CampaignLog;

  constructor(campaign: FullCampaign, log: CampaignLog) {
    this.campaign = campaign;
    this.log = log;
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
    rawScenarioId: string
  ): string | undefined {
    const scenarioId = this.parseScenarioId(rawScenarioId);
    const scenario = find(
      this.campaign.scenarios,
      scenario => scenario.id === scenarioId.scenarioId
    );
    return scenario && scenario.full_name;
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
      campaignState.investigators
    );
    forEach(this.allScenarioIds(), scenarioId => {
      if (!find(scenarios, scenario => scenario.scenarioGuide.id === scenarioId)) {
        const nextScenarios = this.processScenario(
          scenarioId,
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

  nextScenarioId(rawScenarioId: string, skippedScenarios: string[]) {
    const parsedId = this.parseScenarioId(rawScenarioId);
    const skipped = new Set(skippedScenarios);
    const scenarios = filter(
      this.allScenarioIds(),
      scenarioId => !skipped.has(scenarioId)
    );
    const currentIndex = findIndex(
      scenarios,
      scenarioId => scenarioId === parsedId.scenarioId
    );
    if (currentIndex !== -1 && currentIndex + 1 < scenarios.length) {
      return scenarios[currentIndex + 1];
    }
    return undefined;
  }

  parseScenarioId(scenarioId: string) {
    if (scenarioId.indexOf('#') === -1) {
      return {
        scenarioId,
        replayCount: undefined,
      };
    }
    const [actualScenarioId, replayCount] = scenarioId.split('#');
    return {
      scenarioId: actualScenarioId,
      replayCount: parseInt(replayCount, 10),
    };
  }

  private processScenario(
    rawScenarioId: string,
    campaignState: CampaignStateHelper,
    campaignLog: GuidedCampaignLog
  ): ProcessedScenario[] {
    const {
      scenarioId,
      replayCount,
    } = this.parseScenarioId(rawScenarioId);
    const scenario: Scenario | undefined = (scenarioId === CAMPAIGN_SETUP_ID) ?
      {
        id: CAMPAIGN_SETUP_ID,
        type: 'interlude',
        scenario_name: t`Campaign Setup`,
        full_name: t`Campaign Setup`,
        setup: this.campaign.campaign.setup,
        steps: this.campaign.campaign.steps,
      } :
      find(this.campaign.scenarios, scenario => scenario.id === scenarioId);
    if (!scenario) {
      throw new Error(`Unknown scenario: ${scenarioId}`);
    }
    const scenarioGuide = new ScenarioGuide(
      rawScenarioId,
      scenario,
      this,
      campaignLog
    );
    if (!campaignState.startedScenario(rawScenarioId)) {
      if (
        (campaignLog.campaignData.result && scenarioGuide.scenarioType() !== 'epilogue') ||
        campaignLog.scenarioStatus(rawScenarioId) === 'skipped'
      ) {
        return [{
          type: 'skipped',
          scenarioGuide,
          latestCampaignLog: campaignLog,
          attempt: replayCount || 0,
          canUndo: false,
          steps: [],
        }];
      }
      return [{
        type: 'playable',
        scenarioGuide,
        latestCampaignLog: campaignLog,
        attempt: replayCount || 0,
        canUndo: false,
        steps: [],
      }];
    }
    const scenarioState = new ScenarioStateHelper(rawScenarioId, campaignState);
    const executedScenario = scenarioGuide.setupSteps(scenarioState);
    const firstResult: ProcessedScenario = {
      type: executedScenario.inProgress ? 'started' : 'completed',
      scenarioGuide,
      latestCampaignLog: executedScenario.latestCampaignLog,
      attempt: replayCount || 0,
      canUndo: true,
      steps: executedScenario.steps,
    };
    if (executedScenario.inProgress) {
      return [firstResult];
    }
    const newReplayCount = firstResult.latestCampaignLog.campaignData.scenarioReplayCount[scenarioId];
    if (newReplayCount && (!replayCount || replayCount < newReplayCount)) {
      return [
        firstResult,
        ...this.processScenario(
          `${scenarioId}#${newReplayCount}`,
          campaignState,
          executedScenario.latestCampaignLog
        ),
      ];
    }

    const nextScenarioId = executedScenario.latestCampaignLog.nextScenarioId(true);
    if (!nextScenarioId) {
      return [firstResult];
    }
    return [
      firstResult,
      ...this.processScenario(
        nextScenarioId,
        campaignState,
        executedScenario.latestCampaignLog
      ),
    ];
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
      console.log(
        map(this.campaign.campaign.campaign_log, section => section.id)
      );
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
        throw new Error(`Could not find section(${sectionId}), id(${id}), textSection(${JSON.stringify(textSection)})`);
      }
    }
    throw new Error(`Could not find section(${sectionId}), id(${id}), textSection(${JSON.stringify(textSection)})`);
  }
}

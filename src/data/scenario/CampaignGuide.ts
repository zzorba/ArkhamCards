import { find, forEach } from 'lodash';
import { t } from 'ttag';

import GuidedCampaignLog from './GuidedCampaignLog';
import CampaignStateHelper from './CampaignStateHelper';
import ScenarioStateHelper from './ScenarioStateHelper';
import ScenarioGuide from './ScenarioGuide';
import { FullCampaign, Supply, Scenario } from './types';

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

interface PlayedScenario {
  type: 'started' | 'completed';
  scenarioGuide: ScenarioGuide;
  latestCampaignLog: GuidedCampaignLog;
}

interface UnplayedScenario {
  type: 'locked' | 'playable' | 'skipped';
  scenarioGuide: ScenarioGuide;
  latestCampaignLog: GuidedCampaignLog;
}

export type ProcessedScenario = PlayedScenario | UnplayedScenario;

interface ProcessedCampaign {
  scenarios: ProcessedScenario[];
  campaignLog: GuidedCampaignLog;
}

type LogEntry = LogEntrySectionCount | LogEntryCard | LogEntryText | LogEntrySupplies;
const CARD_REGEX = /\d\d\d\d\d[a-z]?/;
const CAMPAIGN_SETUP_ID = '$campaign_setup';

/**
 * Wrapper utility to provide structured access to campaigns.
 */
export default class CampaignGuide {
  campaign: FullCampaign;
  log: CampaignLog;

  constructor(campaign: FullCampaign, log: CampaignLog) {
    this.campaign = campaign;
    this.log = log;
  }

  getScenario(
    id: string,
    campaignState: CampaignStateHelper
  ): ScenarioGuide | undefined {
    const processedScenario = find(
      this.processAllScenarios(campaignState).scenarios,
      scenario => scenario.scenarioGuide.scenario.id === id);
    return processedScenario && processedScenario.scenarioGuide;
  }

  processAllScenarios(
    campaignState: CampaignStateHelper,
  ): ProcessedCampaign {
    const scenarios: ProcessedScenario[] = [];
    let campaignLog: GuidedCampaignLog = new GuidedCampaignLog([], this);
    forEach(this.allScenarioIds(), scenarioId => {
      if (!find(scenarios, scenario => scenario.scenarioGuide.scenario.id === scenarioId)) {
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
    return {
      scenarios,
      campaignLog,
    };
  }

  private processScenario(
    scenarioId: string,
    campaignState: CampaignStateHelper,
    campaignLog: GuidedCampaignLog
  ): ProcessedScenario[] {
    const scenario = (scenarioId === CAMPAIGN_SETUP_ID) ?
      {
        id: CAMPAIGN_SETUP_ID,
        interlude: true,
        scenarioName: t`Campaign Setup`,
        setup: this.campaign.campaign.setup,
        steps: this.campaign.campaign.steps,
      } :
      find(this.campaign.scenarios, scenario => scenario.id === scenarioId);
    if (!scenario) {
      throw new Error(`Unknown scenario: ${scenarioId}`);
    }
    const scenarioGuide = new ScenarioGuide(scenario, this, campaignLog);
    if (!campaignState.startedScenario(scenarioId)) {
      if (campaignLog.scenarioStatus(scenarioId) === 'skipped') {
        return [{
          type: 'skipped',
          scenarioGuide,
          latestCampaignLog: campaignLog,
        }];
      }
      return [{
        type: 'playable',
        scenarioGuide,
        latestCampaignLog: campaignLog,
      }];
    }
    const scenarioState = new ScenarioStateHelper(scenarioId, campaignState);
    const executedScenario = scenarioGuide.setupSteps(scenarioState);
    const firstResult: ProcessedScenario = {
      type: executedScenario.inProgress ? 'started' : 'completed',
      scenarioGuide,
      latestCampaignLog: executedScenario.latestCampaignLog,
    };

    const nextScenario = executedScenario.latestCampaignLog.nextScenario();
    if (!nextScenario || executedScenario.inProgress) {
      return [firstResult];
    }
    return [
      firstResult,
      ...this.processScenario(
        nextScenario,
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
      const entry = find(textSection.entries, entry => entry.id === id);
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
    throw new Error(`Could not find section(${sectionId}), id(${id})`);
  }
}

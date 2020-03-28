import { find, forEach } from 'lodash';

import GuidedCampaignLog from './GuidedCampaignLog';
import CampaignStateHelper from './CampaignStateHelper';
import ScenarioStateHelper from './ScenarioStateHelper';
import ScenarioGuide from './ScenarioGuide';
import { FullCampaign } from './types';

export interface CampaignLog {
  campaignId: string;
  sections: {
    section: string;
    entries: {
      id: string;
      text: string;
    }[];
  }[];
}

interface LogSection {
  section: string;
}

interface LogEntryCard extends LogSection {
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

interface LogEntryPerInvestigator extends LogSection {
  type: 'investigator';
  text?: string;
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

type LogEntry = LogEntrySectionCount | LogEntryCard | LogEntryText | LogEntryPerInvestigator;
const CARD_REGEX = /\d\d\d\d\d[a-z]?/;
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
    const scenario = find(this.campaign.scenarios, scenario => scenario.id === scenarioId);
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
    return this.campaign.campaign.scenarios;
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

  logEntry(sectionId: string, id: string): LogEntry | undefined {
    const section = find(
      this.campaign.campaign.campaign_log,
      logSection => logSection.id === sectionId
    );
    if (!section) {
      return undefined;
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
          type: section.type === 'investigator' ? 'investigator' : 'text',
          section: section.title,
          text: entry.text,
        };
      }
    }
    if (section.type === 'investigator') {
      return {
        type: 'investigator',
        section: section.title,
      };
    }
    if (id.match(CARD_REGEX)) {
      return {
        type: 'card',
        section: section.title,
        code: id,
      };
    }
    return undefined;
  }
}

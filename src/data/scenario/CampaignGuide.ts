import { find, map } from 'lodash';

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

type LogEntry = LogEntrySectionCount | LogEntryCard | LogEntryText | LogEntryPerInvestigator;
const CARD_REGEX = /\d\d\d\d\d[a-z]?/;
/**
 * Wrapper utility to provide structured access to campaigns.
 */
export default class CampaignGuide {
  campaign: FullCampaign;
  scenarios: ScenarioGuide[];
  log: CampaignLog;

  constructor(campaign: FullCampaign, log: CampaignLog) {
    this.campaign = campaign;
    this.scenarios = map(
      campaign.scenarios,
      scenario => new ScenarioGuide(scenario, this)
    );
    this.log = log;
  }

  getScenario(id: string): ScenarioGuide | undefined {
    return find(this.scenarios, scenario => scenario.scenario.id === id);
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

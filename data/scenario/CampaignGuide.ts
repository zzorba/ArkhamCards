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

interface LogEntryCard {
  type: 'card';
  section: string;
  code: string;
}

interface LogEntryText {
  type: 'text';
  section: string;
  text: string;
}

type LogEntry = LogEntryCard | LogEntryText;
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
    this.scenarios = map(campaign.scenarios, scenario => new ScenarioGuide(scenario));
    this.log = log;
  }

  getScenario(id: string): ScenarioGuide | undefined {
    return find(this.scenarios, scenario => scenario.scenario.id === id);
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
    return undefined;
  }
}

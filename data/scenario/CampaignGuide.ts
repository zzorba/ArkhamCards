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

  logEntryText(sectionId: string, id: string): string | undefined {
    const section = find(
      this.log.sections,
      s => s.section === sectionId
    );
    if (!section) {
      return undefined;
    }
    const entry = find(section.entries, entry => entry.id === id);
    return entry && entry.text;
  }
}

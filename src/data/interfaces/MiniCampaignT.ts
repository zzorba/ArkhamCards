import { CampaignCycleCode, ScenarioResult, StandaloneId, Trauma, CampaignDifficulty, TraumaAndCardData, InvestigatorData, CampaignId } from '@actions/types';
import { MiniCampaignFragment } from '@generated/graphql/apollo-schema';
import { uniq, concat, flatMap, last, forEach } from 'lodash';

export abstract class MiniCampaignT {
  abstract id(): CampaignId;
  abstract uuid(): string;
  abstract guided(): boolean;
  abstract name(): string;
  abstract cycleCode(): CampaignCycleCode;
  abstract difficulty(): CampaignDifficulty | undefined;
  abstract standaloneId(): StandaloneId | undefined;
  abstract latestScenarioResult(): ScenarioResult | undefined;
  abstract investigators(): string[];
  abstract investigatorTrauma(code: string): Trauma & { storyAssets?: string[] };
  abstract updatedAt(): Date;
  abstract linked(): undefined | {
    campaignIdA: CampaignId;
    campaignIdB: CampaignId;
  };
}
const EMPTY_TRAUMA = {};

export class MiniCampaignRemote {
  private campaign: MiniCampaignFragment;
  private investigatorData: InvestigatorData;
  constructor(
    campaign: MiniCampaignFragment
  ) {
    this.campaign = campaign;
    this.investigatorData = {};
    forEach(this.campaign.investigator_data, r => {
      this.investigatorData[r.investigator] = {
        storyAssets: r.storyAssets,
        physical: r.physical || undefined,
        mental: r.mental || undefined,
        killed: r.killed || undefined,
        insane: r.insane || undefined,
      };
    });
  }

  id(): CampaignId {
    return {
      campaignId: this.campaign.uuid,
      serverId: this.campaign.id,
    };
  }

  name(): string {
    return this.campaign.name || '';
  }

  guided(): boolean {
    return !!this.campaign.guided;
  }

  difficulty(): CampaignDifficulty | undefined {
    return (this.campaign.difficulty || undefined) as (CampaignDifficulty | undefined);
  }

  latestScenarioResult(): ScenarioResult | undefined {
    return last(this.campaign.scenarioResults || []) || undefined;
  }

  cycleCode(): CampaignCycleCode {
    return (this.campaign.cycleCode || undefined) as CampaignCycleCode;
  }

  standaloneId(): StandaloneId | undefined {
    return this.campaign.standaloneId;
  }

  investigators(): string[] {
    return uniq(
      concat(
        flatMap(this.campaign.latest_decks, d => d.deck?.investigator || []),
        this.campaign.nonDeckInvestigators || [],
      )
    );
  }

  investigatorTrauma(code: string): TraumaAndCardData {
    return this.investigatorData[code] || EMPTY_TRAUMA;
  }

  updatedAt(): Date {
    return new Date(Date.parse(this.campaign.updated_at));
  }
}
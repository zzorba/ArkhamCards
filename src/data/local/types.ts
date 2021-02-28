import { CampaignCycleCode, Deck, ScenarioResult, StandaloneId, Trauma, Campaign, CampaignDifficulty, TraumaAndCardData, getCampaignId, CampaignId } from '@actions/types';
import { MiniCampaignT } from '@data/interfaces/MiniCampaignT';
import { uniq, map, concat, last, maxBy } from 'lodash';

const EMPTY_TRAUMA: Trauma = {};

export class MiniCampaignRedux extends MiniCampaignT {
  protected campaign: Campaign;
  protected campaignDecks: Deck[];
  protected campaignUpdatedAt: Date;

  constructor(
    campaign: Campaign,
    campaignDecks: Deck[],
    updatedAt: Date
  ) {
    super();
    this.campaign = campaign;
    this.campaignDecks = campaignDecks;
    this.campaignUpdatedAt = updatedAt;
  }

  id(): CampaignId {
    return getCampaignId(this.campaign);
  }

  uuid(): string {
    return this.campaign.uuid;
  }

  guided(): boolean {
    return !!this.campaign.guided;
  }

  name(): string {
    return this.campaign.name;
  }

  difficulty(): CampaignDifficulty | undefined {
    return this.campaign.difficulty;
  }

  latestScenarioResult(): ScenarioResult | undefined {
    return last(this.campaign.scenarioResults || []) || undefined;
  }

  cycleCode(): CampaignCycleCode {
    return this.campaign.cycleCode;
  }

  standaloneId(): StandaloneId | undefined {
    return this.campaign.standaloneId;
  }

  investigators(): string[] {
    return uniq(
      concat(
        map(this.campaignDecks, d => d.investigator_code),
        this.campaign.nonDeckInvestigators || [],
      )
    );
  }

  investigatorTrauma(code: string): TraumaAndCardData {
    return this.campaign.investigatorData?.[code] || EMPTY_TRAUMA;
  }

  updatedAt(): Date {
    return this.campaignUpdatedAt;
  }

  linked(): undefined | { campaignIdA: CampaignId; campaignIdB: CampaignId } {
    return undefined;
  }
}


export class MiniLinkedCampaignRedux extends MiniCampaignRedux {
  private campaignA: Campaign;
  private decksA: Deck[];
  private updatedAtA: Date;

  private campaignB: Campaign;
  private decksB: Deck[];
  private updatedAtB: Date;

  constructor(
    campaign: Campaign,
    updatedAt: Date,
    campaignA: Campaign,
    decksA: Deck[],
    updatedAtA: Date,
    campaignB: Campaign,
    decksB: Deck[],
    updatedAtB: Date
  ) {
    super(campaign, [], updatedAt);
    this.campaignA = campaignA;
    this.campaignB = campaignB;
    this.decksA = decksA;
    this.decksB = decksB;
    this.updatedAtA = updatedAtA;
    this.updatedAtB = updatedAtB;
  }

  difficulty(): CampaignDifficulty | undefined {
    // tslint:disable-next-line: strict-comparisons
    if (this.campaignA.difficulty === this.campaignB.difficulty) {
      return this.campaignA.difficulty;
    }
    return undefined;
  }

  latestScenarioResult(): ScenarioResult | undefined {
    if (this.updatedAtA.getTime() > this.updatedAtB.getTime()) {
      return last(this.campaignA.scenarioResults || []) || undefined;
    }
    return last(this.campaignB.scenarioResults || []) || undefined;
  }

  investigators(): string[] {
    return uniq(
      concat(
        map(this.decksA, d => d.investigator_code),
        this.campaignA.nonDeckInvestigators || [],
        map(this.decksB, d => d.investigator_code),
        this.campaignB.nonDeckInvestigators || [],
      )
    );
  }

  investigatorTrauma(code: string): TraumaAndCardData {
    return this.campaignA.investigatorData?.[code] || this.campaignB.investigatorData?.[code] || EMPTY_TRAUMA;
  }

  updatedAt(): Date {
    return maxBy(
      [super.updatedAt(), this.updatedAtA, this.updatedAtB],
      d => d.getTime()
    ) as Date;
  }

  linked() {
    return {
      campaignIdA: getCampaignId(this.campaignA),
      campaignIdB: getCampaignId(this.campaignB),
    };
  }
}

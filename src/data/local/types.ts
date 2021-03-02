import { CampaignCycleCode, Deck, ScenarioResult, StandaloneId, Trauma, Campaign, CampaignDifficulty, TraumaAndCardData, getCampaignId, CampaignId, WeaknessSet } from '@actions/types';
import { uniq, map, concat, last, maxBy } from 'lodash';

import MiniCampaignT, { CampaignLink } from '@data/interfaces/MiniCampaignT';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';

const EMPTY_TRAUMA: Trauma = {};

export class MiniCampaignRedux implements MiniCampaignT {
  protected campaign: Campaign;
  protected campaignDecks: Deck[];
  protected campaignUpdatedAt: Date;

  constructor(
    campaign: Campaign,
    campaignDecks: Deck[],
    updatedAt: Date
  ) {
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

  linked(): undefined | CampaignLink {
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


const EMPTY_CHAOS_BAG = {};
const EMPTY_WEAKNESS_SET: WeaknessSet = {
  packCodes: [],
  assignedCards: {},
};
const EMPTY_CAMPAIGN_NOTES = {};
const EMPTY_SCENARIO_RESULTS: ScenarioResult[] = [];

export class SingleCampaignRedux extends MiniCampaignRedux implements SingleCampaignT {
  constructor(
    campaign: Campaign,
    latestCampaignDecks: Deck[],
    updatedAt: Date
  ) {
    super(campaign, latestCampaignDecks, updatedAt);
  }

  showInterludes() {
    return !!this.campaign.showInterludes;
  }
  latestDecks(): Deck[] {
    return this.campaignDecks;
  }
  guideVersion() {
    return this.campaign.guided ? this.campaign.guideVersion : undefined;
  }

  investigatorSpentXp(code: string) {
    return this.campaign.adjustedInvestigatorData?.[code]?.spentXp || 0;
  }

  chaosBag() {
    return this.campaign.chaosBag || EMPTY_CHAOS_BAG;
  }
  weaknessSet() {
    return this.campaign.weaknessSet || EMPTY_WEAKNESS_SET;
  }
  campaignNotes() {
    return this.campaign.campaignNotes || EMPTY_CAMPAIGN_NOTES;
  }
  scenarioResults() {
    return this.campaign.scenarioResults || EMPTY_SCENARIO_RESULTS;
  }

  linkedCampaignId() {
    return this.campaign.linkedCampaignUuid ? {
      campaignId: this.campaign.linkedCampaignUuid,
      serverId: this.campaign.serverId,
    } : undefined;
  }
}
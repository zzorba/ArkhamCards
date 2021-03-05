import { CampaignCycleCode, ScenarioResult, StandaloneId, CampaignDifficulty, TraumaAndCardData, InvestigatorData, CampaignId, Deck, WeaknessSet } from '@actions/types';
import { uniq, concat, flatMap, keys, maxBy, last, forEach } from 'lodash';

import MiniCampaignT, { CampaignLink } from '@data/interfaces/MiniCampaignT';
import { FullCampaignFragment, MiniCampaignFragment } from '@generated/graphql/apollo-schema';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';

const EMPTY_TRAUMA = {};

function fragmentToInvestigatorData(campaign: MiniCampaignFragment): InvestigatorData {
  const investigatorData: InvestigatorData = {};
  forEach(campaign.investigator_data, r => {
    investigatorData[r.investigator] = {
      storyAssets: r.storyAssets || undefined,
      physical: r.physical || undefined,
      mental: r.mental || undefined,
      killed: r.killed || undefined,
      insane: r.insane || undefined,
    };
  });
  return investigatorData;
}

function fragmentToFullInvestigatorData(campaign: FullCampaignFragment): InvestigatorData {
  const investigatorData: InvestigatorData = {};
  forEach(campaign.investigator_data, r => {
    investigatorData[r.investigator] = {
      storyAssets: r.storyAssets,
      physical: r.physical || undefined,
      mental: r.mental || undefined,
      killed: r.killed || undefined,
      insane: r.insane || undefined,
      specialXp: r.specialXp || undefined,
      availableXp: r.availableXp || undefined,
      spentXp: r.spentXp || undefined,
      ignoreStoryAssets: r.ignoreStoryAssets || undefined,
      addedCards: r.addedCards || undefined,
      removedCards: r.removedCards || undefined,
    };
  });
  return investigatorData;
}

function fragmentToInvestigators(campaign: MiniCampaignFragment): string[] {
  return uniq(
    concat(
      flatMap(campaign.latest_decks, d => d.deck?.investigator || []),
      flatMap(campaign.investigators, i => i.investigator),
    )
  );
}

export class MiniCampaignRemote implements MiniCampaignT {
  protected campaign: MiniCampaignFragment;
  protected campaignInvestigatorData: InvestigatorData;
  protected campaignUpdatedAt: Date;
  constructor(
    campaign: MiniCampaignFragment
  ) {
    this.campaign = campaign;
    this.campaignInvestigatorData = fragmentToInvestigatorData(campaign);
    this.campaignUpdatedAt = new Date(Date.parse(campaign.updated_at));
  }

  id(): CampaignId {
    return {
      campaignId: this.campaign.uuid,
      serverId: this.campaign.id,
    };
  }

  uuid(): string {
    return this.campaign.uuid;
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
    return fragmentToInvestigators(this.campaign);
  }

  investigatorTrauma(code: string): TraumaAndCardData {
    return this.campaignInvestigatorData[code] || EMPTY_TRAUMA;
  }

  updatedAt(): Date {
    return this.campaignUpdatedAt;
  }

  linked(): undefined | CampaignLink {
    return undefined;
  }
}

export class MiniLinkedCampaignRemote extends MiniCampaignRemote {
  private campaignA: MiniCampaignFragment;
  private campaignB: MiniCampaignFragment;

  private investigatorDataA: InvestigatorData;
  private investigatorDataB: InvestigatorData;

  private updatedAtA: Date;
  private updatedAtB: Date;

  constructor(
    campaign: MiniCampaignFragment,
    campaignA: MiniCampaignFragment,
    campaignB: MiniCampaignFragment
  ) {
    super(campaign);

    this.campaignA = campaignA;
    this.campaignB = campaignB;
    this.investigatorDataA = fragmentToInvestigatorData(campaignA);
    this.investigatorDataB = fragmentToInvestigatorData(campaignB);
    this.updatedAtA = new Date(Date.parse(campaignA.updated_at));
    this.updatedAtB = new Date(Date.parse(campaignB.updated_at));
  }

  difficulty(): CampaignDifficulty | undefined {
    // tslint:disable-next-line: strict-comparisons
    if (this.campaignA.difficulty === this.campaignB.difficulty) {
      return (this.campaignA.difficulty || undefined) as CampaignDifficulty | undefined;
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
        super.investigators(),
        fragmentToInvestigators(this.campaignA),
        fragmentToInvestigators(this.campaignB)
      )
    );
  }

  investigatorTrauma(code: string): TraumaAndCardData {
    return this.investigatorDataA[code] || this.investigatorDataB[code] || EMPTY_TRAUMA;
  }

  updatedAt(): Date {
    return maxBy(
      [super.updatedAt(), this.updatedAtA, this.updatedAtB],
      d => d.getTime()
    ) as Date;
  }

  linked() {
    return {
      campaignIdA: {
        campaignId: this.campaignA.uuid,
        serverId: this.campaignA.id,
      },
      campaignIdB: {
        campaignId: this.campaignB.uuid,
        serverId: this.campaignB.id,
      },
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

export class SingleCampaignRemote extends MiniCampaignRemote implements SingleCampaignT {
  fullCampaign: FullCampaignFragment;
  fullInvestigatorData: InvestigatorData;
  linkCampaignId?: CampaignId;
  constructor(campaign: FullCampaignFragment) {
    super(campaign);

    this.fullCampaign = campaign;
    this.fullInvestigatorData = fragmentToFullInvestigatorData(campaign);
  }

  showInterludes() {
    return !!this.fullCampaign.showInterludes;
  }
  latestDecks(): Deck[] {
    // TODO: do something with their IDs here.
    return flatMap(this.fullCampaign.latest_decks, d => d.deck?.content);
  }
  guideVersion() {
    return (this.fullCampaign.guided && this.fullCampaign.guide_version) || 0;
  }

  investigatorSpentXp(code: string) {
    return this.fullInvestigatorData[code]?.spentXp || 0;
  }

  investigatorData() {
    return this.fullInvestigatorData;
  }

  getInvestigatorData(investigator: string) {
    return this.fullInvestigatorData[investigator] || EMPTY_TRAUMA;
  }

  chaosBag() {
    return this.fullCampaign.chaosBag || EMPTY_CHAOS_BAG;
  }
  weaknessSet() {
    return this.fullCampaign.weaknessSet || EMPTY_WEAKNESS_SET;
  }
  campaignNotes() {
    return this.fullCampaign.campaignNotes || EMPTY_CAMPAIGN_NOTES;
  }
  scenarioResults() {
    return this.fullCampaign.scenarioResults || EMPTY_SCENARIO_RESULTS;
  }

  linkedCampaignId() {
    return this.fullCampaign.linked_campaign ? {
      campaignId: this.fullCampaign.link_b_campaign.uuid,
      serverId: this.fullCampaign.link_b_campaign.id,
    } : undefined;
  }
}
import { CampaignCycleCode, Deck, ScenarioResult, StandaloneId, Trauma, Campaign, CampaignDifficulty, TraumaAndCardData, getCampaignId, CampaignId, WeaknessSet, InvestigatorData, CampaignGuideState, GuideInput, CampaignNotes, getDeckId, DeckId, SealedToken, ChaosBagResults } from '@actions/types';
import { find, findLast, uniq, map, concat, last, maxBy, sumBy } from 'lodash';

import MiniCampaignT, { CampaignLink } from '@data/interfaces/MiniCampaignT';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import CampaignGuideStateT from '@data/interfaces/CampaignGuideStateT';
import { ChaosBag, ChaosTokenType } from '@app_constants';
import LatestDeckT, { DeckCampaignInfo } from '@data/interfaces/LatestDeckT';
import ChaosBagResultsT from '@data/interfaces/ChaosBagResultsT';
import MiniDeckT from '@data/interfaces/MiniDeckT';

const EMPTY_TRAUMA: Trauma = {};

export class MiniCampaignRedux implements MiniCampaignT {
  protected campaign: Campaign;
  protected campaignDecks: LatestDeckT[];

  public id: CampaignId;
  public uuid: string;
  public guided: boolean;
  public name: string;
  public owner_id = undefined;
  public cycleCode: CampaignCycleCode;
  public difficulty: CampaignDifficulty | undefined;
  public standaloneId: StandaloneId | undefined;
  public latestScenarioResult: ScenarioResult | undefined;
  public investigators: string[];
  public updatedAt: Date;
  public linked: undefined | CampaignLink = undefined;
  public archived: boolean;

  constructor(
    campaign: Campaign,
    campaignDecks: LatestDeckT[],
    updatedAt: Date
  ) {
    this.campaign = campaign;
    this.campaignDecks = campaignDecks;

    this.updatedAt = updatedAt;
    this.investigators = uniq(
      concat(
        map(this.campaignDecks, d => d.investigator),
        this.campaign.nonDeckInvestigators || [],
      )
    );

    this.id = getCampaignId(campaign);
    this.uuid = campaign.uuid;
    this.guided = !!campaign.guided;
    this.archived = !!campaign.archived;
    this.name = campaign.name;
    this.difficulty = campaign.difficulty;
    this.latestScenarioResult = last(campaign.scenarioResults || []) || undefined;
    this.cycleCode = campaign.cycleCode;
    this.standaloneId = this.campaign.standaloneId;
  }

  investigatorTrauma(code: string): TraumaAndCardData {
    return this.campaign.investigatorData?.[code] || EMPTY_TRAUMA;
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

    this.investigators = uniq(
      concat(
        map(this.decksA, d => d.investigator_code),
        this.campaignA.nonDeckInvestigators || [],
        map(this.decksB, d => d.investigator_code),
        this.campaignB.nonDeckInvestigators || [],
      )
    );
    // tslint:disable-next-line: strict-comparisons
    this.difficulty = (campaignA.difficulty === campaignB.difficulty) ? campaignA.difficulty : undefined;
    this.latestScenarioResult = (updatedAtA.getTime() > updatedAtB.getTime()) ?
      (last(campaignA.scenarioResults || []) || undefined) :
      (last(campaignB.scenarioResults || []) || undefined);
    this.updatedAt = maxBy(
      [this.updatedAt, this.updatedAtA, this.updatedAtB],
      d => d.getTime()
    ) as Date;
    this.linked = {
      campaignIdA: getCampaignId(this.campaignA),
      campaignIdB: getCampaignId(this.campaignB),
    };
  }

  investigatorTrauma(code: string): TraumaAndCardData {
    return this.campaignA.investigatorData?.[code] || this.campaignB.investigatorData?.[code] || EMPTY_TRAUMA;
  }
}


const EMPTY_CHAOS_BAG = {};
const EMPTY_WEAKNESS_SET: WeaknessSet = {
  packCodes: [],
  assignedCards: {},
};
const EMPTY_CAMPAIGN_NOTES = {};
const EMPTY_SCENARIO_RESULTS: ScenarioResult[] = [];
const EMPTY_INVESTIGATOR_DATA: InvestigatorData = {};

export class SingleCampaignRedux extends MiniCampaignRedux implements SingleCampaignT {
  showInterludes: boolean;
  investigatorData: InvestigatorData;
  chaosBag: ChaosBag;
  weaknessSet: WeaknessSet;
  campaignNotes: CampaignNotes;
  scenarioResults: ScenarioResult[];
  linkedCampaignId: CampaignId | undefined;
  guideVersion: number;

  constructor(
    campaign: Campaign,
    latestCampaignDecks: LatestDeckT[],
    updatedAt: Date
  ) {
    super(campaign, latestCampaignDecks, updatedAt);

    this.showInterludes = !!campaign.showInterludes;
    this.investigatorData = campaign.investigatorData || EMPTY_INVESTIGATOR_DATA;
    this.chaosBag = campaign.chaosBag || EMPTY_CHAOS_BAG;
    this.weaknessSet = campaign.weaknessSet || EMPTY_WEAKNESS_SET;
    this.campaignNotes = campaign.campaignNotes || EMPTY_CAMPAIGN_NOTES;
    this.scenarioResults = campaign.scenarioResults || EMPTY_SCENARIO_RESULTS;
    this.linkedCampaignId = campaign.linkedCampaignUuid ? {
      campaignId: campaign.linkedCampaignUuid,
      serverId: campaign.serverId,
    } : undefined;
    this.guideVersion = campaign.guideVersion !== undefined ? campaign.guideVersion : -1;
  }
  latestDecks(): LatestDeckT[] {
    return this.campaignDecks;
  }

  investigatorSpentXp(code: string) {
    return (
      this.campaign.guided ?
        this.campaign.adjustedInvestigatorData?.[code]?.spentXp :
        this.campaign.investigatorData?.[code]?.spentXp
    ) || 0;
  }

  getInvestigatorData(investigator: string) {
    return (this.campaign.investigatorData || {})[investigator] || EMPTY_TRAUMA;
  }
}

export class CampaignGuideStateRedux implements CampaignGuideStateT {
  private guide: CampaignGuideState;
  private updatedAt: Date;

  constructor(
    guide: CampaignGuideState,
    updatedAt: Date
  ) {
    this.guide = guide;
    this.updatedAt = updatedAt;
  }

  undoInputs() {
    return [];
  }

  numInputs() {
    return this.guide.inputs.length;
  }

  countInput(pred: (i: GuideInput) => boolean): number {
    return sumBy(this.guide.inputs, i => pred(i) ? 1 : 0);
  }

  findInput(pred: (i: GuideInput) => boolean): GuideInput | undefined {
    return find(this.guide.inputs, pred);
  }
  findLastInput(pred: (i: GuideInput) => boolean): GuideInput | undefined {
    return findLast(this.guide.inputs, pred);
  }

  binaryAchievement(id: string): boolean {
    return !!find(this.guide.achievements || [], a => a.id === id && a.type === 'binary' && a.value);
  }
  countAchievement(id: string): number {
    const entry = find(this.guide.achievements || [], a => a.id === id && a.type === 'count');
    if (entry?.type === 'count') {
      return entry.value;
    }
    return 0;
  }
  lastUpdated(): Date {
    return this.updatedAt;
  }
}

export class MiniDeckRedux implements MiniDeckT {
  id: DeckId;
  name: string;
  investigator: string;
  date_update: string;
  campaign_id?: CampaignId;

  constructor(deck: Deck, campaign: Campaign | undefined) {
    this.id = getDeckId(deck);
    this.name = deck.name;
    this.investigator = deck.investigator_code;
    this.date_update = deck.date_update;
    this.campaign_id = campaign ? getCampaignId(campaign) : undefined;
  }
}

export class LatestDeckRedux extends MiniDeckRedux implements LatestDeckT {
  deck: Deck;
  previousDeck: Deck | undefined;
  campaign: DeckCampaignInfo | undefined;
  owner = undefined;

  constructor(deck: Deck, previousDeck: Deck | undefined, campaign: Campaign | undefined) {
    super(deck, campaign);
    this.deck = deck;
    this.previousDeck = previousDeck;
    this.campaign = campaign ? {
      id: getCampaignId(campaign),
      name: campaign.name,
      trauma: campaign.investigatorData?.[deck.investigator_code] || {},
    } : undefined;
  }
}

export class ChaosBagResultsRedux implements ChaosBagResultsT {
  drawnTokens: ChaosTokenType[];
  sealedTokens: SealedToken[];
  blessTokens: number;
  curseTokens: number;
  totalDrawnTokens: number;

  constructor(chaosBagResults: ChaosBagResults) {
    this.drawnTokens = chaosBagResults.drawnTokens;
    this.sealedTokens = chaosBagResults.sealedTokens;
    this.blessTokens = chaosBagResults.blessTokens || 0;
    this.curseTokens = chaosBagResults.curseTokens || 0;
    this.totalDrawnTokens = chaosBagResults.totalDrawnTokens;
  }
}
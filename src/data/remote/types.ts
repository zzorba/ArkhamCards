import { CampaignCycleCode, ScenarioResult, StandaloneId, CampaignDifficulty, TraumaAndCardData, InvestigatorData, CampaignId, Deck, WeaknessSet, GuideInput, CampaignNotes, DeckId, SYSTEM_BASED_GUIDE_INPUT_TYPES, SYSTEM_BASED_GUIDE_INPUT_IDS, SealedToken } from '@actions/types';
import { uniq, concat, flatMap, sumBy, find, findLast, maxBy, map, last, forEach, findLastIndex } from 'lodash';

import MiniCampaignT, { CampaignLink } from '@data/interfaces/MiniCampaignT';
import { FullCampaignFragment, LatestDeckFragment, MiniCampaignFragment, Guide_Input, FullCampaignGuideStateFragment, FullChaosBagResultFragment, Chaos_Bag_Tarot_Mode_Enum } from '@generated/graphql/apollo-schema';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import CampaignGuideStateT from '@data/interfaces/CampaignGuideStateT';
import { ChaosBag, ChaosTokenType } from '@app_constants';
import LatestDeckT, { DeckCampaignInfo } from '@data/interfaces/LatestDeckT';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import { SimpleUser } from './hooks';
import ChaosBagResultsT from '@data/interfaces/ChaosBagResultsT';

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
      flatMap(campaign.investigators, i => i.investigator),
      flatMap(campaign.latest_decks, d => d.deck?.investigator || []),
    )
  );
}

export class MiniCampaignRemote implements MiniCampaignT {
  protected campaign: MiniCampaignFragment;
  protected campaignInvestigatorData: InvestigatorData;

  public id: CampaignId;
  public uuid: string;
  public guided: boolean;
  public archived: boolean;
  public name: string;
  public cycleCode: CampaignCycleCode;
  public difficulty: CampaignDifficulty | undefined;
  public standaloneId: StandaloneId | undefined;
  public latestScenarioResult: ScenarioResult | undefined;
  public investigators: string[];
  public updatedAt: Date;
  public owner_id: string;
  public linked: undefined | CampaignLink = undefined;

  constructor(
    campaign: MiniCampaignFragment
  ) {
    this.campaign = campaign;
    this.campaignInvestigatorData = fragmentToInvestigatorData(campaign);
    this.updatedAt = new Date(Date.parse(campaign.updated_at));
    this.owner_id = campaign.owner_id;
    this.investigators = fragmentToInvestigators(campaign);
    this.id = {
      campaignId: campaign.uuid,
      serverId: campaign.id,
    };
    this.archived = !!campaign.archived;
    this.uuid = campaign.uuid;
    this.name = campaign.name || '';
    this.guided = !!campaign.guided;
    this.difficulty = (campaign.difficulty || undefined) as (CampaignDifficulty | undefined);
    this.latestScenarioResult = last(this.campaign.scenarioResults || []) || undefined;
    this.cycleCode = (this.campaign.cycleCode || undefined) as CampaignCycleCode;
    this.standaloneId = this.campaign.standaloneId;
    this.linked = undefined;
  }

  investigatorTrauma(code: string): TraumaAndCardData {
    return this.campaignInvestigatorData[code] || EMPTY_TRAUMA;
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
    this.investigators = uniq(
      concat(
        this.investigators,
        fragmentToInvestigators(this.campaignA),
        fragmentToInvestigators(this.campaignB)
      )
    );
    // tslint:disable-next-line: strict-comparisons
    this.difficulty = (this.campaignA.difficulty === this.campaignB.difficulty) ? (
      (this.campaignA.difficulty || undefined) as CampaignDifficulty | undefined
    ) : undefined;
    this.latestScenarioResult = (this.updatedAtA.getTime() > this.updatedAtB.getTime()) ? (
      last(this.campaignA.scenarioResults || []) || undefined) : (
      last(this.campaignB.scenarioResults || []) || undefined
    );
    this.updatedAt = maxBy(
      [this.updatedAt, this.updatedAtA, this.updatedAtB],
      d => d.getTime()
    ) as Date;
    this.linked = {
      campaignIdA: {
        campaignId: campaignA.uuid,
        serverId: campaignA.id,
      },
      campaignIdB: {
        campaignId: campaignB.uuid,
        serverId: campaignB.id,
      },
    };
  }

  investigatorTrauma(code: string): TraumaAndCardData {
    return this.investigatorDataA[code] || this.investigatorDataB[code] || EMPTY_TRAUMA;
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
  linkCampaignId?: CampaignId;
  fullLatestDecks: LatestDeckT[];

  showInterludes: boolean;
  investigatorData: InvestigatorData;
  chaosBag: ChaosBag;
  weaknessSet: WeaknessSet;
  campaignNotes: CampaignNotes;
  scenarioResults: ScenarioResult[];
  linkedCampaignId: CampaignId | undefined;
  guideVersion: number;
  deleted: boolean;

  constructor(campaign: FullCampaignFragment) {
    super(campaign);

    this.deleted = !!campaign.deleted;
    this.fullCampaign = campaign;
    this.investigatorData = fragmentToFullInvestigatorData(campaign);
    // TODO: do something with their IDs here.
    this.fullLatestDecks = flatMap(this.fullCampaign.latest_decks, d => d.deck ? new LatestDeckRemote(d.deck) : []);

    this.showInterludes = !!campaign.showInterludes;
    this.guideVersion = (typeof campaign.guide_version === 'number') ? campaign.guide_version : -1;
    this.chaosBag = campaign.chaosBag || EMPTY_CHAOS_BAG;
    this.weaknessSet = campaign.weaknessSet || EMPTY_WEAKNESS_SET;
    this.campaignNotes = campaign.campaignNotes || EMPTY_CAMPAIGN_NOTES;
    this.scenarioResults = campaign.scenarioResults || EMPTY_SCENARIO_RESULTS;
    this.linkedCampaignId = campaign.linked_campaign ? {
      campaignId: campaign.linked_campaign.uuid,
      serverId: campaign.linked_campaign.id,
    } : undefined;
  }
  latestDecks(): LatestDeckT[] {
    return this.fullLatestDecks;
  }
  investigatorSpentXp(code: string) {
    return this.investigatorData[code]?.spentXp || 0;
  }
  getInvestigatorData(investigator: string) {
    return this.investigatorData[investigator] || EMPTY_TRAUMA;
  }
}

function unpackGuideInput(input: Pick<Guide_Input, 'id' | 'step' | 'type' | 'scenario' | 'payload'>): GuideInput {
  return {
    ...input.payload,
    step: input.step || null,
    scenario: input.scenario || null,
    type: input.type || null,
  };
}

export class CampaignGuideStateRemote implements CampaignGuideStateT {
  private guide: FullCampaignGuideStateFragment;
  private inputs: GuideInput[];
  private guideUpdatedAt: Date;

  constructor(guide: FullCampaignGuideStateFragment) {
    this.guide = guide;
    this.guideUpdatedAt = new Date(Date.parse(guide.updated_at));
    this.inputs = map(this.guide.guide_inputs, unpackGuideInput);
  }

  undoInputs(scenarioId: string) {
    if (!this.inputs.length) {
      return [];
    }
    const latestInputIndex = findLastIndex(
      this.inputs,
      input => (
        input.scenario === scenarioId &&
        !SYSTEM_BASED_GUIDE_INPUT_TYPES.has(input.type) &&
        !(input.step && SYSTEM_BASED_GUIDE_INPUT_IDS.has(input.step))
      )
    );
    if (latestInputIndex === -1) {
      return [];
    }
    const removedInputs: GuideInput[] = [];
    forEach(this.inputs, (input: GuideInput, idx: number) => {
      if (SYSTEM_BASED_GUIDE_INPUT_TYPES.has(input.type) || (input.step && SYSTEM_BASED_GUIDE_INPUT_IDS.has(input.step))) {
        if (idx >= latestInputIndex && input.scenario === scenarioId) {
          removedInputs.push(input);
        }
      } else if (idx === latestInputIndex) {
        removedInputs.push(input);
      }
    });
    return removedInputs;
  }

  numInputs() {
    return this.guide.guide_inputs.length;
  }

  countInput(pred: (i: GuideInput) => boolean): number {
    return sumBy(this.inputs, i => pred(i) ? 1 : 0);
  }

  findInput(pred: (i: GuideInput) => boolean): GuideInput | undefined {
    return find(this.inputs, pred);
  }
  findLastInput(pred: (i: GuideInput) => boolean): GuideInput | undefined {
    return findLast(this.inputs, pred);
  }

  binaryAchievement(id: string): boolean {
    return !!find(this.guide.guide_achievements || [], a => a.id === id && a.type === 'binary' && a.bool_value);
  }
  countAchievement(id: string): number {
    const entry = find(this.guide.guide_achievements || [], a => a.id === id && a.type === 'count');
    if (entry?.type === 'count') {
      return entry.value || 0;
    }
    return 0;
  }

  lastUpdated(): Date {
    return this.guideUpdatedAt;
  }
}

export function fragmentToDeckId(deck: LatestDeckFragment): DeckId {
  return deck.arkhamdb_id && deck.arkhamdb_user ? {
    id: deck.arkhamdb_id,
    arkhamdb_user: deck.arkhamdb_user,
    local: false,
    uuid: `${deck.arkhamdb_id}`,
    serverId: deck.id,
  } : {
    serverId: deck.id,
    id: undefined,
    arkhamdb_user: undefined,
    local: true,
    uuid: deck.local_uuid || '',
  };
}

export class MiniDeckRemote implements MiniDeckT {
  id: DeckId;
  investigator: string;
  date_update: string;
  name: string;
  campaign_id?: CampaignId;

  constructor(deck: LatestDeckFragment) {
    this.id = fragmentToDeckId(deck);
    this.investigator = deck.investigator;
    this.name = deck.content?.name || '';
    this.date_update = deck.content?.date_update || '';
    this.campaign_id = deck.campaign ? {
      campaignId: deck.campaign.uuid,
      serverId: deck.campaign.id,
    } : undefined;
  }
}

export class LatestDeckRemote extends MiniDeckRemote implements LatestDeckT {
  deck: Deck;
  previousDeck: Deck | undefined;
  campaign: DeckCampaignInfo | undefined;
  owner: SimpleUser | undefined;

  constructor(deck: LatestDeckFragment) {
    super(deck);
    this.owner = deck?.owner ? {
      handle: deck.owner.handle || undefined,
      id: deck.owner.id,
    } : undefined;
    this.deck = deck.content || {};
    this.previousDeck = deck.previous_deck?.content;
    this.campaign = deck.campaign?.name ? {
      id: {
        campaignId: deck.campaign.uuid,
        serverId: deck.campaign.id,
      },
      name: deck.campaign.name,
      trauma: {
        mental: deck.investigator_data?.mental || undefined,
        physical: deck.investigator_data?.physical || undefined,
        killed: deck.investigator_data?.killed || undefined,
        insane: deck.investigator_data?.insane || undefined,
      },
    } : undefined;
  }
}

export class ChaosBagResultsRemote implements ChaosBagResultsT {
  drawnTokens: ChaosTokenType[];
  sealedTokens: SealedToken[];
  blessTokens: number;
  curseTokens: number;
  totalDrawnTokens: number;
  tarot?: Chaos_Bag_Tarot_Mode_Enum;

  constructor(chaosBagResults: FullChaosBagResultFragment) {
    this.drawnTokens = chaosBagResults.drawn || [];
    this.sealedTokens = chaosBagResults.sealed || [];
    this.blessTokens = chaosBagResults.bless || 0;
    this.curseTokens = chaosBagResults.curse || 0;
    this.totalDrawnTokens = chaosBagResults.totalDrawn || 0;
    this.tarot = chaosBagResults.tarot || undefined;
  }
}

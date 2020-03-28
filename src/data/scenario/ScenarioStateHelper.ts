import {
  ListChoices,
  SupplyCounts,
} from 'actions/types';
import CampaignStateHelper from './CampaignStateHelper';

export default class ScenarioStateHelper {
  scenarioId: string;
  campaignState: CampaignStateHelper;

  constructor(scenarioId: string, campaignState: CampaignStateHelper) {
    this.scenarioId = scenarioId;
    this.campaignState = campaignState;
  }

  setChoice(id: string, value: number) {
    this.campaignState.setChoice(id, value, this.scenarioId);
  }

  choice(id: string): number | undefined {
    return this.campaignState.choice(id, this.scenarioId);
  }

  setChoiceList(id: string, value: ListChoices) {
    this.campaignState.setChoiceList(id, value, this.scenarioId);
  }

  choiceList(id: string): ListChoices | undefined {
    return this.campaignState.choiceList(id, this.scenarioId);
  }

  setSupplies(id: string, value: SupplyCounts) {
    this.campaignState.setSupplies(id, value, this.scenarioId);
  }

  supplies(id: string): SupplyCounts | undefined {
    return this.campaignState.supplies(id, this.scenarioId);
  }

  setDecision(id: string, value: boolean) {
    this.campaignState.setDecision(id, value, this.scenarioId);
  }

  decision(id: string): boolean | undefined {
    return this.campaignState.decision(id, this.scenarioId);
  }

  setCount(id: string, value: number) {
    this.campaignState.setCount(id, value, this.scenarioId);
  }

  count(id: string): number | undefined {
    return this.campaignState.count(id, this.scenarioId);
  }
}

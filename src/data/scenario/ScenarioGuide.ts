import { find, last } from 'lodash';

import {
  Step,
  Scenario,
  Resolution,
  CustomData,
} from './types';
import GuidedCampaignLog from './GuidedCampaignLog';
import ScenarioStep from './ScenarioStep';
import ScenarioStateHelper from './ScenarioStateHelper';
import CampaignGuide from './CampaignGuide';
import CampaignStateHelper from './CampaignStateHelper';
import {
  getFixedStep,
  scenarioStepIds,
} from './fixedSteps';
import { CampaignDifficulty } from '@actions/types';

interface ExecutedScenario {
  steps: ScenarioStep[];
  inProgress: boolean;
  latestCampaignLog: GuidedCampaignLog;
}

/**
 * Wrapper utility to provide structured access to scenarios.
 */
export default class ScenarioGuide {
  id: string;
  campaignGuide: CampaignGuide;
  private scenario: Scenario;
  private scenarioStartCampaignLog: GuidedCampaignLog;
  private standalone: boolean;

  constructor(
    id: string,
    scenario: Scenario,
    campaignGuide: CampaignGuide,
    campaignLog: GuidedCampaignLog,
    standalone: boolean
  ) {
    this.id = id;
    this.scenario = scenario;
    this.campaignGuide = campaignGuide;
    this.scenarioStartCampaignLog = campaignLog;
    this.standalone = standalone;
  }

  scenarioId(): string {
    return this.scenario.id;
  }

  scenarioIcon(): string {
    return this.scenario.icon || this.scenario.id;
  }

  scenarioName(): string {
    return this.scenario.scenario_name;
  }

  scenarioCard(): string | undefined {
    return this.scenario.chaos_bag_card;
  }

  scenarioCustomData(): CustomData | undefined {
    return this.scenario.custom;
  }

  scenarioCardText(difficulty: CampaignDifficulty): string | undefined {
    if (difficulty === CampaignDifficulty.EASY || difficulty === CampaignDifficulty.STANDARD) {
      return this.scenario.chaos_bag_card_text;
    }
    return this.scenario.chaos_bag_card_back_text;
  }

  scenarioHeader(): string {
    return this.scenario.header;
  }

  fullScenarioName(): string {
    return this.scenario.full_name;
  }

  scenarioType(): 'scenario' | 'epilogue' | 'interlude' | 'placeholder' {
    return this.scenario.type || 'scenario';
  }

  allowSideScenario(): boolean {
    return !!this.scenario.allow_side_scenario;
  }

  resolutions(): Resolution[] {
    return this.scenario.resolutions || [];
  }

  step(
    id: string,
    campaignState: CampaignStateHelper,
    campaignLog: GuidedCampaignLog
  ): Step | undefined {
    if (id.indexOf('#') !== -1) {
      const step = this.stepHelper(
        id.split('#')[0],
        campaignState,
        campaignLog
      );
      if (!step) {
        return undefined;
      }
      return {
        ...step,
        id,
      };
    }
    return this.stepHelper(id, campaignState, campaignLog);
  }

  private stepHelper(
    id: string,
    campaignState: CampaignStateHelper,
    campaignLog: GuidedCampaignLog,
  ) {
    const existingStep = find(
      this.scenario.steps,
      step => step.id === id
    );
    if (existingStep) {
      return existingStep;
    }

    const fixedStep = getFixedStep(
      id,
      this,
      campaignState,
      campaignLog,
      this.standalone
    );
    if (fixedStep) {
      return fixedStep;
    }
    throw new Error(`Could not find step: ${id}`);
  }

  resolution(
    id: string
  ): Resolution | undefined {
    return find(this.scenario.resolutions || [], resolution => resolution.id === id);
  }

  setupSteps(
    scenarioState: ScenarioStateHelper,
    standalone?: boolean
  ): ExecutedScenario {
    const stepIds = scenarioStepIds(this.scenario, standalone);
    const steps = this.expandSteps(stepIds, scenarioState, this.scenarioStartCampaignLog);
    const lastStep = last(steps);
    if (!lastStep) {
      // Every scenario has at least one step.
      return {
        steps,
        inProgress: true,
        latestCampaignLog: this.scenarioStartCampaignLog,
      };
    }
    const nextCampaignLog = lastStep.nextCampaignLog(scenarioState);
    return {
      steps,
      inProgress: !lastStep.scenarioFinished(scenarioState),
      latestCampaignLog: nextCampaignLog || lastStep.campaignLog,
    };
  }

  expandSteps(
    stepIds: string[],
    scenarioState: ScenarioStateHelper,
    campaignLog: GuidedCampaignLog
  ): ScenarioStep[] {
    if (!stepIds.length) {
      return [];
    }
    const [firstStepId, ...remainingStepIds] = stepIds;
    const step = this.step(firstStepId, scenarioState.campaignState, campaignLog);
    if (!step) {
      return [];
    }
    const result: ScenarioStep[] = [];
    let scenarioStep: ScenarioStep | undefined = new ScenarioStep(
      step,
      this,
      new GuidedCampaignLog(
        [],
        this.campaignGuide,
        scenarioState.campaignState,
        campaignLog,
        this.id
      ),
      remainingStepIds
    );
    while (scenarioStep) {
      result.push(scenarioStep);
      if (scenarioStep.scenarioFinished(scenarioState)) {
        break;
      }
      scenarioStep = scenarioStep.nextStep(scenarioState);
    }
    return result;
  }
}

import { find, flatMap, last } from 'lodash';

import {
  Step,
  Scenario,
  Resolution,
} from './types';
import GuidedCampaignLog from './GuidedCampaignLog';
import ScenarioStep from './ScenarioStep';
import ScenarioStateHelper from './ScenarioStateHelper';
import CampaignGuide from './CampaignGuide';
import {
  getFixedStep,
  scenarioStepIds,
} from './fixedSteps';

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
  private scenario: Scenario;
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;

  constructor(
    id: string,
    scenario: Scenario,
    campaignGuide: CampaignGuide,
    campaignLog: GuidedCampaignLog
  ) {
    this.id = id;
    this.scenario = scenario;
    this.campaignGuide = campaignGuide;
    this.campaignLog = campaignLog;
  }

  scenarioName(): string {
    return this.scenario.scenario_name;
  }

  scenarioType(): 'scenario' | 'epilogue' | 'interlude' {
    return this.scenario.type || 'scenario';
  }

  step(id: string): Step | undefined {
    const fixedStep = getFixedStep(id, this.scenario, this.campaignLog);
    if (fixedStep) {
      return fixedStep;
    }

    return find(
      this.scenario.steps,
      step => step.id === id
    );
  }

  resolution(
    id: string
  ): Resolution | undefined {
    return find(this.scenario.resolutions || [], resolution => resolution.id === id);
  }

  encounterSets(scenarioState: ScenarioStateHelper): string[] {
    return flatMap(
      this.setupSteps(scenarioState).steps,
      step => {
        if (step.step.type === 'encounter_sets') {
          return step.step.encounter_sets;
        }
        return [];
      }
    );
  }

  setupSteps(
    scenarioState: ScenarioStateHelper
  ): ExecutedScenario {
    const stepIds = scenarioStepIds(this.scenario);
    const steps = this.expandSteps(stepIds, scenarioState);

    const lastStep = last(steps);
    if (!lastStep) {
      // Every scenario has at least one step.
      return {
        steps,
        inProgress: true,
        latestCampaignLog: this.campaignLog,
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
    campaignLog?: GuidedCampaignLog
  ): ScenarioStep[] {
    if (!stepIds.length) {
      return [];
    }
    const [firstStepId, ...remainingStepIds] = stepIds;
    const step = this.step(firstStepId);
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
        scenarioState.campaignState.investigators,
        campaignLog || this.campaignLog,
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

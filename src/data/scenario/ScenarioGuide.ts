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
import fixedSteps, {
  LEAD_INVESTIGATOR_STEP,
  CHOOSE_RESOLUTION_STEP_ID,
  CHECK_INVESTIGATOR_DEFEAT_RESOLUTION_ID,
  PROCEED_STEP,
  chooseResolutionStep,
  checkInvestigatorDefeatStep,
  resolutionStep,
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
  scenario: Scenario;
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;

  constructor(
    scenario: Scenario,
    campaignGuide: CampaignGuide,
    campaignLog: GuidedCampaignLog
  ) {
    this.scenario = scenario;
    this.campaignGuide = campaignGuide;
    this.campaignLog = campaignLog;
  }

  step(id: string): Step | undefined {
    if (fixedSteps[id]) {
      return fixedSteps[id];
    }
    if (id === CHOOSE_RESOLUTION_STEP_ID) {
      return chooseResolutionStep(this.scenario.resolutions || []);
    }
    if (id === CHECK_INVESTIGATOR_DEFEAT_RESOLUTION_ID) {
      return checkInvestigatorDefeatStep(this.scenario.resolutions || []);
    }
    const rStep = resolutionStep(id);
    if (rStep) {
      return rStep;
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
    const stepIds = this.scenario.interlude ?
      [...this.scenario.setup, PROCEED_STEP.id] :
      [LEAD_INVESTIGATOR_STEP.id, ...this.scenario.setup];
    const steps = this.expandSteps(stepIds, scenarioState);

    const lastStep = last(steps);
    if (!lastStep) {
      return {
        steps,
        inProgress: true,
        latestCampaignLog: this.campaignLog,
      };
    }
    const nextCampaignLog = lastStep.nextCampaignLog(scenarioState);
    return {
      steps,
      inProgress: !!lastStep && !lastStep.scenarioFinished(scenarioState),
      latestCampaignLog: nextCampaignLog || lastStep.campaignLog,
    };
  }

  private expandSteps(
    stepIds: string[],
    scenarioState: ScenarioStateHelper
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
        this.scenario.id,
        this.campaignLog
      ),
      remainingStepIds
    );
    while (scenarioStep) {
      result.push(scenarioStep);
      scenarioStep = scenarioStep.nextStep(scenarioState);
    }
    return result;
  }
}

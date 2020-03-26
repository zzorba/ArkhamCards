import { find, flatMap } from 'lodash';

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
  INVESTIGATOR_STATUS_STEP,
} from './fixedSteps';

/**
 * Wrapper utility to provide structured access to scenarios.
 */
export default class ScenarioGuide {
  scenario: Scenario;
  campaignGuide: CampaignGuide;

  constructor(
    scenario: Scenario,
    campaignGuide: CampaignGuide
  ) {
    this.scenario = scenario;
    this.campaignGuide = campaignGuide;
  }

  step(id: string): Step | undefined {
    if (id === INVESTIGATOR_STATUS_STEP.id) {
      return INVESTIGATOR_STATUS_STEP;
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

  mainResolutionSteps(
    resolution: Resolution,
    scenarioState: ScenarioStateHelper
  ): ScenarioStep[] {
    return this.expandSteps(
      [
        INVESTIGATOR_STATUS_STEP.id,
        ...(resolution.steps || []),
      ],
      scenarioState
    );
  }

  encounterSets(scenarioState: ScenarioStateHelper): string[] {
    return flatMap(
      this.setupSteps(scenarioState),
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
  ): ScenarioStep[] {
    return this.expandSteps(this.scenario.setup, scenarioState);

  }

  expandSteps(
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
      new GuidedCampaignLog([]),
      remainingStepIds
    );
    while (scenarioStep) {
      result.push(scenarioStep);
      scenarioStep = scenarioStep.nextStep(scenarioState);
    }
    return result;
  }
}

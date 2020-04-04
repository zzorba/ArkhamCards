import React from 'react';
import {
  Text,
} from 'react-native';
import { filter } from 'lodash';

import EffectsStepComponent from './EffectsStepComponent';
import ResolutionStepComponent from './ResolutionStepComponent';
import CampaignGuideContext, { CampaignGuideContextType } from '../CampaignGuideContext';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import ScenarioStepContext, { ScenarioStepContextType } from '../ScenarioStepContext';
import BranchStepComponent from './BranchStepComponent';
import EncounterSetStepComponent from './EncounterSetStepComponent';
import GenericStepComponent from './GenericStepComponent';
import InputStepComponent from './InputStepComponent';
import RuleReminderStepComponent from './RuleReminderStepComponent';
import StoryStepComponent from './StoryStepComponent';
import ScenarioStep from 'data/scenario/ScenarioStep';

interface Props {
  componentId: string;
  step: ScenarioStep;
  fontScale: number;
}

export default class ScenarioStepComponent extends React.Component<Props> {
  renderContent() {
    const {
      step: { step, campaignLog },
      fontScale,
    } = this.props;
    if (!step.type) {
      return <GenericStepComponent step={step} />;
    }
    switch (step.type) {
      case 'branch':
        return (
          <BranchStepComponent
            step={step}
            campaignLog={campaignLog}
          />
        );
      case 'story':
        return (
          <StoryStepComponent
            step={step}
          />
        );
      case 'encounter_sets':
        return <EncounterSetStepComponent step={step} />;
      case 'rule_reminder':
        return <RuleReminderStepComponent step={step} />;
      case 'resolution':
        return <ResolutionStepComponent step={step} />;
      case 'input':
        return (
          <InputStepComponent
            componentId={this.props.componentId}
            fontScale={fontScale}
            step={step}
            campaignLog={campaignLog}
          />
        );
      case 'effects':
        return (
          <EffectsStepComponent
            componentId={this.props.componentId}
            fontScale={fontScale}
            step={step}
            campaignLog={campaignLog}
          />
        );
      default:
        return <Text>Unknown step type</Text>;
    }
  }

  render() {
    const { step } = this.props;
    return (
      <CampaignGuideContext.Consumer>
        { ({ campaignInvestigators }: CampaignGuideContextType) => (
          <ScenarioGuideContext.Consumer>
            { (scenarioGuideContext: ScenarioGuideContextType) => {
              const safeCodes = new Set(step.campaignLog.investigatorCodesSafe());
              const investigators = filter(campaignInvestigators, investigator => safeCodes.has(investigator.code));
              const context: ScenarioStepContextType = {
                ...scenarioGuideContext,
                campaignLog: step.campaignLog,
                scenarioInvestigators: investigators,
              };
              return (
                <ScenarioStepContext.Provider value={context}>
                  { this.renderContent() }
                </ScenarioStepContext.Provider>
              );
            } }
          </ScenarioGuideContext.Consumer>
        ) }
      </CampaignGuideContext.Consumer>
    );
  }
}

import React from 'react';
import { ngettext, msgid } from 'ttag';

import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import ScenarioStepContext, { ScenarioStepContextType } from '@components/campaignguide/ScenarioStepContext';
import InvestigatorCounterComponent from '@components/campaignguide/prompts/InvestigatorCounterComponent';
import { InputStep, InvestigatorCounterInput } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import Card from '@data/Card';
import { forEach } from 'lodash';

interface Props {
  step: InputStep;
  input: InvestigatorCounterInput;
  campaignLog: GuidedCampaignLog;
}

export default class InvestigatorCounterInputComponent extends React.Component<Props> {
  investigatorCounterLimits(scenarioInvestigators: Card[]) {
    const { campaignLog, input } = this.props;
    if (!input.max && !input.investigator_max) {
      return undefined;
    }

    const limits: { [key: string]: number } = {};
    forEach(scenarioInvestigators, investigator => {
      const trauma = campaignLog.traumaAndCardData(investigator.code);
      if (input.max) {
        limits[investigator.code] = input.max;
      } else if (input.investigator_max === 'physical_trauma') {
        limits[investigator.code] = trauma.physical || 0;
      } else if (input.investigator_max === 'mental_trauma') {
        limits[investigator.code] = trauma.mental || 0;
      }
    });
    return limits;
  }

  description(scenarioInvestigators: Card[]) {
    const { campaignLog, input } = this.props;
    if (!input.show_special_xp) {
      return undefined;
    }
    const specialXpType = input.show_special_xp;
    const description: { [key: string]: string } = {};
    forEach(scenarioInvestigators, investigator => {
      const specialXp = campaignLog.specialXp(investigator.code, specialXpType);
      description[investigator.code] = ngettext(
        msgid`${specialXp} resupply experience available`,
        `${specialXp} resupply experience available`,
        specialXp
      );
    });
    return description;
  }

  render() {
    const { step, input } = this.props;
    return (
      <>
        <SetupStepWrapper bulletType={step.bullet_type}>
          { !!step.text && <CampaignGuideTextComponent text={step.text} /> }
        </SetupStepWrapper>
        <ScenarioStepContext.Consumer>
          { ({ scenarioInvestigators }: ScenarioStepContextType) => (
            <InvestigatorCounterComponent
              id={step.id}
              countText={input.text}
              limits={this.investigatorCounterLimits(scenarioInvestigators)}
              description={this.description(scenarioInvestigators)}
            />
          ) }
        </ScenarioStepContext.Consumer>
      </>
    );
  }
}
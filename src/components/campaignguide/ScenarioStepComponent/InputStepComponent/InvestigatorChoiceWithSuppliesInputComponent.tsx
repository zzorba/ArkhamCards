import React from 'react';
import { View } from 'react-native';
import { find } from 'lodash';
import { t } from 'ttag';

import ChooseInvestigatorPrompt from '../../prompts/ChooseInvestigatorPrompt';
import SetupStepWrapper from '../../SetupStepWrapper';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import Card from '@data/Card';
import {
  InputStep,
  InvestigatorChoiceWithSuppliesInput,
} from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';

interface Props {
  step: InputStep;
  input: InvestigatorChoiceWithSuppliesInput;
  campaignLog: GuidedCampaignLog;
}

export default class InvestigatorChoiceWithSuppliesInputComponent extends React.Component<Props> {
  investigatorHasSupply(code: string) {
    const { input, campaignLog } = this.props;
    const investigatorSection = campaignLog.investigatorSections[input.section] || {};
    const section = investigatorSection[code];
    return !!(section &&
      find(section.entries, entry => entry.id === input.id && entry.type === 'count' && entry.count > 0) &&
      !section.crossedOut[input.id]
    );
  }

  _investigatorToString = (card: Card) => {
    const { input } = this.props;
    if (this.investigatorHasSupply(card.code)) {
      return t`${card.name}\n(has ${input.id})`;
    }
    return card.name;
  };

  _renderInvestigatorChoiceResults = (investigator?: Card) => {
    if (!investigator) {
      return null;
    }
    const { input } = this.props;
    const decision = this.investigatorHasSupply(investigator.code);
    const option = decision ? input.positiveChoice : input.negativeChoice;
    return (
      <SetupStepWrapper bulletType="small">
        <CampaignGuideTextComponent text={`${investigator.name} reads <b>${option.text}</b>`} />
      </SetupStepWrapper>
    );
  };

  render(): React.ReactNode {
    const { step, input } = this.props;
    return (
      <View>
        <SetupStepWrapper>
          { !!step.text && <CampaignGuideTextComponent text={step.text} /> }
        </SetupStepWrapper>
        <ChooseInvestigatorPrompt
          id={step.id}
          title={input.prompt}
          choiceId="investigator_choice"
          investigatorToValue={this._investigatorToString}
          renderResults={this._renderInvestigatorChoiceResults}
          required
        />
      </View>
    );
  }
}

import React from 'react';
import {
  Text,
} from 'react-native';
import { find } from 'lodash';
import { ngettext, msgid, t } from 'ttag';

import BinaryResult from '../../BinaryResult';
import CardTextComponent from 'components/card/CardTextComponent';
import SetupStepWrapper from '../../SetupStepWrapper';
import SingleCardWrapper from '../../SingleCardWrapper';
import BinaryPrompt from '../../prompts/BinaryPrompt';
import Card from 'data/Card';
import {
  BranchStep,
  MathCondition,
} from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import { mathEqualsConditionResult } from 'data/scenario/conditionHelper';

interface Props {
  step: BranchStep;
  condition: MathCondition;
  campaignLog: GuidedCampaignLog;
}

export default class MathConditionComponent extends React.Component<Props> {
  render(): React.ReactNode {
    const { step, condition, campaignLog } = this.props;
    if (condition.operation !== 'equals' || !step.text) {
      // Always spell these out;
      return null;
    }
    const result = mathEqualsConditionResult(condition, campaignLog);
    return (
      <BinaryResult
        bulletType={step.bullet_type}
        prompt={step.text}
        result={result.decision}
      />
    );
  }
}

import React from 'react';
import { find } from 'lodash';
import { t } from 'ttag';

import BinaryResult from '../../BinaryResult';
import {
  BranchStep,
  TraumaCondition,
} from 'data/scenario/types';
import { traumaConditionResult } from 'data/scenario/conditionHelper';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: TraumaCondition;
  campaignLog: GuidedCampaignLog;
}

export default class TraumaConditionComponent extends React.Component<Props> {
  prompt(): string {
    const { condition } = this.props;
    switch (condition.trauma) {
      case 'killed':
        switch (condition.investigator) {
          case 'lead_investigator':
            return t`If the lead investigator was <b>killed</b>.`;
          case 'all':
            return t`If all investigators were <b>killed</b>`;
        }
    }
  }

  render(): React.ReactNode {
    const { step, condition, campaignLog } = this.props;
    const result = traumaConditionResult(condition, campaignLog);
    return (
      <BinaryResult
        bulletType={step.bullet_type}
        prompt={this.prompt()}
        result={result.decision}
      />
    );
  }
}

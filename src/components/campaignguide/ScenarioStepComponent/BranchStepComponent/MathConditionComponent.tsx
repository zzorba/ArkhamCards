import React from 'react';
import { Text } from 'react-native';

import CampaignGuideContext, { CampaignGuideContextType } from '../../CampaignGuideContext';
import {
  BranchStep,
  MathCondition,
} from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: MathCondition;
  campaignLog: GuidedCampaignLog;
}

export default class MathConditionComponent extends React.Component<Props> {
  render(): React.ReactNode {
    const { step, condition } = this.props;
    return (
      <CampaignGuideContext.Consumer>
        { ({ campaignGuide }: CampaignGuideContextType) => {
          return (<Text>Math is hard</Text>);
        } }
      </CampaignGuideContext.Consumer>
    );
  }
}

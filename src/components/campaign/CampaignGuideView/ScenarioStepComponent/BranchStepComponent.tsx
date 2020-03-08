import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { map } from 'lodash';

import ConditionComponent from './ConditionComponent';
import OptionComponent from './OptionComponent';
import SetupStepWrapper from './SetupStepWrapper';
import { BranchStep } from 'data/scenario/types';
import CampaignGuide from 'data/scenario/CampaignGuide';
import CardTextComponent from 'components/card/CardTextComponent';
import typography from 'styles/typography';

interface Props {
  guide: CampaignGuide;
  step: BranchStep;
}

/*
  export interface BranchStep {
    id: string;
    type: "branch";
    text?: string;
    condition: Condition;
    options: Option[];
  }
*/
export default class BranchStepComponent extends React.Component<Props> {
  render() {
    const {
      guide,
      step,
    } = this.props;
    return (
      <SetupStepWrapper>
        <ConditionComponent condition={step.condition} guide={guide} />
        { !!step.text && (
          <CardTextComponent text={step.text} />
        ) }
        <Text>Options:</Text>
        { map(step.options, (option, idx) => (
          <OptionComponent
            key={idx}
            option={option}
            guide={guide}
          />
        )) }
      </SetupStepWrapper>
    );
  }
}

const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
  },
})

import React from 'react';

import BasicButton from '@components/core/BasicButton';
import { BinaryConditionalChoice } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { calculateBinaryConditionResult } from '@data/scenario/inputHelper';

interface Props {
  index: number;
  choice: BinaryConditionalChoice;
  campaignLog: GuidedCampaignLog;
  onPress: (index: number) => void;
}

export default class BranchButton extends React.Component<Props> {
  _onPress = () => {
    const { index, onPress } = this.props;
    onPress(index);
  };

  render() {
    const { choice, campaignLog } = this.props;
    if (choice.condition) {
      const result = calculateBinaryConditionResult(choice.condition, campaignLog);
      if (!result.option) {
        return null;
      }
    }
    return (
      <BasicButton
        title={choice.text}
        onPress={this._onPress}
      />
    );
  }
}

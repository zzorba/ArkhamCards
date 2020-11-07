import React, { useCallback } from 'react';

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

export default function BranchButton({ index, choice, campaignLog, onPress }: Props) {
  const handleOnPress = useCallback(() => {
    onPress(index);
  }, [index, onPress]);

  if (choice.condition) {
    const result = calculateBinaryConditionResult(choice.condition, campaignLog);
    if (!result.option) {
      return null;
    }
  }
  return (
    <BasicButton
      title={choice.text}
      onPress={handleOnPress}
    />
  );
}

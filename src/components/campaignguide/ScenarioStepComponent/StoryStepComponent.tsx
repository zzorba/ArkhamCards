import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import BorderWrapper from '../BorderWrapper';
import BulletsComponent from './BulletsComponent';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { StoryStep } from '@data/scenario/types';
import space from '@styles/space';
import { playNarration } from '../Narrator';
import { Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { hasDissonantVoices } from '@reducers';

interface Props {
  step: StoryStep;
  width: number;
}

export default function StoryStepComponent({ step, width }: Props) {
  const text = (
    <View style={
      step.border ? [space.paddingSideL, space.paddingTopM] : []
    }>
      <View style={[styles.step, space.marginTopS, space.paddingSideM]}>
        { !!step.text && (
          <CampaignGuideTextComponent
            text={step.text}
            flavor
          />
        ) }
      </View>
      <BulletsComponent bullets={step.bullets} />
    </View>
  );
  if (step.border) {
    return (
      <BorderWrapper border width={width}>
        { text }
      </BorderWrapper>
    );
  }
  return text;
}

const styles = StyleSheet.create({
  step: {
    flexDirection: 'column',
  },
});

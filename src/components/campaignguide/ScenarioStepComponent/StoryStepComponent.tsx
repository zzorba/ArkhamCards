import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import BorderWrapper from '../BorderWrapper';
import BulletsComponent from './BulletsComponent';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { StoryStep } from '@data/scenario/types';
import space from '@styles/space';
import { playNarration } from '../Narrator';
import { Icon } from 'react-native-elements';
import typography from '@styles/typography';

interface Props {
  step: StoryStep;
  width: number;
}

export default function StoryStepComponent({ step, width }: Props) {
  const text = useMemo(() => {
    return (
      <View style={
        step.border ? [space.paddingSideL, space.paddingTopM] : []
      }>
        <View style={space.marginTopM}>
          <View style={{...space.marginSideM, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            { step.narration && (
              <Icon name='play-circle-outline' type='material' onPress={() => playNarration(step.narration!.id)}/>
            ) }
          </View>
        </View>
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
  }, [step]);
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

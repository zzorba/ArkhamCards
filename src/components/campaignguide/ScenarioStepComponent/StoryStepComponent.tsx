import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import BorderWrapper from '../BorderWrapper';
import BulletsComponent from './BulletsComponent';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { StoryStep } from '@data/scenario/types';
import space from '@styles/space';

interface Props {
  step: StoryStep;
  width: number;
}

export default class StoryStepComponent extends React.Component<Props> {
  renderText() {
    const { step } = this.props;
    return (
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
  }
  render() {
    const { step, width } = this.props;
    if (step.border) {
      return (
        <BorderWrapper border width={width}>
          { this.renderText() }
        </BorderWrapper>
      );
    }
    return this.renderText();
  }
}

const styles = StyleSheet.create({
  step: {
    flexDirection: 'column',
  },
});

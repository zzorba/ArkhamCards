import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import BulletsComponent from './BulletsComponent';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { StoryStep } from 'data/scenario/types';
import space from 'styles/space';

interface Props {
  step: StoryStep;
}

export default class StoryStepComponent extends React.Component<Props> {
  render() {
    const { step } = this.props;
    return (
      <>
        <View style={[styles.step, space.marginTopS, space.paddingSideM]}>
          { !!step.text && (
            <CampaignGuideTextComponent
              text={step.text}
              flavor
            />
          ) }
        </View>
        <BulletsComponent bullets={step.bullets} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  step: {
    flexDirection: 'column',
  },
});

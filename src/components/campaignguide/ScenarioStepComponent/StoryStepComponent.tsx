import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import BulletsComponent from './BulletsComponent';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { StoryStep } from 'data/scenario/types';
import typography from 'styles/typography';
import { COLORS } from 'styles/colors';

interface Props {
  step: StoryStep;
}

export default class StoryStepComponent extends React.Component<Props> {
  render() {
    const { step } = this.props;
    return (
      <>
        <View style={styles.step}>
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
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
  },
});

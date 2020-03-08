import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { StoryStep } from 'data/scenario/types';
import CardFlavorTextComponent from 'components/card/CardFlavorTextComponent';

interface Props {
  step: StoryStep;
}

export default class StoreStepComponent extends React.Component<Props> {
  render() {
    const { step } = this.props;
    return (
      <View style={styles.step}>
        { !!step.text && (
          <CardFlavorTextComponent
            text={step.text.replace(/\n/g, '\n\n')}
          />
        ) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
  },
});

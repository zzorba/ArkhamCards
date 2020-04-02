import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { ResolutionStep } from 'data/scenario/types';
import typography from 'styles/typography';

interface Props {
  step: ResolutionStep;
}

export default class ResolutionStepComponent extends React.Component<Props> {
  render() {
    const { step } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioGuide }: ScenarioGuideContextType) => {
          const resolution = scenarioGuide.resolution(step.resolution);
          if (!resolution) {
            return <Text>Unknown resolution: { step.resolution }</Text>;
          }
          return (
            <>
              { !!step.text && (
                <SetupStepWrapper>
                  <CampaignGuideTextComponent text={step.text} />
                </SetupStepWrapper>
              ) }
              { (!!resolution.text || resolution.steps.length > 0) && (
                <View style={styles.step}>
                  <View style={styles.wrapper}>
                    <Text style={typography.mediumGameFont}>
                      { resolution.title }
                    </Text>
                  </View>
                  { !!resolution.text && (
                    <View style={styles.wrapper}>
                      <CampaignGuideTextComponent
                        text={resolution.text.replace(/\n/g, '\n\n')}
                        flavor
                      />
                    </View>
                  ) }
                </View>
              ) }
            </>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  step: {
    marginTop: 16,
  },
  wrapper: {
    marginLeft: 16,
    marginRight: 16,
  },
});

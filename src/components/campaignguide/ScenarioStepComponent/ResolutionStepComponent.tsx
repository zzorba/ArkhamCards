import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { ResolutionStep } from '@data/scenario/types';
import space from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface Props {
  step: ResolutionStep;
}

export default class ResolutionStepComponent extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  render() {
    const { step } = this.props;
    const { typography } = this.context;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ processedScenario }: ScenarioGuideContextType) => {
          const resolution = processedScenario.scenarioGuide.resolution(step.resolution);
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
                <View style={space.marginTopM}>
                  <View style={space.marginSideM}>
                    <Text style={typography.mediumGameFont}>
                      { resolution.title }
                    </Text>
                  </View>
                  { !!resolution.text && (
                    <View style={space.marginSideM}>
                      <CampaignGuideTextComponent
                        text={resolution.text}
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

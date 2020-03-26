import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import StepsComponent from './StepsComponent';
import CardFlavorTextComponent from 'components/card/CardFlavorTextComponent';
import { Resolution } from 'data/scenario/types';
import typography from 'styles/typography';

interface Props {
  resolution: Resolution;
  mainResolution?: boolean;
}


export default class ResolutionComponent extends React.Component<Props> {
  renderSteps() {
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioGuide, scenarioState }: ScenarioGuideContextType) => {
          const { resolution, mainResolution } = this.props;
          const steps = mainResolution ?
            scenarioGuide.mainResolutionSteps(resolution, scenarioState) :
            scenarioGuide.expandSteps(resolution.steps || [], scenarioState);
          return (
            <StepsComponent steps={steps} />
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }

  renderResolution() {
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioGuide }: ScenarioGuideContextType) => {
          const { resolution } = this.props;
          if (!resolution.resolution) {
            return null;
          }
          const nextResolution = scenarioGuide.resolution(resolution.resolution);
          if (nextResolution) {
            return (
              <ResolutionComponent
                resolution={nextResolution}
              />
            );
          }
          return (
            <Text>
              Proceed to Resolution { resolution.resolution }
            </Text>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }

  render() {
    const { resolution, mainResolution } = this.props;
    return (
      <View>
        { !mainResolution && (
          <View style={styles.wrapper}>
            <Text style={typography.mediumGameFont}>
              { resolution.title }
            </Text>
          </View>
        ) }
        { !!resolution.text && (
          <View style={styles.wrapper}>
            <CardFlavorTextComponent
              text={resolution.text.replace(/\n/g, '\n\n')}
              color="#222"
            />
          </View>
        ) }
        { this.renderSteps() }
        { this.renderResolution() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginLeft: 16,
    marginRight: 16,
  },
});

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
  secondary?: boolean;
}


export default class ResolutionComponent extends React.Component<Props> {
  renderSteps() {
    const { resolution } = this.props;
    if (resolution.steps) {
      return (
        <StepsComponent steps={resolution.steps} />
      );
    }
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioGuide }: ScenarioGuideContextType) => {
          if (resolution.resolution) {
            const nextResolution = scenarioGuide.resolution(resolution.resolution);
            if (nextResolution) {
              return (
                <ResolutionComponent
                  resolution={nextResolution}
                  secondary
                />
              );
            }
            return (
              <Text>
                Proceed to Resolution { resolution.resolution }
              </Text>
            );
          }
          return <Text>Unknown Resolution</Text>;
        } }
      </ScenarioGuideContext.Consumer>
    );
  }

  render() {
    const { resolution, secondary } = this.props;
    return (
      <View>
        { !!secondary && (
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

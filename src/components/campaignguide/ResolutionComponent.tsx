import React from 'react';
import {
  Button,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { t} from 'ttag';

import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import StepsComponent from './StepsComponent';
import ScenarioStateHelper from './ScenarioStateHelper';
import BinaryPrompt from './prompts/BinaryPrompt';
import CardFlavorTextComponent from 'components/card/CardFlavorTextComponent';
import { Resolution } from 'data/scenario/types';
import typography from 'styles/typography';

interface Props {
  resolution: Resolution;
  secondary?: boolean;
}

interface State {
  expanded: boolean;
}

export default class ResolutionComponent extends React.Component<Props, State> {
  state: State = {
    expanded: false,
  };

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
              Proceed to Resolution {resolution.resolution}
            </Text>
          );
        }
        return <Text>Unknown Resolution</Text>
      }}
      </ScenarioGuideContext.Consumer>
    );
  }

  _show = () => {
    this.setState({
      expanded: true,
    });
  };

  render() {
    const { resolution, secondary } = this.props;
    if (!this.state.expanded && !secondary) {
      return (
        <Button title={resolution.title} onPress={this._show} />
      );
    }
    return (
      <View>
        <View style={styles.wrapper}>
          <Text style={typography.mediumGameFont}>
            {resolution.title}
          </Text>
        </View>
        { !secondary && false && !!defeatResolution && (
          <BinaryPrompt
            id="investigator_defeat_resolution"
            text={t`Were any investigators defeated?`}
            trueResult={{
              text: t`The defeated investigators must read <b>Investigator Defeat</b> first`,
              resolution: 'investigator_defeat',
            }}
          />
        ) }
        { !!resolution.text && (
          <View style={styles.wrapper}>
            <CardFlavorTextComponent
              text={resolution.text.replace(/\n/g, '\n\n')}
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
})

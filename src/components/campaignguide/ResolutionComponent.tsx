import React from 'react';
import {
  Button,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { t} from 'ttag';

import StepsComponent from './StepsComponent';
import ScenarioStateHelper from './ScenarioStateHelper';
import BinaryPrompt from './ScenarioStepComponent/prompts/BinaryPrompt';
import CardFlavorTextComponent from 'components/card/CardFlavorTextComponent';
import CampaignGuide from 'data/scenario/CampaignGuide';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import { Resolution } from 'data/scenario/types';
import typography from 'styles/typography';

interface Props {
  guide: CampaignGuide;
  scenario: ScenarioGuide;
  resolution: Resolution;
  scenarioState: ScenarioStateHelper;
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
    const { scenario, guide, resolution, scenarioState } = this.props;
    if (resolution.steps) {
      return (
        <StepsComponent
          steps={resolution.steps}
          scenario={scenario}
          guide={guide}
          scenarioState={scenarioState}
        />
      );
    }
    if (resolution.resolution) {
      const nextResolution = scenario.resolution(resolution.resolution);
      if (nextResolution) {
        return (
          <ResolutionComponent
            resolution={nextResolution}
            guide={guide}
            scenario={scenario}
            scenarioState={scenarioState}
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
  }

  _show = () => {
    this.setState({
      expanded: true,
    });
  };

  render() {
    const { resolution, guide, scenario, scenarioState, secondary } = this.props;
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
        { !secondary && !!defeatResolution && (
          <BinaryPrompt
            id="investigator_defeat_resolution"
            text={t`Were any investigators defeated?`}
            trueResult={{
              text: t`The defeated investigators must read <b>Investigator Defeat</b> first`,
              resolution: 'investigator_defeat',
            }}
            guide={guide}
            scenario={scenario}
            scenarioState={scenarioState}
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

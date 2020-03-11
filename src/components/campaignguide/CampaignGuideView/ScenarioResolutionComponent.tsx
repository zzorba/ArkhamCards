import React from 'react';
import {
  Alert,
  Button,
  ScrollView,
  Share,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { find, flatMap, map } from 'lodash';

import StepsComponent from './StepsComponent';
import ScenarioStepComponent from './ScenarioStepComponent';
import ScenarioStateHelper from './ScenarioStateHelper';
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
}

interface State {
  expanded: boolean;
}

export default class ScenarioResolutionComponent extends React.Component<Props, State> {
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
    const { resolution } = this.props;
    if (!this.state.expanded) {
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

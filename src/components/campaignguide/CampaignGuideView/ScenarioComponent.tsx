import React from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { flatMap } from 'lodash';
import { t } from 'ttag';

import StepsComponent from '../StepsComponent';
import ScenarioStateHelper from '../ScenarioStateHelper';
import ResolutionComponent from '../ResolutionComponent';
import CampaignGuide from 'data/scenario/CampaignGuide';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import typography from 'styles/typography';

interface Props {
  guide: CampaignGuide;
  scenario: ScenarioGuide;
  scenarioState: ScenarioStateHelper;
}

interface State {
  currentStep: string;
}

export default class ScenarioComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentStep: props.scenario.scenario.setup[0],
    };
  }

  renderSetupSteps() {
    const { scenario, guide, scenarioState} = this.props;
    return (
      <StepsComponent
        steps={scenario.scenario.setup}
        scenario={scenario}
        guide={guide}
        scenarioState={scenarioState}
      />
    );
  }

  renderResolutions() {
    const { scenario, guide, scenarioState } = this.props;
    if (!scenario.scenario.resolutions) {
      return null;
    }
    return (
      <View style={styles.resolution}>
        <View style={styles.wrapper}>
          <Text style={[typography.bigGameFont, typography.center]}>
            {t`Resolutions`}
          </Text>
          <Text style={[typography.gameFont, typography.center]}>
            {t`DO NOT READ until the end of the scenario`}
          </Text>
        </View>
        { flatMap(scenario.scenario.resolutions, (resolution, idx) => (
          resolution.id === 'investigator_defeat' ? null : (
          <ResolutionComponent
            key={idx}
            resolution={resolution}
            guide={guide}
            scenario={scenario}
            scenarioState={scenarioState}
          />
        ))) }
      </View>
    );
  }

  render() {
    return (
      <View>
        { this.renderSetupSteps() }
        { this.renderResolutions() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginLeft: 16,
    marginRight: 16,
  },
  resolution: {
  },
});

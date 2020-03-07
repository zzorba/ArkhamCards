import React from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { find, flatMap, map } from 'lodash';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Navigation, EventSubscription } from 'react-native-navigation';
import SideMenu from 'react-native-side-menu';
import {
  SettingsButton,
  SettingsCategoryHeader,
} from 'react-native-settings-components';
import { t } from 'ttag';

import ScenarioStepComponent from './ScenarioStepComponent';
import CampaignGuide from '../../../data/scenario/CampaignGuide';
import ScenarioGuide from '../../../data/scenario/ScenarioGuide';

interface Props {
  guide: CampaignGuide;
  scenario: ScenarioGuide;
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

  renderSteps() {
    const { scenario, guide} = this.props;
    return flatMap(scenario.scenario.setup, stepId => {
      const step = scenario.step(stepId);
      if (!step) {
        return null;
      }
      return (
        <ScenarioStepComponent
          key={step.id}
          step={step}
          guide={guide}
        />
      );
    });
  }

  render() {
    return (
      <View>
        { this.renderSteps() }
      </View>
    );
  }
}

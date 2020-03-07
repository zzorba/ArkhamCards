import React from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { find, map } from 'lodash';
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
  render() {
    const { scenario, guide} = this.props;
    const { currentStep } = this.state;
    const step = find(scenario.scenario.steps, step => step.id === currentStep);
    return (
      <View>
        {map(scenario.scenario.steps, step => (
          <ScenarioStepComponent key={step.id} step={step} guide={guide} />
        )) }
      </View>
    );
  }
}

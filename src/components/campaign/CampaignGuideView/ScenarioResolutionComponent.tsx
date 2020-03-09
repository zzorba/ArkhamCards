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
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Navigation, EventSubscription } from 'react-native-navigation';
import SideMenu from 'react-native-side-menu';
import {
  SettingsButton,
  SettingsCategoryHeader,
} from 'react-native-settings-components';
import { t } from 'ttag';

import CardFlavorTextComponent from 'components/card/CardFlavorTextComponent';
import ScenarioStepComponent from './ScenarioStepComponent';
import CampaignGuide from 'data/scenario/CampaignGuide';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import { Resolution } from 'data/scenario/types';

interface Props {
  guide: CampaignGuide;
  scenario: ScenarioGuide;
  resolution: Resolution;
}

interface State {
  expanded: boolean;
}

export default class ScenarioResolutionComponent extends React.Component<Props, State> {
  state: State = {
    expanded: false,
  };

  renderSteps() {
    const { scenario, guide, resolution } = this.props;
    return flatMap(resolution.steps, stepId => {
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

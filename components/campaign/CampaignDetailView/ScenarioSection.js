import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CampaignSummaryComponent from '../CampaignSummaryComponent';
import Button from '../../core/Button';
import NavButton from '../../core/NavButton';
import typography from '../../../styles/typography';

export default class ScenarioSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._addScenarioResult = this.addScenarioResult.bind(this);
    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      campaign,
      navigator,
    } = this.props;
    navigator.push({
      screen: 'Campaign.Scenarios',
      title: 'Scenarios',
      passProps: {
        id: campaign.id,
      },
      backButtonTitle: 'Back',
    });
  }

  addScenarioResult() {
    const {
      campaign,
      navigator,
    } = this.props;
    navigator.push({
      screen: 'Campaign.AddResult',
      title: 'Scenario Result',
      passProps: {
        id: campaign.id,
      },
      backButtonTitle: 'Cancel',
    });
  }

  renderCompletedScenarios() {
    const {
      campaign: {
        scenarioResults,
      },
    } = this.props;

    if (scenarioResults.length === 0) {
      return (
        <Text style={typography.text}>
          ---
        </Text>
      );
    }
    return (
      <View>
        { map(scenarioResults, ({ scenarioCode, scenario, resolution }) => {
          return (
            <Text key={scenarioCode} style={typography.gameFont}>
              { `${scenario}${resolution ? ` (${resolution})` : ''}` }
            </Text>
          );
        }) }
      </View>
    );
  }

  render() {
    const {
      campaign,
    } = this.props;
    return (
      <NavButton onPress={this._onPress}>
        <View style={styles.section}>
          <View style={[styles.padding, styles.marginTop, styles.marginBottom]}>
            <CampaignSummaryComponent campaign={campaign} />
          </View>
          <Button
            align="left"
            size="small"
            text="Record Scenario Results"
            onPress={this._addScenarioResult}
          />
        </View>
      </NavButton>
    );
  }
}

const styles = StyleSheet.create({
  padding: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  section: {
    paddingBottom: 8,
  },
  marginTop: {
    marginTop: 8,
  },
  marginBottom: {
    marginBottom: 8,
  },
});

import React from 'react';
import PropTypes from 'prop-types';
import { capitalize, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CUSTOM } from '../constants';
import Button from '../../core/Button';
import typography from '../../../styles/typography';

export default class ScenarioSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired,
    scenarioPack: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._addScenarioResult = this.addScenarioResult.bind(this);
  }

  addScenarioResult() {
    const {
      campaign,
      navigator,
    } = this.props;
    navigator.push({
      screen: 'Campaign.AddResult',
      title: 'Scenario Results',
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
            <Text key={scenarioCode} style={typography.text}>
              { `${scenario}${resolution ? ` (${resolution})` : ''}` }
            </Text>
          );
        }) }
      </View>
    );
  }

  render() {
    const {
      campaign: {
        name,
        cycleCode,
        difficulty,
      },
      scenarioPack,
    } = this.props;
    return (
      <View style={styles.underline}>
        <Text style={[typography.bigLabel, styles.padding]}>
          { name }
        </Text>
        { cycleCode !== CUSTOM && (
          <View style={[styles.marginTop, styles.padding]}>
            <Text style={typography.small}>
              CAMPAIGN
            </Text>
            <Text style={typography.text}>
              { scenarioPack.name }
            </Text>
          </View>
        ) }
        { !!difficulty && (
          <View style={[styles.marginTop, styles.padding]}>
            <Text style={typography.small}>
              DIFFICULTY
            </Text>
            <Text style={typography.text}>
              { capitalize(difficulty) }
            </Text>
          </View>
        ) }
        <View style={[styles.marginTop, styles.padding]}>
          <Text style={typography.small}>
            SCENARIOS
          </Text>
          { this.renderCompletedScenarios() }
        </View>
        <View style={styles.button}>
          <Button
            align="left"
            text="Add Scenario Result"
            onPress={this._addScenarioResult}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  padding: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  underline: {
    paddingBottom: 8,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  marginTop: {
    marginTop: 8,
  },
  button: {
    marginTop: 4,
  },
});

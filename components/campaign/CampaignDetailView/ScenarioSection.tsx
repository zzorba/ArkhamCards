import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import L from '../../../app/i18n';
import { Campaign } from '../../../actions/types';
import CampaignSummaryComponent from '../CampaignSummaryComponent';
import Button from '../../core/Button';
import NavButton from '../../core/NavButton';
import typography from '../../../styles/typography';

interface Props {
  componentId: string;
  campaign: Campaign;
}
export default class ScenarioSection extends React.Component<Props> {
  _onPress = () => {
    const {
      campaign,
      componentId,
    } = this.props;
    Navigation.push(componentId, {
      component: {
        name: 'Campaign.Scenarios',
        passProps: {
          id: campaign.id,
        },
        options: {
          topBar: {
            title: {
              text: L('Scenarios'),
            },
            backButton: {
              title: L('Back'),
            },
          },
        },
      },
    });
  };

  _addScenarioResult = () => {
    const {
      campaign,
      componentId,
    } = this.props;
    Navigation.push(componentId, {
      component: {
        name: 'Campaign.AddResult',
        passProps: {
          id: campaign.id,
        },
        options: {
          topBar: {
            title: {
              text: L('Scenario Result'),
            },
            backButton: {
              title: L('Cancel'),
            },
          },
        },
      },
    });
  };

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
            text={L('Record Scenario Results')}
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

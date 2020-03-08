import React from 'react';
import { map } from 'lodash';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import { Campaign } from 'actions/types';
import CampaignSummaryComponent from '../CampaignSummaryComponent';
import NavButton from 'components/core/NavButton';
import typography from 'styles/typography';

interface Props {
  fontScale: number;
  campaign: Campaign;
  viewScenarios: () => void;
  addScenarioResult: () => void;
}
export default class ScenarioSection extends React.Component<Props> {
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
      fontScale,
      addScenarioResult,
      viewScenarios,
    } = this.props;
    return (
      <React.Fragment>
        <NavButton fontScale={fontScale} onPress={viewScenarios} noBorder>
          <View style={[styles.section, styles.padding, styles.marginTop, styles.marginBottom]}>
            <CampaignSummaryComponent campaign={campaign} />
          </View>
        </NavButton>
        <View style={[styles.button, styles.bottomBorder]}>
          <Button
            title={t`Record Scenario Results`}
            onPress={addScenarioResult}
          />
        </View>
      </React.Fragment>
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
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  marginTop: {
    marginTop: 8,
  },
  marginBottom: {
    marginBottom: 8,
  },
  button: {
    padding: 8,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
});

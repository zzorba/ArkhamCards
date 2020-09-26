import React from 'react';
import { map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { Campaign } from '@actions/types';
import CampaignSummaryComponent from '../CampaignSummaryComponent';
import NavButton from '@components/core/NavButton';
import space from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface Props {
  campaign: Campaign;
  viewScenarios: () => void;
  addScenarioResult: () => void;
}

export default class ScenarioSection extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  renderCompletedScenarios() {
    const {
      campaign: {
        scenarioResults,
      },
    } = this.props;
    const { gameFont, typography } = this.context;

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
            <Text key={scenarioCode} style={[typography.gameFont, { fontFamily: gameFont }]}>
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
      addScenarioResult,
      viewScenarios,
    } = this.props;
    const { borderStyle } = this.context;
    return (
      <React.Fragment>
        <NavButton onPress={viewScenarios} noBorder>
          <View style={[
            styles.section,
            space.paddingBottomS,
            space.paddingSideS,
            space.marginTopS,
            space.marginBottomS]}>
            <CampaignSummaryComponent campaign={campaign} />
          </View>
        </NavButton>
        <View style={[styles.bottomBorder, borderStyle]}>
          <BasicButton
            title={t`Record Scenario Results`}
            onPress={addScenarioResult}
          />
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  section: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

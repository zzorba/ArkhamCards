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
import typography from '@styles/typography';
import space from '@styles/space';
import COLORS from '@styles/colors';

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
          <View style={[
            styles.section,
            space.paddingBottomS,
            space.paddingSideS,
            space.marginTopS,
            space.marginBottomS]}>
            <CampaignSummaryComponent campaign={campaign} />
          </View>
        </NavButton>
        <View style={styles.bottomBorder}>
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
    borderColor: COLORS.divider,
  },
});

import React from 'react';
import PropTypes from 'prop-types';
import { filter, forEach, map } from 'lodash';
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Campaign, ScenarioResult } from '../../../actions/types';
import { campaignScenarios, Scenario } from '../constants';
import CampaignSummaryComponent from '../CampaignSummaryComponent';
import { getCampaign, AppState } from '../../../reducers';
import typography from '../../../styles/typography';

interface OwnProps {
  id: number;
}

interface ReduxProps {
  campaign?: Campaign;
  cycleScenarios?: Scenario[];
  scenarioByCode?: { [code: string]: Scenario };
}

type Props = OwnProps & ReduxProps;

class CampaignScenarioView extends React.Component<Props> {
  _renderScenarioResult = (scenarioResult: ScenarioResult, idx: number) => {
    const {
      scenarioByCode,
    } = this.props;
    const resolution = scenarioResult.resolution ?
      `: ${scenarioResult.resolution}` : '';
    const xp = ((scenarioResult.xp || 0) > 0 || !scenarioResult.interlude) ?
      ` (${scenarioResult.xp} XP)` : '';
    const scenario = scenarioByCode && scenarioByCode[scenarioResult.scenarioCode];
    const scenarioName = scenario ? scenario.name : scenarioResult.scenario;
    return (
      <Text style={typography.gameFont} key={idx}>
        { `${scenarioName}${resolution}${xp}` }
      </Text>
    );
  };

  renderPendingScenario(scenario: Scenario, idx: number) {
    return (
      <Text style={[typography.gameFont, styles.disabled]} key={idx}>
        { scenario.name }
      </Text>
    );
  }

  render() {
    const {
      campaign,
      cycleScenarios,
    } = this.props;
    if (!campaign) {
      return null;
    }
    const finishedScenarios = new Set(map(campaign.scenarioResults, result => result.scenarioCode));
    const finishedScenarioNames = new Set(map(campaign.scenarioResults, result => result.scenario));
    return (
      <ScrollView style={styles.container}>
        <CampaignSummaryComponent campaign={campaign} hideScenario />
        <Text style={typography.smallLabel}>
          SCENARIOS
        </Text>
        { map(campaign.scenarioResults, this._renderScenarioResult) }
        { map(
          filter(cycleScenarios, scenario => (
            !finishedScenarioNames.has(scenario.name) &&
            !finishedScenarios.has(scenario.code))),
          (scenario, idx) => this.renderPendingScenario(scenario, idx))
        }
        <View style={styles.footer} />
      </ScrollView>
    );
  }
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  const campaign = getCampaign(state, props.id);
  if (campaign) {
    const cycleScenarios = campaignScenarios(campaign.cycleCode);
    const scenarioByCode: { [code: string]: Scenario } = {};
    forEach(cycleScenarios, scenario => {
      scenarioByCode[scenario.code] = scenario;
    });
    return {
      campaign,
      cycleScenarios,
      scenarioByCode,
    };
  }
  return {};
}

export default connect(mapStateToProps)(CampaignScenarioView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  disabled: {
    color: '#bdbdbd',
  },
  footer: {
    height: 50,
  },
});

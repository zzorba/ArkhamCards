import React from 'react';
import PropTypes from 'prop-types';
import { filter, map } from 'lodash';
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { CAMPAIGN_SCENARIOS } from '../constants';
import CampaignSummaryComponent from '../CampaignSummaryComponent';
import { getCampaign } from '../../../reducers';
import typography from '../../../styles/typography';

class CampaignScenarioView extends React.Component {
  static propTypes = {
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    campaign: PropTypes.object.isRequired,
    cycleScenarios: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this._renderScenarioResult = this.renderScenarioResult.bind(this);
  }

  renderScenarioResult(scenarioResult, idx) {
    const resolution = scenarioResult.resolution ?
      `: ${scenarioResult.resolution}` : '';
    const xp = (scenarioResult.xp > 0 || !scenarioResult.interlude) ?
      ` (${scenarioResult.xp} XP)` : '';
    return (
      <Text style={typography.gameFont} key={idx}>
        { `${scenarioResult.scenario}${resolution}${xp}` }
      </Text>
    );
  }

  renderPendingScenario(scenario, idx) {
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
    const finishedScenarios = new Set(map(campaign.scenarioResults, result => result.scenario));
    return (
      <ScrollView style={styles.container}>
        <CampaignSummaryComponent campaign={campaign} hideScenario />
        <Text style={typography.smallLabel}>
          SCENARIOS
        </Text>
        { map(campaign.scenarioResults, this._renderScenarioResult) }
        { map(
          filter(cycleScenarios, scenario => !finishedScenarios.has(scenario.name)),
          (scenario, idx) => this.renderPendingScenario(scenario, idx))
        }
        <View style={styles.footer} />
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  const campaign = getCampaign(state, props.id);
  return {
    campaign: campaign,
    cycleScenarios: CAMPAIGN_SCENARIOS[campaign.cycleCode] || [],
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignScenarioView);


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

import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CampaignSummaryComponent from '../CampaignSummaryComponent';
import { getCampaign } from '../../../reducers';
import typography from '../../../styles/typography';

class CampaignScenarioView extends React.Component {
  static propTypes = {
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    campaign: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._renderScenarioResult = this.renderScenarioResult.bind(this);
  }

  renderScenarioResult(scenarioResult, idx) {
    const resolution = scenarioResult.resolution ?
      `: ${scenarioResult.resolution}` : '';
    const xp = scenarioResult.xp !== null ?
      ` (${scenarioResult.xp} XP)` : '';
    return (
      <Text style={typography.gameFont} key={idx}>
        { `${scenarioResult.scenario}${resolution}${xp}` }
      </Text>
    );
  }

  render() {
    const {
      campaign,
    } = this.props;
    return (
      <ScrollView style={styles.container}>
        <CampaignSummaryComponent campaign={campaign} hideScenario />
        <Text style={typography.smallLabel}>
          SCENARIOS
        </Text>
        { campaign.scenarioResults.length ?
          map(campaign.scenarioResults, this._renderScenarioResult) : (
            <Text style={typography.text}>
              Not yet started
            </Text>
          )
        }
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  const campaign = getCampaign(state, props.id);
  return {
    campaign: campaign,
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
});

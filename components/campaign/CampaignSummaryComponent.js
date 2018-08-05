import React from 'react';
import PropTypes from 'prop-types';
import { last } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import EncounterIcon from '../../assets/EncounterIcon';
import { CUSTOM } from './constants';
import { CAMPAIGN_NAMES, CAMPAIGN_COLORS } from '../../constants';
import typography from '../../styles/typography';

export default class CampaignSummaryComponent extends React.Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
  };

  latestScenario() {
    return last(this.props.campaign.scenarioResults);
  }

  renderDifficulty() {
    const {
      campaign: {
        difficulty,
      },
    } = this.props;
    return (
      <View style={styles.difficultyRow}>
        <View style={styles.difficulty}>
          <Text style={typography.smallLabel}>
            { difficulty.toUpperCase() }
          </Text>
        </View>
      </View>
    );
  }

  renderCampaign() {
    const {
      campaign: {
        cycleCode,
      },
    } = this.props;
    if (cycleCode === CUSTOM) {
      return null;
    }
    return (
      <View style={styles.marginTop}>
        <Text style={typography.bigGameFont}>
          { CAMPAIGN_NAMES[cycleCode] }
        </Text>
      </View>
    );
  }

  renderLastScenario() {
    const latestScenario = this.latestScenario();
    if (latestScenario && latestScenario.scenario) {
      return (
        <View style={styles.marginTop}>
          <Text style={typography.smallLabel}>
            LATEST SCENARIO
          </Text>
          <Text style={typography.gameFont}>
            { `${latestScenario.scenario}${latestScenario.resolution ? ` (${latestScenario.resolution})` : ''}` }

          </Text>
        </View>
      );
    }
    return (
      <View style={styles.marginTop}>
        <Text style={typography.text}>
          Not yet started
        </Text>
      </View>
    );
  }

  render() {
    const {
      campaign,
    } = this.props;
    return (
      <View style={styles.row}>
        { campaign.cycleCode !== CUSTOM && (
          <View style={styles.backgroundIcon}>
            <EncounterIcon
              encounter_code={campaign.cycleCode}
              size={84}
              color={CAMPAIGN_COLORS[campaign.cycleCode]}
            />
          </View>
        ) }
        <View>
          { this.renderDifficulty() }
          { this.renderCampaign() }
          { this.renderLastScenario() }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  marginTop: {
    marginTop: 4,
  },
  backgroundIcon: {
    position: 'absolute',
    right: 22,
    top: 0,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
  },
  difficultyRow: {
    flexDirection: 'row',
  },
  difficulty: {
    backgroundColor: '#dedede',
    borderRadius: 4,
    paddingLeft: 4,
    paddingRight: 4,
  },
});

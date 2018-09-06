import React from 'react';
import PropTypes from 'prop-types';
import { last } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import L from '../../app/i18n';
import EncounterIcon from '../../assets/EncounterIcon';
import { CUSTOM, campaignNames, CAMPAIGN_COLORS, difficultyStrings } from './constants';
import typography from '../../styles/typography';

export default class CampaignSummaryComponent extends React.Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
    hideScenario: PropTypes.bool,
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
            { difficultyStrings()[difficulty].toUpperCase() }
          </Text>
        </View>
      </View>
    );
  }

  renderCampaign() {
    const {
      campaign: {
        cycleCode,
        name,
      },
    } = this.props;
    return (
      <View style={styles.marginTop}>
        <Text style={typography.bigGameFont}>
          { cycleCode === CUSTOM ? name : campaignNames()[cycleCode] }
        </Text>
      </View>
    );
  }

  renderLastScenario() {
    if (this.props.hideScenario) {
      return null;
    }
    const latestScenario = this.latestScenario();
    if (latestScenario && latestScenario.scenario) {
      const resolution = latestScenario.resolution ?
        `: ${latestScenario.resolution}` : '';
      const xp = (latestScenario.xp > 0 || !latestScenario.interlude) ?
        ` (${latestScenario.xp} XP)` : '';
      return (
        <View style={styles.marginTop}>
          <Text style={typography.smallLabel}>
            { latestScenario.interlude ? L('LATEST INTERLUDE') : L('LATEST SCENARIO') }
          </Text>
          <Text style={typography.gameFont}>
            { `${latestScenario.scenario}${resolution}${xp}` }
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.marginTop}>
        <Text style={typography.text}>
          { L('Not yet started') }
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

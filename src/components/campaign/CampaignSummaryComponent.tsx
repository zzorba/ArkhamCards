import React from 'react';
import { last } from 'lodash';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import { CAMPAIGN_COLORS, campaignNames } from './constants';
import { Campaign, CUSTOM } from 'actions/types';
import typography from 'styles/typography';
import Difficulty from './Difficulty';
import GameHeader from './GameHeader';
import BackgroundIcon from './BackgroundIcon';

interface Props {
  campaign: Campaign;
  hideScenario?: boolean;
}
export default class CampaignSummaryComponent extends React.Component<Props> {
  latestScenario() {
    return last(this.props.campaign.scenarioResults);
  }

  renderCampaign() {
    const {
      campaign: {
        cycleCode,
        name,
      },
    } = this.props;
    const text = cycleCode === CUSTOM ? name : campaignNames()[cycleCode];
    return <GameHeader text={text} />;
  }

  renderLastScenario() {
    if (this.props.hideScenario) {
      return null;
    }
    const latestScenario = this.latestScenario();
    if (latestScenario && latestScenario.scenario) {
      const resolution = latestScenario.resolution ?
        `: ${latestScenario.resolution}` : '';
      const xp = ((latestScenario.xp || 0) > 0 || !latestScenario.interlude) ?
        ` (${latestScenario.xp} XP)` : '';
      return (
        <View style={styles.marginTop}>
          <Text style={typography.smallLabel}>
            { latestScenario.interlude ? t`LATEST INTERLUDE` : t`LATEST SCENARIO` }
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
          { t`Not yet started` }
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
          <BackgroundIcon code={campaign.cycleCode} color={CAMPAIGN_COLORS[campaign.cycleCode]} />
        ) }
        <View>
          <Difficulty difficulty={campaign.difficulty} />
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
  row: {
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
  },
});

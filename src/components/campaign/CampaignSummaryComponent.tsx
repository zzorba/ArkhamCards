import React from 'react';
import { last } from 'lodash';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import { CAMPAIGN_COLORS, campaignNames } from './constants';
import { Campaign, CUSTOM } from '@actions/types';
import typography from '@styles/typography';
import Difficulty from './Difficulty';
import GameHeader from './GameHeader';
import BackgroundIcon from './BackgroundIcon';
import space from '@styles/space';

interface Props {
  campaign: Campaign;
  name?: string;
  hideScenario?: boolean;
}
export default class CampaignSummaryComponent extends React.Component<Props> {
  latestScenario() {
    return last(this.props.campaign.scenarioResults);
  }

  renderCampaign() {
    const {
      campaign,
      name,
    } = this.props;
    const text = campaign.cycleCode === CUSTOM ? campaign.name : campaignNames()[campaign.cycleCode];
    return (
      <>
        <GameHeader text={text} />
        { !!name && (
          <Text style={typography.gameFont}>
            { name }
          </Text>
        ) }
      </>
    );
  }

  renderLastScenario() {
    const { hideScenario, campaign } = this.props;
    if (hideScenario) {
      return null;
    }
    const latestScenario = this.latestScenario();
    if (latestScenario && latestScenario.scenario) {
      const resolution = latestScenario.resolution && !campaign.guided ?
        `: ${latestScenario.resolution}` : '';
      return (
        <View style={space.marginTopXs}>
          <Text style={typography.gameFont}>
            { `${latestScenario.scenario}${resolution}` }
          </Text>
        </View>
      );
    }
    return (
      <View style={space.marginTopXs}>
        <Text style={typography.gameFont}>
          { t`Not yet started` }
        </Text>
      </View>
    );
  }

  renderDifficulty() {
    const {
      campaign,
    } = this.props;
    if (!campaign.difficulty) {
      return null;
    }
    return (
      <View style={space.marginRightS}>
        <Difficulty difficulty={campaign.difficulty} />
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
          <BackgroundIcon
            code={campaign.cycleCode}
            color={CAMPAIGN_COLORS[campaign.cycleCode]}
          />
        ) }
        <View>
          { this.renderCampaign() }
          <View style={styles.textRow}>
            { this.renderDifficulty() }
            { this.renderLastScenario() }
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

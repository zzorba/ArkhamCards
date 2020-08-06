import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CampaignCycleCode, CampaignDifficulty } from '@actions/types';
import { CAMPAIGN_COLORS, difficultyString } from '@components/campaign/constants';
import typography from '@styles/typography';
import GameHeader from '@components/campaign/GameHeader';
import BackgroundIcon from '@components/campaign/BackgroundIcon';
import CampaignGuide from '@data/scenario/CampaignGuide';
import COLORS from '@styles/colors';
import { m, s } from '@styles/space';

interface Props {
  campaignGuide: CampaignGuide;
  difficulty?: CampaignDifficulty;
  inverted?: boolean;
}

export default class CampaignSummaryComponent extends React.Component<Props> {
  render() {
    const {
      campaignGuide,
      difficulty,
      inverted,
    } = this.props;
    const difficultyText = difficulty && difficultyString(difficulty);
    const color = CAMPAIGN_COLORS[campaignGuide.campaignCycleCode() as CampaignCycleCode];
    return (
      <View style={[
        styles.row,
        inverted ? { backgroundColor: color } : {},
        inverted ? styles.section : {},
        inverted ? styles.bottomBorder : {},
      ]}>
        <BackgroundIcon
          code={campaignGuide.campaignCycleCode()}
          color={inverted ? COLORS.darkText : color}
          small
        />
        <View>
          <GameHeader text={campaignGuide.campaignName()} />
          { difficultyText && (
            <Text style={typography.text}>
              { difficultyText }
            </Text>
          ) }
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
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: COLORS.background,
  },
  section: {
    padding: m,
    paddingLeft: s + m,
    paddingRight: s + m,
  },
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
});

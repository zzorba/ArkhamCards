import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CampaignCycleCode, CampaignDifficulty } from '@actions/types';
import { CAMPAIGN_COLORS, difficultyString } from '@components/campaign/constants';
import typography from '@styles/typography';
import GameHeader from '@components/campaign/GameHeader';
import BackgroundIcon from '@components/campaign/BackgroundIcon';
import CampaignGuide from '@data/scenario/CampaignGuide';
import { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  campaignGuide: CampaignGuide;
  difficulty?: CampaignDifficulty;
  inverted?: boolean;
}

export default function CampaignSummaryComponent({
  campaignGuide,
  difficulty,
  inverted,
}: Props) {
  const { backgroundStyle, borderStyle, colors } = useContext(StyleContext);
  const difficultyText = difficulty && difficultyString(difficulty);
  const color = CAMPAIGN_COLORS[campaignGuide.campaignCycleCode() as CampaignCycleCode];
  return (
    <View style={[
      styles.row,
      backgroundStyle,
      inverted ? { backgroundColor: color } : {},
      inverted ? styles.section : {},
      inverted ? styles.bottomBorder : {},
      inverted ? borderStyle : {},
    ]}>
      <BackgroundIcon
        code={campaignGuide.campaignCycleCode()}
        color={inverted ? colors.darkText : color}
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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
    paddingTop: 24,
    paddingBottom: 24,
  },
  section: {
    padding: m,
    paddingLeft: s + m,
    paddingRight: s + m,
  },
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

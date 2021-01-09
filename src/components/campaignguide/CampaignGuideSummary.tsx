import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CampaignCycleCode, CampaignDifficulty } from '@actions/types';
import { campaignColor, difficultyString } from '@components/campaign/constants';
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
  const { backgroundStyle, borderStyle, colors, typography } = useContext(StyleContext);
  const difficultyText = difficulty && difficultyString(difficulty);
  const color = campaignColor(campaignGuide.campaignCycleCode() as CampaignCycleCode, colors);
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
        <Text style={typography.text}>
          { difficultyText || '' }
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
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

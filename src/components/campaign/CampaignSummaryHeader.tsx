import React, { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CampaignCycleCode, CampaignDifficulty } from '@actions/types';
import { campaignColor, difficultyString } from '@components/campaign/constants';
import GameHeader from '@components/campaign/GameHeader';
import BackgroundIcon from '@components/campaign/BackgroundIcon';
import space, { m, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import EncounterIcon from '@icons/EncounterIcon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AppIcon from '@icons/AppIcon';

interface Props {
  name: string;
  cycle: CampaignCycleCode;
  difficulty?: CampaignDifficulty;
  buttons?: React.ReactNode;
}

export default function CampaignSummaryHeader({
  name,
  cycle,
  difficulty,
  buttons,
}: Props) {
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const difficultyText = difficulty && difficultyString(difficulty);
  return (
    <View style={[
      styles.row,
      backgroundStyle,
    ]}>
      <View style={space.paddingSideS}>
        <EncounterIcon
          encounter_code={cycle}
          size={60}
          color={colors.M}
        />
      </View>
      <View style={[space.paddingLeftS, { flex: 1 }]}>
        <Text style={[typography.cardName, space.paddingBottomXs]}>
          { name }
        </Text>
        <View style={[styles.divider, { backgroundColor: colors.L10 }]} />
        <View style={[styles.difficultyRow, space.marginTopXs]}>
          <Text style={[typography.cardTraits, space.marginTopXs]}>
            { difficultyText || '' }
          </Text>
          <View style={[styles.buttons, space.paddingSideXs]}>
            { !!buttons && buttons }
          </View>
        </View>
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
  buttons: {
    flexDirection: 'row',
  },
  difficultyRow: {
    marginTop: xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    marginLeft: xs,
    marginRight: xs,
    height: 1,
  },
});

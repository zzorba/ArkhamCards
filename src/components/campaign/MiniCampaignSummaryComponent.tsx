import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import { campaignNames, campaignColor } from './constants';
import { CUSTOM, STANDALONE } from '@actions/types';
import Difficulty from './Difficulty';
import GameHeader from './GameHeader';
import BackgroundIcon from './BackgroundIcon';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { MiniCampaignT } from '@data/interfaces/MiniCampaignT';

interface Props {
  campaign: MiniCampaignT;
  name?: string;
  hideScenario?: boolean;
  standaloneName?: string;
  children?: React.ReactNode
}

export default function MiniCampaignSummaryComponent({ campaign, name, hideScenario, standaloneName, children }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const cycleCode = campaign.cycleCode();
  const standaloneId = cycleCode === STANDALONE ? campaign.standaloneId() : undefined;
  const latestScenario = useMemo(() => campaign.latestScenarioResult(), [campaign]);
  const campaignSection = useMemo(() => {
    const text = cycleCode === CUSTOM ? campaign.name() : campaignNames()[cycleCode];
    const campaignName = (cycleCode === STANDALONE && standaloneName) || text;
    return (
      <>
        <GameHeader text={campaignName} />
        { !!name && (
          <Text style={typography.gameFont}>
            { name }
          </Text>
        ) }
      </>
    );
  }, [campaign, cycleCode, name, typography, standaloneName]);
  const lastScenarioSection = useMemo(() => {
    if (hideScenario) {
      return null;
    }
    if (latestScenario && latestScenario.scenario) {
      const resolution = latestScenario.resolution && !campaign.guided() ?
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
  }, [hideScenario, campaign, typography, latestScenario]);

  const difficultySection = useMemo(() => {
    const difficulty = campaign.difficulty();
    if (!difficulty) {
      return null;
    }
    return (
      <View style={space.marginRightS}>
        <Difficulty difficulty={difficulty} />
      </View>
    );
  }, [campaign]);

  const color = useMemo(() => campaignColor(cycleCode, colors), [cycleCode, colors]);
  const backgroundIcon = useMemo(() => {
    if (cycleCode === CUSTOM) {
      return null;
    }
    if (standaloneId) {
      return (
        <BackgroundIcon
          code={standaloneId.scenarioId}
          color={colors.L30}
        />
      );
    }
    return (
      <BackgroundIcon
        code={cycleCode}
        color={colors.L30}
      />
    );
  }, [colors, cycleCode, standaloneId]);

  return (
    <View style={[styles.row, space.paddingS, { backgroundColor: color }]}>
      { backgroundIcon }
      <View>
        { campaignSection }
        <View style={styles.textRow}>
          { difficultySection }
          { lastScenarioSection }
        </View>
        { !!children && children }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    position: 'relative',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

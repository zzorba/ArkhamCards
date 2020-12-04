import React, { useContext, useMemo } from 'react';
import { last } from 'lodash';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import { campaignNames, campaignColor } from './constants';
import { Campaign, CUSTOM, STANDALONE } from '@actions/types';
import Difficulty from './Difficulty';
import GameHeader from './GameHeader';
import BackgroundIcon from './BackgroundIcon';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  campaign: Campaign;
  name?: string;
  hideScenario?: boolean;
  standaloneName?: string;
}

export default function CampaignSummaryComponent({ campaign, name, hideScenario, standaloneName }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const latestScenario = useMemo(() => last(campaign.scenarioResults), [campaign.scenarioResults]);
  const campaignSection = useMemo(() => {
    const text = campaign.cycleCode === CUSTOM ? campaign.name : campaignNames()[campaign.cycleCode];
    const campaignName = (campaign.cycleCode === STANDALONE && standaloneName) || text;
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
  }, [campaign, name, typography, standaloneName]);
  const lastScenarioSection = useMemo(() => {
    if (hideScenario) {
      return null;
    }
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
  }, [hideScenario, campaign, typography, latestScenario]);

  const difficultySection = useMemo(() => {
    if (!campaign.difficulty) {
      return null;
    }
    return (
      <View style={space.marginRightS}>
        <Difficulty difficulty={campaign.difficulty} />
      </View>
    );
  }, [campaign]);

  const backgroundIcon = useMemo(() => {
    if (campaign.cycleCode === CUSTOM) {
      return null;
    }
    if (campaign.cycleCode === STANDALONE && campaign.standaloneId) {
      return (
        <BackgroundIcon
          code={campaign.standaloneId.scenarioId}
          color={campaignColor(campaign.cycleCode, colors)}
        />
      );
    }
    return (
      <BackgroundIcon
        code={campaign.cycleCode}
        color={campaignColor(campaign.cycleCode, colors)}
      />
    );
  }, [campaign, colors]);

  return (
    <View style={styles.row}>
      { backgroundIcon }
      <View>
        { campaignSection }
        <View style={styles.textRow}>
          { difficultySection }
          { lastScenarioSection }
        </View>
      </View>
    </View>
  );
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

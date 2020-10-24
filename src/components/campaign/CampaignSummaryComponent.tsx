import React, { useContext, useMemo } from 'react';
import { last } from 'lodash';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import { campaignNames, campaignColor } from './constants';
import { Campaign, CUSTOM } from '@actions/types';
import Difficulty from './Difficulty';
import GameHeader from './GameHeader';
import BackgroundIcon from './BackgroundIcon';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  campaign: Campaign;
  name?: string;
  hideScenario?: boolean;
}

export default function CampaignSummaryComponent({ campaign, name, hideScenario }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const latestScenario = useMemo(() => last(campaign.scenarioResults), [campaign.scenarioResults]);
  const campaignSection = useMemo(() => {
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
  }, [campaign, name, typography]);
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

  return (
    <View style={styles.row}>
      { campaign.cycleCode !== CUSTOM && (
        <BackgroundIcon
          code={campaign.cycleCode}
          color={campaignColor(campaign.cycleCode, colors)}
        />
      ) }
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

import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import { campaignNames, campaignColor, difficultyString } from '@components/campaign/constants';
import { CUSTOM, STANDALONE } from '@actions/types';
import GameHeader from '@components/campaign/GameHeader';
import space, { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import EncounterIcon from '@icons/EncounterIcon';
import AppIcon from '@icons/AppIcon';
import FactionPattern from '@components/core/RoundedFactionHeader/FactionPattern';
import CampaignInvestigatorRow from '../CampaignInvestigatorRow';

interface Props {
  campaign: MiniCampaignT;
  hideScenario?: boolean;
  standaloneName?: string;
  investigators: React.ReactNode;
  name?: string;
}

function computeHeight(hideScenario: boolean | undefined, fontScale: number) {
  return xs + s + Math.ceil(36 * fontScale) + // header;
    CampaignInvestigatorRow.computeHeight(fontScale) + // investigator row
    (hideScenario ? 0 : xs + 30 * fontScale) + // scenario row
    (s * 2 + 26 * fontScale) + s + StyleSheet.hairlineWidth * 4; // name row
}

function CampaignItemHeader({ campaign, hideScenario, investigators, standaloneName, name }: Props) {
  const { colors, fontScale, typography, shadow, width } = useContext(StyleContext);
  const cycleCode = campaign.cycleCode;
  const standaloneId = cycleCode === STANDALONE ? campaign.standaloneId : undefined;
  const latestScenario = useMemo(() => campaign.latestScenarioResult, [campaign]);
  const icon = useMemo(() => {
    if (cycleCode === CUSTOM) {
      return null;
    }
    if (standaloneId) {
      return (
        <EncounterIcon
          encounter_code={standaloneId.scenarioId}
          size={40}
          color={colors.L30}
        />
      );
    }
    return (
      <EncounterIcon
        encounter_code={cycleCode}
        size={40}
        color={colors.L30}
      />
    );
  }, [colors, cycleCode, standaloneId]);
  const campaignSection = useMemo(() => {
    const text = cycleCode === CUSTOM ? campaign.name : campaignNames()[cycleCode];
    const campaignName = (cycleCode === STANDALONE && standaloneName) || text;
    return (
      <View style={styles.row}>
        <View style={space.paddingRightS}>{ icon }</View>
        <View style={styles.flex}>
          <GameHeader text={campaignName} style={typography.white} truncate />
        </View>
      </View>
    );
  }, [campaign, cycleCode, typography, icon, standaloneName]);
  const lastScenarioSection = useMemo(() => {
    if (hideScenario) {
      return null;
    }
    if (latestScenario && latestScenario.scenario) {
      const resolution = latestScenario.resolution && !campaign.guided ?
        `: ${latestScenario.resolution}` : '';
      return (
        <View style={[space.marginTopXs, { flex: 1 }]}>
          <Text style={[typography.mediumGameFont, typography.white]} numberOfLines={1} ellipsizeMode="tail">
            { `${latestScenario.scenario}${resolution}` }
          </Text>
        </View>
      );
    }
    return (
      <View style={space.marginTopXs}>
        <Text style={[typography.mediumGameFont, typography.white]}>
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
      <View style={[styles.difficulty, space.paddingSideS, space.paddingVerticalXs, { backgroundColor: colors.L30 }, space.marginRightS]}>
        <Text style={[typography.small, space.paddingTopXs, { color: colors.darkText, textTransform: 'uppercase' }]}>
          { difficultyString(campaign.difficulty) }
        </Text>
      </View>
    );
  }, [campaign.difficulty, colors, typography]);

  const color = campaignColor(cycleCode, colors);
  return (
    <View style={[styles.background, { height: computeHeight(hideScenario, fontScale), backgroundColor: colors.L20 }]}>
      <View style={[styles.mainCard, space.paddingTopXs, space.paddingLeftS, space.paddingRightXs, space.paddingBottomS, { marginLeft: -1, marginTop: -1, marginRight: -1, backgroundColor: color }, shadow.large]}>
        <FactionPattern height={48} faction="campaign" width={width - s * 2} />
        { campaignSection }
        { investigators }
        <View style={styles.textRow}>
          { lastScenarioSection }
          { difficultySection }
        </View>
      </View>
      <View style={[styles.border, { borderColor: colors.M }, space.marginSideS]}>
        { !!name && (
          <View style={[styles.nameRow, space.paddingTopS, space.paddingBottomS]}>
            <View style={[styles.icon, { backgroundColor: colors.L10 }, space.marginRightS]}>
              <AppIcon name="book" size={24} color={colors.D20} />
            </View>
            <View style={styles.flex}>
              <Text style={[typography.gameFont, typography.light]}>{name}</Text>
            </View>
          </View>
        ) }
      </View>
    </View>
  );
}

CampaignItemHeader.computeHeight = computeHeight;

export default CampaignItemHeader;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  background: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    borderRadius: 8,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  difficulty: {
    borderRadius: 2,
  },
  mainCard: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderRadius: 8,
    position: 'relative',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    borderRadius: 16,
    width: 32,
    height: 32,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

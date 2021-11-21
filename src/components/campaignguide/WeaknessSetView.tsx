import React, { useContext, useCallback, useEffect } from 'react';
import { forEach, isEqual } from 'lodash';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { t } from 'ttag';

import { CampaignId } from '@actions/types';
import { useCampaignGuideContext } from './withCampaignGuideContext';
import StyleContext from '@styles/StyleContext';
import { ControlledWeaknessSetPackChooserComponent } from '@components/weakness/WeaknessSetPackChooserComponent';
import { NavigationProps } from '@components/nav/types';
import LoadingSpinner from '@components/core/LoadingSpinner';
import space, { s, m } from '@styles/space';
import { AnimatedRoundedFactionBlock } from '@components/core/RoundedFactionBlock';
import { useFlag, useToggles } from '@components/core/hooks';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import { useDispatch } from 'react-redux';
import { updateCampaignWeaknessSet } from '@components/campaign/actions';
import { SetCampaignWeaknessSetAction, useSetCampaignWeaknessSet } from '@data/remote/campaigns';

export interface WeaknessSetProps {
  campaignId: CampaignId;
}

function WeaknessSetPackSection({ campaign, componentId, setCampaignWeaknessSet }: { campaign: SingleCampaignT; componentId: string; setCampaignWeaknessSet: SetCampaignWeaknessSetAction }) {
  const { typography, colors } = useContext(StyleContext);
  const dispatch = useDispatch();
  const [liveSelected, toggle] = useToggles(
    () => {
      const r: { [pack: string]: boolean } = {};
      forEach(campaign.weaknessSet.packCodes || [], (pack) => {
        r[pack] = true;
      });
      return r;
    }
  );
  useEffect(() => {
    const newPacks: string[] = [];
    forEach(liveSelected, (selected, pack) => {
      if (selected) {
        newPacks.push(pack);
      }
    });
    if (!isEqual(new Set(campaign.weaknessSet.packCodes), new Set(newPacks))) {
      const newWeaknessSet = {
        ...campaign.weaknessSet,
        packCodes: newPacks,
      };
      dispatch(updateCampaignWeaknessSet(setCampaignWeaknessSet, campaign.id, newWeaknessSet));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveSelected]);
  const [open, toggleOpen] = useFlag(false);
  const renderHeader = useCallback((icon: React.ReactFragment) => {
    return (
      <View style={[
        styles.block,
        { backgroundColor: colors.D10 },
        !open ? {
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        } : undefined,
      ]}>
        <View style={styles.row}>
          <View style={styles.textColumn}>
            <Text style={[typography.mediumGameFont, { color: colors.L20 }, typography.center]}>
              { t`Weakness Set` }
            </Text>
            <Text style={[typography.small, typography.italic, { color: colors.L20 }, typography.center]}>
              { open ? t`Include all basic weaknesses from these expansions` : t`Choose expansions for basic weakness` }
            </Text>
          </View>
          { icon }
        </View>
      </View>
    );
  }, [colors, typography, open]);
  return (
    <AnimatedRoundedFactionBlock
      faction="neutral"
      renderHeader={renderHeader}
      open={open}
      toggleOpen={toggleOpen}
      noSpace
    >
      <View style={[space.paddingXs, space.paddingRightS]}>
        <ControlledWeaknessSetPackChooserComponent
          componentId={componentId}
          onPackCheck={toggle}
          selected={liveSelected}
          compact
        />
      </View>
    </AnimatedRoundedFactionBlock>
  );
}

export default function WeaknessSetView({ componentId, campaignId }: WeaknessSetProps & NavigationProps) {
  const { backgroundStyle } = useContext(StyleContext);
  const [campaignContext] = useCampaignGuideContext(campaignId, false);
  const setCampaignWeaknessSet = useSetCampaignWeaknessSet();

  if (!campaignContext) {
    return <LoadingSpinner />;
  }
  return (
    <ScrollView contentContainerStyle={backgroundStyle}>
      <View style={space.paddingS}>
        <WeaknessSetPackSection
          componentId={componentId}
          campaign={campaignContext.campaign}
          setCampaignWeaknessSet={setCampaignWeaknessSet}
        />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  block: {
    padding: s,
    paddingLeft: m,
    paddingRight: m,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

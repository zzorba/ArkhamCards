import React, { useContext, useCallback, useEffect, useMemo } from 'react';
import { forEach, find, isEqual, map, flatMap } from 'lodash';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { t } from 'ttag';

import { Slots, TraumaAndCardData } from '@actions/types';
import withCampaignGuideContext, { CampaignGuideInputProps } from './withCampaignGuideContext';
import StyleContext from '@styles/StyleContext';
import { ControlledWeaknessSetPackChooserComponent } from '@components/weakness/WeaknessSetPackChooserComponent';
import { NavigationProps } from '@components/nav/types';
import LoadingSpinner from '@components/core/LoadingSpinner';
import space, { s } from '@styles/space';
import { AnimatedRoundedFactionBlock } from '@components/core/RoundedFactionBlock';
import { useFlag, useToggles, useWeaknessCards } from '@components/core/hooks';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import { useDispatch } from 'react-redux';
import { updateCampaignWeaknessSet } from '@components/campaign/actions';
import { SetCampaignWeaknessSetAction, useSetCampaignWeaknessSet } from '@data/remote/campaigns';
import CampaignGuideContext from './CampaignGuideContext';
import Card from '@data/types/Card';
import { AnimatedCompactInvestigatorRow } from '@components/core/CompactInvestigatorRow';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import CampaignErrorView from './CampaignErrorView';

export type WeaknessSetProps = CampaignGuideInputProps;

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

interface WeaknessItem {
  card: Card;
  count: number;
}

function InvestigatorWeakness({ investigator, width, investigatorData, weaknesses }: { componentId: string; investigator: Card; width: number; investigatorData: TraumaAndCardData; weaknesses: Card[] | undefined }) {
  const [open, toggleOpen] = useFlag(false);
  const { campaign } = useContext(CampaignGuideContext);
  const deck = useMemo(() => find(campaign.latestDecks(), deck => deck.investigator === investigator.code), [investigator.code, campaign]);
  const weaknessList: WeaknessItem[] | undefined = useMemo(() => {
    if (!weaknesses) {
      return undefined;
    }
    if (deck) {
      return flatMap(weaknesses, card => {
        const count = (deck?.deck.slots?.[card?.code] || 0) +
          (deck?.deck.ignoreDeckLimitSlots?.[card?.code] || 0);
        if (count > 0) {
          return {
            card,
            count,
          };
        }
        return [];
      });
    }
    const counts: Slots = {};
    forEach([
      ...(investigatorData.addedCards || []),
      ...(investigatorData.ignoreStoryAssets || []),
      ...(investigatorData.storyAssets || []),
    ], code => {
      counts[code] = (counts[code] || 0) + 1;
    });
    return flatMap(weaknesses, card => {
      const count = counts[card.code];
      if (count > 0) {
        return {
          card,
          count,
        };
      }
      return [];
    });
  }, [weaknesses, deck, investigatorData]);
  return (
    <AnimatedCompactInvestigatorRow
      investigator={investigator}
      width={width}
      toggleOpen={toggleOpen}
      open={open}
    >
      { weaknessList ? map(weaknessList, ({ card, count }, idx) => {
        return (
          <CardSearchResult
            key={card.code}
            card={card}
            backgroundColor="transparent"
            control={{
              type: 'count',
              count,
            }}
            noBorder={idx === (weaknessList.length - 1)}
          />
        );
      }) : <LoadingSpinner inline /> }
    </AnimatedCompactInvestigatorRow>
  );
}

function WeaknessSetView({ componentId }: WeaknessSetProps & NavigationProps) {
  const { backgroundStyle, width } = useContext(StyleContext);
  const { campaignInvestigators, campaign, campaignState, campaignGuide } = useContext(CampaignGuideContext);
  const [processedCampaign, processedCampaignError] = useMemo(() => campaignGuide.processAllScenarios(campaignState), [campaignGuide, campaignState]);
  const setCampaignWeaknessSet = useSetCampaignWeaknessSet();
  const weaknessCards = useWeaknessCards();
  if (!processedCampaign) {
    if (processedCampaignError) {
      return <CampaignErrorView message={processedCampaignError} />;
    }
    return <LoadingSpinner large />;
  }
  return (
    <ScrollView contentContainerStyle={backgroundStyle}>
      <View style={space.paddingS}>
        <View style={space.paddingBottomS}>
          <WeaknessSetPackSection
            componentId={componentId}
            campaign={campaign}
            setCampaignWeaknessSet={setCampaignWeaknessSet}
          />
        </View>
        { map(campaignInvestigators, investigator => (
          <View style={space.paddingBottomS} key={investigator.code}>
            <InvestigatorWeakness
              width={width - s * 2}
              componentId={componentId}
              investigator={investigator}
              investigatorData={processedCampaign.campaignLog.traumaAndCardData(investigator.code)}
              weaknesses={weaknessCards}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default withCampaignGuideContext(WeaknessSetView, { rootView: false });

const styles = StyleSheet.create({
  block: {
    padding: s,
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

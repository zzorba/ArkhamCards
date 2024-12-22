import React, { useCallback, useContext, useMemo } from 'react';
import { Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';
import { chunk, map } from 'lodash';

import { TouchableShrink } from '@components/core/Touchables';
import { usePressCallback } from '@components/core/hooks';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import space, { s } from '@styles/space';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import { toRelativeDateString } from '@lib/datetime';
import LanguageContext from '@lib/i18n/LanguageContext';
import StyleContext from '@styles/StyleContext';
import { campaignColor, getChaosBag } from '../constants';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import AppIcon from '@icons/AppIcon';
import { useCampaignFromRedux, useChaosBagResultsRedux } from '@data/local/hooks';
import { CampaignDifficulty, FIXED_CHAOS_BAG_CAMPAIGN_ID } from '@actions/types';
import { flattenChaosBag } from '../campaignUtil';
import ChaosToken, { EXTRA_TINY_TOKEN_SIZE } from '@components/chaos/ChaosToken';
import { iconsMap } from '@app/NavIcons';
import COLORS from '@styles/colors';
import { NavigationProps } from '@components/nav/types';

interface Props {
  campaign: MiniCampaignT;
  lastUpdated: Date | string | undefined;
  children: React.ReactNode;
  onPress: () => void;
}

function computeHeight(fontScale: number) {
  return s + RoundedFactionBlock.computeHeight(fontScale, true, true) + RoundedFooterButton.computeHeight(fontScale);
}
function GenericCampaignItem({ campaign, lastUpdated, children, onPress }: Props) {
  const { lang } = useContext(LanguageContext);
  const { colors } = useContext(StyleContext);
  const debouncedOnPress = usePressCallback(onPress);
  return (
    <View style={[space.paddingSideS, space.paddingBottomS]}>
      <TouchableShrink onPress={debouncedOnPress}>
        <RoundedFactionBlock
          header={children}
          faction="neutral"
          color={campaignColor(campaign.cycleCode, colors)}
          footer={<RoundedFooterButton color="light" icon="date" title={lastUpdated ? toRelativeDateString(lastUpdated, lang) : `???`} />}
          noSpace
        >
          { null }
        </RoundedFactionBlock>
      </TouchableShrink>
    </View>
  );
}

export function SimpleChaosBagItem({ componentId }: NavigationProps) {
  const { colors, typography } = useContext(StyleContext);
  const campaign = useCampaignFromRedux(FIXED_CHAOS_BAG_CAMPAIGN_ID);
  const onPress = useCallback(() => {
    Navigation.push(componentId, {
      component: {
        name: 'SimpleChaosBag',
        options: {
          topBar: {
            title: {
              text: t`Chaos bag`,
            },
            rightButtons: [{
              icon: iconsMap.edit,
              id: 'edit',
              color: COLORS.M,
              accessibilityLabel: t`Edit`,
            }],
          },
        },
      },
    });
  }, [componentId]);
  const debouncedOnPress = usePressCallback(onPress);

  const chaosBag = useMemo(() => campaign?.chaosBag ?? getChaosBag('core', CampaignDifficulty.STANDARD), [campaign?.chaosBag]);
  const chaosBagResults = useChaosBagResultsRedux(FIXED_CHAOS_BAG_CAMPAIGN_ID);
  const chaosBagLines = useMemo(() => {
    const tokens = flattenChaosBag(chaosBag, chaosBagResults.tarot);
    const lineSize = Math.ceil(tokens.length / 3);
    if (lineSize > 0) {
      return chunk(tokens, lineSize);
    }
    return chunk(tokens, 7);
  }, [chaosBag, chaosBagResults.tarot]);
  const OVERLAP_PERCENT = 0.3;
  return (
    <View style={[space.paddingSideS, space.paddingBottomS]}>
      <TouchableShrink onPress={debouncedOnPress}>
        <RoundedFactionBlock
          header={null}
          faction="neutral"
          noSpace
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
            <View style={[{ flexDirection: 'column', flex: 1, justifyContent: 'space-between' }, space.paddingS]}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={[{ borderRadius: 32, backgroundColor: colors.L10 }, space.paddingXs]}>
                  <AppIcon name="chaos_bag" size={32} color={colors.D30} />
                </View>
                <Text style={[typography.bigGameFont, space.paddingLeftM]}>
                  {t`CHAOS BAG`}
                </Text>
              </View>
              <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <View style={[{ height: 1, width: '100%', backgroundColor: colors.L15 }, space.marginTopS, space.marginBottomS]} />
                <Text style={[typography.smallButtonLabel, { color: colors.M }]}>
                  {t`Just a bag. No strings attached.`}
                </Text>
              </View>
            </View>
            <View style={[space.paddingS, { flexDirection: 'column', alignItems: 'flex-end' }]}>
              { map(chaosBagLines, (line, idx) => (
                <View key={idx} style={[{ height: EXTRA_TINY_TOKEN_SIZE, position: 'relative', width: (EXTRA_TINY_TOKEN_SIZE * (1 - OVERLAP_PERCENT) * line.length) + EXTRA_TINY_TOKEN_SIZE * OVERLAP_PERCENT }, space.marginBottomXs]}>
                  { map(line, (token, idx) =>
                    (<View key={idx} style={{ position: 'absolute', top: 0, left: idx * (EXTRA_TINY_TOKEN_SIZE * (1 - OVERLAP_PERCENT)) }}>
                      <ChaosToken size="extraTiny" iconKey={token} />
                    </View>)
                  ) }
                </View>
              )) }
            </View>
          </View>
        </RoundedFactionBlock>
      </TouchableShrink>
    </View>
  );
}
SimpleChaosBagItem.computeHeight = computeHeight;

GenericCampaignItem.computeHeight = computeHeight;
export default GenericCampaignItem;

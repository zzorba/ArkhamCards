import React, { useContext } from 'react';
import { Platform, View } from 'react-native';

import { TouchableShrink } from '@components/core/Touchables';
import { usePressCallback } from '@components/core/hooks';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import space, { s } from '@styles/space';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import { toRelativeDateString } from '@lib/datetime';
import LanguageContext from '@lib/i18n/LanguageContext';
import StyleContext from '@styles/StyleContext';
import { campaignColor } from '../constants';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';

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
          footer={<RoundedFooterButton color="light" icon="date" title={lastUpdated ? toRelativeDateString(lastUpdated, lang) : `???`} onPress={debouncedOnPress} />}
          noSpace
        >
          { null }
        </RoundedFactionBlock>
      </TouchableShrink>
    </View>
  );
}

GenericCampaignItem.computeHeight = computeHeight;
export default GenericCampaignItem;

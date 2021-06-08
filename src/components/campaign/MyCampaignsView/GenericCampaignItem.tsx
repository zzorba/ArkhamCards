import React, { useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { usePressCallback } from '@components/core/hooks';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import space from '@styles/space';
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
export default function GenericCampaignItem({ campaign, lastUpdated, children, onPress }: Props) {
  const { lang } = useContext(LanguageContext);
  const { colors } = useContext(StyleContext);
  const debouncedOnPress = usePressCallback(onPress);

  return (
    <View style={[space.paddingSideS, space.paddingBottomS]}>
      <TouchableOpacity onPress={debouncedOnPress}>
        <RoundedFactionBlock
          header={children}
          faction="neutral"
          color={campaignColor(campaign.cycleCode, colors)}
          footer={<RoundedFooterButton color="light" icon="date" title={lastUpdated ? toRelativeDateString(lastUpdated, lang) : `???`} onPress={debouncedOnPress} />}
          noSpace
        >
          { null }
        </RoundedFactionBlock>
      </TouchableOpacity>
    </View>
  );
}
import React, { useContext, useMemo } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { map, sumBy } from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import CampaignMergeItem from './CampaignMergeItem';
import { Campaign } from '@actions/types';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useFlag } from '@components/core/hooks';

interface Props {
  title: string;
  campaigns: Campaign[];
  values: { [id: string]: boolean | undefined };
  inverted?: boolean;
  onValueChange: (campaign: Campaign, value: boolean) => void;
}

export default function CampaignMergeSection({ title, campaigns, values, inverted, onValueChange }: Props) {
  const { colors, borderStyle, typography } = useContext(StyleContext);
  const [open, toggleOpen] = useFlag(false);
  const itemsSection = useMemo(() => {
    return (
      <>
        { map(campaigns, campaign => (
          <CampaignMergeItem
            key={campaign.uuid}
            campaign={campaign}
            inverted={!!inverted}
            value={!!values[campaign.uuid]}
            onValueChange={onValueChange}
          />
        )) }
      </>
    );
  }, [campaigns, inverted, onValueChange, values]);

  const headerSection = useMemo(() => {
    const selected = sumBy(campaigns, campaign => {
      if (inverted) {
        return values[campaign.uuid] ? 0 : 1;
      }
      return values[campaign.uuid] ? 1 : 0;
    });
    return (
      <View style={[styles.headerRow, { backgroundColor: colors.L10 }, borderStyle, space.paddingS, space.paddingLeftM]}>
        <Text style={typography.small}>
          { title } ({selected} / {campaigns.length})
        </Text>
        { !inverted && (
          <View style={[styles.icon, space.marginSideS]}>
            <MaterialIcons
              name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color={colors.darkText}
            />
          </View>
        ) }
      </View>
    );
  }, [title, campaigns, inverted, values, open, colors, borderStyle, typography]);

  if (!campaigns.length) {
    return null;
  }
  if (!inverted) {
    return (
      <>
        <TouchableOpacity onPress={toggleOpen}>
          { headerSection }
        </TouchableOpacity>
        <Collapsible collapsed={!open}>
          { itemsSection }
        </Collapsible>
      </>
    );
  }
  return (
    <>
      { headerSection }
      { itemsSection }
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

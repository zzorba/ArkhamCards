import React, { useMemo, useContext } from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { flatMap, map } from 'lodash';
import { t } from 'ttag';

import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { ScarletKey } from '@data/scenario/types';
import { useCardMap } from '@components/card/useCardList';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import AppIcon from '@icons/AppIcon';

interface Props {
  campaignLog: GuidedCampaignLog;
  keys: ScarletKey[];
}

export default function CampaignLogScarletKeysComponent({ keys, campaignLog }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const keyStatus = campaignLog.campaignData.scarlet.keyStatus;
  const codes = useMemo(() => flatMap(keys, key => {
    return keyStatus[key.id]?.investigator || [];
  }), [keys, keyStatus]);
  const [cards, loading] = useCardMap(codes, 'player');
  if (loading) {
    return <ActivityIndicator size="small" animating />;
  }
  return (
    <>
      <View style={[styles.mainRow, space.marginBottomS, space.paddingSideS]}>
        <Text style={[typography.cursive, typography.underline, { color: colors.faction.survivor.text }]}>
          { t`Name of Paradimensional Artifact` }
        </Text>
        <View style={styles.flexRow}>
          <Text style={[typography.cursive, typography.underline, { color: colors.faction.survivor.text }]}>
            { t`Bearer` }
          </Text>
        </View>
      </View>
      { map(keys, ({ id, name }) => {
        const status = keyStatus[id];
        const bearer = status?.enemy ? campaignLog.campaignGuide.card(status.enemy)?.name : (status?.investigator && cards[status.investigator]?.name);
        return (
          <View key={id} style={[styles.mainRow, space.paddingBottomS, space.paddingSideS, { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.D10 }, space.marginBottomS]}>
            <View style={styles.row}>
              <View style={[styles.box, { borderColor: colors.D20 }]}>
                { !!(status?.enemy || status?.investigator) && (
                  <View style={styles.icon}><AppIcon name={status.enemy ? 'dismiss' : 'check-thin'} size={24} color={colors.D30} /></View>
                ) }
              </View>
              <Text style={[typography.cursive, space.paddingLeftS]}>
                { name }
              </Text>
            </View>
            <View style={styles.flexRow}>
              <Text style={[typography.cursive]}>
                { bearer }
              </Text>
            </View>
          </View>
        );
      }) }
    </>
  );
}

const styles = StyleSheet.create({
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 2,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: -2.5,
    left: -2.5,
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

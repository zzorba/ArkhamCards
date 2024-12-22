import React, { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { map } from 'lodash';

import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { ChecklistItem } from '@data/scenario/types';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import AppIcon from '@icons/AppIcon';

interface Props {
  sectionId: string;
  campaignLog: GuidedCampaignLog;
  checklist: ChecklistItem[];
}

export default function CampaignLogChecklistComponent({ sectionId, checklist, campaignLog }: Props) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <>
      { map(checklist, ({ id, name, description }) => {
        const checked = campaignLog.check(sectionId, id);
        return (
          <View key={id} style={[styles.column, space.paddingBottomS, space.paddingSideS, { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.D10 }, space.marginBottomS]}>
            <View style={[styles.row, space.marginBottomXs]}>
              <Text style={[typography.subHeaderText, { fontVariant: ['small-caps'] }, space.paddingRightS]}>
                { name }
              </Text>
            </View>
            <View style={styles.row}>
              <View style={[styles.box, { borderColor: colors.D20 }, space.marginRightS]}>
                <View style={styles.icon}><AppIcon name="check-thin" size={24} color={checked ? colors.D30 : colors.background} /></View>
              </View>
              <Text style={[typography.subHeaderText, typography.italic]}>
                { description }
              </Text>
            </View>
          </View>
        );
      }) }
    </>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
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
});

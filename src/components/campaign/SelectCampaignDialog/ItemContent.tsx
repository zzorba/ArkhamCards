import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import StyleContext from '@styles/StyleContext';
import EncounterIcon from '@icons/EncounterIcon';
import { s, iconSizeScale } from '@styles/space';

interface Props {
  packCode: string;
  text: string;
  description?: string;
  disabled?: boolean;
}

export default function ItemContent({ packCode, text, disabled, description }: Props) {
  const {
    colors,
    fontScale,
    backgroundStyle,
    borderStyle,
    disabledStyle,
    typography,
  } = useContext(StyleContext);
  return (
    <View style={[styles.campaignRow, backgroundStyle, borderStyle, disabled ? disabledStyle : {}]}>
      <View style={styles.campaignIcon}>
        <EncounterIcon
          encounter_code={packCode}
          size={36 * iconSizeScale * fontScale}
          color={colors.darkText}
        />
      </View>
      <View style={styles.column}>
        <Text style={[typography.mediumGameFont, styles.campaignText]}>
          { text }
        </Text>
        { !!description && (
          <Text style={[typography.text, styles.campaignText]}>
            { description }
          </Text>
        ) }
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  campaignRow: {
    paddingTop: s,
    paddingBottom: s,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  campaignText: {
    marginLeft: s,
  },
  campaignIcon: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: s,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
  },
});

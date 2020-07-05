import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Card from 'data/Card';
import typography from 'styles/typography';
import space from 'styles/space';
import COLORS from 'styles/colors';

interface Props {
  investigator: Card;
  detail?: string;
  dark?: boolean;
}

export default function InvestigatorNameRow({
  investigator,
  detail,
  dark,
}: Props) {
  const backgroundColor = dark ?
    COLORS.faction[investigator.factionCode()].light :
    COLORS.faction[investigator.factionCode()].pastelBackground;
  return (
    <View style={[
      styles.investigatorRow,
      space.paddingS,
      space.paddingLeftM,
      { backgroundColor },
      dark ? { borderColor: '#FFF' } : { borderColor: '#888' },
    ]}>
      <View>
        <Text style={[
          typography.mediumGameFont,
          styles.investigatorText,
        ]}>
          { investigator.name }
        </Text>
      </View>
      <View>
        { !!detail && (
          <Text style={[typography.text, styles.investigatorText]}>
            { detail }
          </Text>
        ) }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  investigatorText: {
    fontWeight: '600',
    color: '#000',
  },
  investigatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FACTION_COLORS, FACTION_LIGHT_GRADIENTS } from 'constants';
import Card from 'data/Card';
import typography from 'styles/typography';
import space from 'styles/space';

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
    FACTION_COLORS[investigator.factionCode()] :
    FACTION_LIGHT_GRADIENTS[investigator.factionCode()][0];
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
          dark ? { color: '#FFF' } : { color: '#000' },
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
  },
  investigatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

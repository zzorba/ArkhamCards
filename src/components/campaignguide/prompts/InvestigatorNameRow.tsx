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
    FACTION_LIGHT_GRADIENTS[investigator.factionCode()][1] :
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

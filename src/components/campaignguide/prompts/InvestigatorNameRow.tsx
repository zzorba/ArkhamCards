import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FACTION_COLORS } from 'constants';
import Card from 'data/Card';
import typography from 'styles/typography';

interface Props {
  investigator: Card;
  detail?: string;
}

export default function InvestigatorNameRow({ investigator, detail }: Props) {
  const backgroundColor = FACTION_COLORS[investigator.factionCode()];
  return (
    <View style={[styles.investigatorRow, { backgroundColor }]}>
      <View>
        <Text style={[typography.text, styles.investigatorText]}>
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
    color: '#FFF',
    fontWeight: '700',
  },
  investigatorRow: {
    padding: 8,
    paddingLeft: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

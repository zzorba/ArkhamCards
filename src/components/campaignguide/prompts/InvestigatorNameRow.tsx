import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FACTION_COLORS } from 'constants';
import Card from 'data/Card';
import typography from 'styles/typography';
import space from 'styles/space';

interface Props {
  investigator: Card;
  detail?: string;
}

export default function InvestigatorNameRow({ investigator, detail }: Props) {
  const backgroundColor = FACTION_COLORS[investigator.factionCode()];
  return (
    <View style={[
      styles.investigatorRow,
      space.paddingS,
      space.paddingLeftM,
      { backgroundColor },
    ]}>
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
    fontWeight: '600',
  },
  investigatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

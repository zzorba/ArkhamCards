import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Card from '@data/types/Card';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  investigator: Card;
  detail?: string;
}

export default function InvestigatorNameRow({
  investigator,
  detail,
}: Props) {
  const { colors, borderStyle, typography } = useContext(StyleContext);
  const backgroundColor = colors.faction[investigator.factionCode()].background;
  return (
    <View style={[
      styles.investigatorRow,
      borderStyle,
      space.paddingS,
      space.paddingLeftM,
      { backgroundColor },
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
          <Text style={[
            typography.text,
            styles.investigatorText,
          ]}>
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
    color: 'white',
  },
  investigatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

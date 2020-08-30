import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Card from '@data/Card';
import typography from '@styles/typography';
import space from '@styles/space';
import COLORS from '@styles/colors';
import withStyles, { StylesProps } from '@components/core/withStyles';

interface Props {
  investigator: Card;
  detail?: string;
}

function InvestigatorNameRow({
  investigator,
  detail,
  gameFont,
}: Props & StylesProps) {
  const backgroundColor = COLORS.faction[investigator.factionCode()].background;
  return (
    <View style={[
      styles.investigatorRow,
      space.paddingS,
      space.paddingLeftM,
      { backgroundColor },
    ]}>
      <View>
        <Text style={[
          typography.mediumGameFont,
          { fontFamily: gameFont },
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

export default withStyles(InvestigatorNameRow);

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
    borderColor: COLORS.divider,
  },
});

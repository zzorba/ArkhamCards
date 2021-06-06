import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { FactionCodeType } from '@app_constants';
import StyleContext from '@styles/StyleContext';

interface Props {
  faction: FactionCodeType;
}

export default function DeckSectionFooter({ faction }: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <View style={[styles.sectionFooter, {
      borderColor: colors.faction[faction].background,
    }]} />
  );
}

const styles = StyleSheet.create({
  sectionFooter: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    height: 16,
  },
});

import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import StyleContext from '@styles/StyleContext';
import { FactionCodeType } from '@app_constants';
import { s } from '@styles/space';

interface Props {
  faction: FactionCodeType;
  children: React.ReactNode;
}

export default function DeckSectionItemWrapper({ faction, children }: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <View style={[styles.sectionItem, { borderColor: colors.faction[faction].background }]}>
      { children }
    </View>
  );
}

const styles = StyleSheet.create({
  sectionItem: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingLeft: s,
    paddingRight: s,
  },
});
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { FactionCodeType } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import space, { s } from '@styles/space';

interface Props {
  faction: FactionCodeType;
  header: React.ReactNode;
  children: React.ReactNode | React.ReactNode[];
  footer?: React.ReactNode;
  noSpace?: boolean;
}

export default function RoundedFactionBlock({ header, footer, children, faction, noSpace }: Props) {
  const { colors, shadow } = useContext(StyleContext);
  return (
    <View style={[
      styles.block,
      shadow.large,
      {
        borderColor: colors.faction[faction].background,
        backgroundColor: colors.background,
        paddingBottom: footer ? 0 : s,
      },
    ]}>
      { header }
      <View style={noSpace ? undefined : space.marginSideS}>
        { children }
      </View>
      { !!footer && footer }
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: s,
    borderRadius: 9,
    borderWidth: 1,
  },
});
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import FactionPattern from './FactionPattern';
import { FactionCodeType } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import { s, xs } from '@styles/space';

interface Props {
  faction: FactionCodeType;
  dualFaction?: boolean
  width: number;
  children: React.ReactNode | React.ReactNode[];
}

const HEIGHT = 48;

function RoundedFactionHeader({ faction, width, dualFaction, children }: Props) {
  const { colors, fontScale } = useContext(StyleContext);
  const color = colors.faction[dualFaction ? 'dual' : faction].background;

  return (
    <View style={[styles.cardTitle, {
      backgroundColor: color,
      borderColor: color,
    }]} removeClippedSubviews>
      <FactionPattern faction={faction} width={width} height={30 + 18 * fontScale} />
      { children }
    </View>
  );
}
RoundedFactionHeader.HEIGHT = HEIGHT;
export default RoundedFactionHeader;

const styles = StyleSheet.create({
  cardTitle: {
    paddingRight: s,
    paddingTop: xs,
    paddingBottom: xs,
    minHeight: HEIGHT,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

import React, { useCallback, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Placeholder,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';

import FactionPattern from './FactionPattern';
import { FactionCodeType } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import { s, xs } from '@styles/space';

interface Props {
  faction?: FactionCodeType;
  dualFaction?: boolean
  width: number;
  children: React.ReactNode | React.ReactNode[];
  fullRound?: boolean;
  eliminated?: boolean;
  transparent?: boolean;
  color?: 'dark' | 'light';
}

const HEIGHT = 48;

function RoundedFactionHeader({ faction, width, dualFaction, children, fullRound, eliminated, transparent, ...props }: Props) {
  const { colors, fontScale } = useContext(StyleContext);
  const fadeAnim = useCallback((props: any) => {
    return <Fade {...props} style={{ backgroundColor: colors.M }} duration={1000} />;
  }, [colors]);
  if (!faction) {
    return (
      <View style={styles.placeholder}>
        <Placeholder Animation={fadeAnim}>
          <PlaceholderLine noMargin style={[
            styles.loadingHeader,
            fullRound ? styles.fullRound : undefined,
            {
              width: width - 2,
              height: 30 + 18 * fontScale,
            },
          ]} color={colors.D10} />
        </Placeholder>
        { children }
      </View>
    );
  }
  const color = colors.faction[dualFaction ? 'dual' : faction][props.color === 'dark' ? 'darkBackground' : 'background'];
  return (
    <View style={[
      styles.cardTitle,
      fullRound ? styles.fullRound : undefined,
      !transparent ? {
        backgroundColor: color,
        borderColor: color,
      } : undefined,
    ]} opacity={eliminated ? 0.6 : undefined}>
      <FactionPattern
        faction={dualFaction ? 'dual' : faction}
        width={width}
        height={30 + 18 * fontScale}
        transparent={transparent}
        fullRound={fullRound}
      />
      { children }
    </View>
  );
}
RoundedFactionHeader.HEIGHT = HEIGHT;
export default RoundedFactionHeader;

const styles = StyleSheet.create({
  placeholder: {
    minHeight: HEIGHT,
    position: 'relative',
    paddingRight: s,
    paddingTop: xs,
    paddingBottom: xs,
  },
  loadingHeader: {
    position: 'absolute',
    top: -xs,
    left: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  fullRound: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
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

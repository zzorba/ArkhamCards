import React, { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import RoundedFactionHeader from '@components/core/RoundedFactionHeader';
import InvestigatorImage from '@components/core/InvestigatorImage';
import space, { s } from '@styles/space';

interface Props {
  investigator: Card;
  eliminated?: boolean;
  yithian?: boolean;
  open?: boolean;
  upgradeBadge?: boolean;
  leftContent?: React.ReactNode;
  transparent?: boolean;
  width: number;
  children?: React.ReactNode;
}
export default function CompactInvestigatorRow({ eliminated, investigator, transparent, yithian, open, upgradeBadge, leftContent, children, width }: Props) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <RoundedFactionHeader
      transparent={transparent}
      eliminated={eliminated}
      faction={investigator.factionCode()}
      fullRound={!open}
      width={width}
    >
      <View style={[styles.row, space.paddingLeftXs]}>
        { !!leftContent && <View style={space.paddingRightS}>{leftContent}</View>}
        <InvestigatorImage
          card={investigator}
          size="tiny"
          border
          yithian={yithian}
          killedOrInsane={eliminated}
          badge={upgradeBadge ? 'upgrade' : undefined}
        />
        <View style={[space.paddingLeftXs, styles.textColumn]}>
          <Text
            style={[typography.cardName, !transparent ? typography.white : { color: colors.D20 }, eliminated ? typography.strike : undefined]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            { investigator.name }
          </Text>
          <Text style={[typography.cardTraits, !transparent ? typography.white : { color: colors.D20 }, eliminated ? typography.strike : undefined]}>
            { investigator.subname }
          </Text>
        </View>
        { !!children && <View style={space.paddingLeftS}>{children }</View> }
      </View>
    </RoundedFactionHeader>
  );
}


const styles = StyleSheet.create({
  textColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
  },
});

import React, { useContext, useCallback } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import RoundedFactionHeader from '@components/core/RoundedFactionHeader';
import InvestigatorImage from '@components/core/InvestigatorImage';
import space from '@styles/space';
import CollapsibleFactionBlock from './CollapsibleFactionBlock';

interface Props {
  investigator?: Card;
  eliminated?: boolean;
  yithian?: boolean;
  open?: boolean;
  badge?: 'upgrade' | 'deck';
  leftContent?: React.ReactNode;
  transparent?: boolean;
  width: number;
  children?: React.ReactNode;
  description?: string;
  color?: 'dark' | 'light';
  name?: string;
  hideImage?: boolean;
}
export default function CompactInvestigatorRow({ hideImage, color, eliminated, name, description, investigator, transparent, yithian, open, badge, leftContent, children, width }: Props) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <RoundedFactionHeader
      transparent={transparent}
      eliminated={eliminated}
      faction={investigator?.factionCode() || 'neutral'}
      fullRound={!open}
      width={width}
      color={color}
    >
      <View style={[styles.row, space.paddingLeftXs]}>
        { !!leftContent && <View style={space.paddingRightS}>{leftContent}</View>}
        { !hideImage && (
          <InvestigatorImage
            card={investigator}
            size="tiny"
            border
            yithian={yithian}
            killedOrInsane={eliminated}
            badge={badge}
          />
        ) }
        <View style={[space.paddingLeftXs, styles.textColumn]}>
          <Text
            style={[typography.cardName, !transparent ? typography.white : { color: colors.D20 }, eliminated ? typography.strike : undefined]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            { name || investigator?.name }
          </Text>
          <Text
            style={[typography.cardTraits, !transparent ? typography.white : { color: colors.D20 }, eliminated ? typography.strike : undefined]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            { description !== undefined ? description : investigator?.subname }
          </Text>
        </View>
        { !!children && <View style={[styles.rightRow, space.paddingLeftS]}>{ children }</View> }
      </View>
    </RoundedFactionHeader>
  );
}

export function AnimatedCompactInvestigatorRow({
  toggleOpen,
  open,
  headerContent,
  children,
  disabled,
  investigator,
  ...props
}: Props & {
  toggleOpen?: () => void;
  disabled?: boolean;
  headerContent?: React.ReactNode;
}) {
  const renderHeader = useCallback((icon: React.ReactFragment) => (
    <CompactInvestigatorRow investigator={investigator} open={open} {...props}>
      <>
        { headerContent }
        { icon }
      </>
    </CompactInvestigatorRow>
  ), [investigator, headerContent, open, props]);
  return (
    <CollapsibleFactionBlock
      faction={investigator?.factionCode()}
      renderHeader={renderHeader}
      open={open}
      toggleOpen={toggleOpen}
      disabled={disabled}
      noShadow
    >
      <View style={space.paddingTopS}>
        { children }
      </View>
    </CollapsibleFactionBlock>
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
    alignItems: 'center',
  },
  rightRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

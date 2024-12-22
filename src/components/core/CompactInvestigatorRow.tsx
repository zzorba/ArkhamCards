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
  image?: string;
  eliminated?: boolean;
  yithian?: boolean;
  open?: boolean;
  badge?: 'upgrade' | 'deck';
  leftContent?: React.ReactNode;
  transparent?: boolean;
  width: number;
  children?: React.ReactNode;
  description?: string;
  detail?: React.ReactNode;
  color?: 'dark' | 'light';
  name?: string;
  hideImage?: boolean;
  arkhamCardsImg?: string;
  imageOffset?: 'right' | 'left';
}
export default function CompactInvestigatorRow({
  hideImage,
  color,
  image,
  eliminated, name, description, investigator,
  transparent, yithian, open, detail, badge,
  leftContent, imageOffset, children, width, arkhamCardsImg,
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <RoundedFactionHeader
      transparent={transparent}
      eliminated={eliminated}
      faction={investigator?.factionCode() || 'neutral'}
      parallel={!!investigator?.alternate_of_code}
      fullRound={!open}
      width={width}
      color={color}
    >
      <View style={[styles.row, space.paddingLeftXs]}>
        { !!leftContent && <View style={space.paddingRightS}>{leftContent}</View>}
        { !hideImage && (
          <InvestigatorImage
            arkhamCardsImg={arkhamCardsImg}
            card={investigator}
            image={image}
            size="tiny"
            border
            yithian={yithian}
            killedOrInsane={eliminated}
            badge={badge}
            imageOffset={imageOffset}
          />
        ) }
        <View style={[space.paddingLeftXs, styles.textColumn]}>
          <Text
            style={[
              typography.cardName,
              !transparent ? typography.white : { color: colors.D20 }, eliminated ? typography.strike : undefined]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            { name || investigator?.name }
          </Text>
          { detail ?? (
            <Text
              style={[typography.cardTraits, !transparent ? typography.white : { color: colors.D20 }, eliminated ? typography.strike : undefined]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              { description !== undefined ? description : investigator?.subname }
            </Text>
          ) }
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
  const renderHeader = useCallback((icon: React.ReactNode) => (
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

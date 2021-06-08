import React, { useContext, useRef } from 'react';
import { Animated, Easing, Text, View, StyleSheet } from 'react-native';

import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import RoundedFactionHeader from '@components/core/RoundedFactionHeader';
import InvestigatorImage from '@components/core/InvestigatorImage';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import space from '@styles/space';
import AppIcon from '@icons/AppIcon';
import { useEffectUpdate } from './hooks';
import Collapsible from 'react-native-collapsible';

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
  description?: string;
  color?: 'dark' | 'light';
}
export default function CompactInvestigatorRow({ color, eliminated, description, investigator, transparent, yithian, open, upgradeBadge, leftContent, children, width }: Props) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <RoundedFactionHeader
      transparent={transparent}
      eliminated={eliminated}
      faction={investigator.factionCode()}
      fullRound={!open}
      width={width}
      color={color}
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
            { description !== undefined ? description : investigator.subname }
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
  const { colors } = useContext(StyleContext);
  const openAnim = useRef(new Animated.Value(open ? 1 : 0));
  useEffectUpdate(() => {
    Animated.timing(
      openAnim.current,
      {
        toValue: open ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
        easing: Easing.ease,
      }
    ).start();
  }, [open]);
  const iconRotate = openAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '-180deg'],
    extrapolate: 'clamp',
  });
  const content = (
    <CompactInvestigatorRow investigator={investigator} open={open} {...props}>
      { headerContent }
      { !disabled && (
        <Animated.View style={{ width: 36, height: 36, transform: [{ rotate: iconRotate }] }}>
          <AppIcon name="expand_less" size={36} color="#FFF" />
        </Animated.View>
      ) }
    </CompactInvestigatorRow>
  );
  return (
    <>
      { disabled ? content : (
        <TouchableWithoutFeedback onPress={toggleOpen}>
          { content }
        </TouchableWithoutFeedback>
      ) }
      <Collapsible collapsed={!open}>
        <View style={[
          styles.block,
          {
            borderColor: colors.faction[investigator.factionCode()].background,
            backgroundColor: colors.background,
          },
          space.paddingTopS,
        ]}>
          {children}
        </View>
      </Collapsible>
    </>
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
  block: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
});

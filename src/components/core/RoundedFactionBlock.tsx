import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { FactionCodeType } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import space, { s } from '@styles/space';
import CollapsibleFactionBlock from './CollapsibleFactionBlock';

interface Props {
  faction: FactionCodeType;
  header: React.ReactNode;
  color?: string;
  children: React.ReactNode | React.ReactNode[];
  footer?: React.ReactNode;
  noSpace?: boolean;
  noShadow?: boolean;
}

function RoundedFactionBlock({ header, footer, children, faction, noSpace, noShadow, color }: Props) {
  const { colors, shadow } = useContext(StyleContext);
  return (
    <View style={[
      styles.block,
      noShadow ? undefined : shadow.large,
      {
        borderColor: color || colors.faction[faction].background,
        backgroundColor: colors.background,
        paddingBottom: (noSpace || footer) ? 0 : s,
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

RoundedFactionBlock.computeHeight = (fontScale: number, noSpace: boolean, footer: boolean) => {
  return s + 2 + ((noSpace || footer) ? 0 : s);
}

export default RoundedFactionBlock;

interface AnimatedProps {
  faction: FactionCodeType;
  renderHeader: (toggle: React.ReactFragment) => React.ReactFragment;
  color?: string;
  children: React.ReactNode | React.ReactNode[];
  footer?: React.ReactChild;
  noSpace?: boolean;
  noShadow?: boolean;
  toggleOpen?: () => void;
  disabled?: boolean;
  open?: boolean;
  textColor?: string;
}


export function AnimatedRoundedFactionBlock({
  toggleOpen,
  renderHeader,
  children,
  disabled,
  color,
  faction,
  open,
  noSpace,
  noShadow,
  footer,
  textColor,
}: AnimatedProps) {
  return (
    <CollapsibleFactionBlock
      color={color}
      faction={faction}
      renderHeader={renderHeader}
      open={open}
      toggleOpen={toggleOpen}
      disabled={disabled}
      noShadow={noShadow}
      textColor={textColor}
    >
      <View style={(noSpace || footer) ? undefined : space.paddingBottomS}>
        <View style={noSpace ? undefined : space.marginSideS}>
          { children }
        </View>
        { !!footer && footer }
      </View>
    </CollapsibleFactionBlock>
  );
}


const styles = StyleSheet.create({
  block: {
    marginTop: s,
    borderRadius: 9,
    borderWidth: 1,
  },
});
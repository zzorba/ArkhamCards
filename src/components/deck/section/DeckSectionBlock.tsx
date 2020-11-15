import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { FactionCodeType } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import DeckSectionHeader from './DeckSectionHeader';
import space, { s } from '@styles/space';

interface Props {
  title: string;
  faction: FactionCodeType;
  onTitlePress?: () => void;
  children: React.ReactNode | React.ReactNode[];
  footerButton?: React.ReactNode;
}

export default function DeckSectionBlock({ title, onTitlePress, children, footerButton, faction }: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <View style={[
      styles.block,
      {
        borderColor: colors.faction[faction].background,
        backgroundColor: colors.background,
        paddingBottom: footerButton ? 0 : s,
      },
    ]}>
      <DeckSectionHeader onPress={onTitlePress} faction={faction} title={title} />
      <View style={space.marginSideS}>
        { children }
      </View>
      { !!footerButton && footerButton }
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: s,
    borderRadius: 9,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
  },
});

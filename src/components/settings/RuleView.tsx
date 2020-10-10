import React, { useCallback, useContext, useState} from 'react';
import { map } from 'lodash';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Rule from '@data/Rule';
import StyleContext from '@styles/StyleContext';
import CardFlavorTextComponent from '@components/card/CardFlavorTextComponent';
import CardTextComponent from '@components/card/CardTextComponent';
import { s, m } from '@styles/space';
import { NavigationProps } from '@components/nav/types';

export interface RuleViewProps {
  rule: Rule
}

function RuleComponent({ rule, level, noTitle }: { rule: Rule; level: number; noTitle?: boolean }) {
  console.log(rule.rules);
  return (
    <View style={{ paddingLeft: s + s * (level + 1), paddingRight: m }}>
      { !noTitle && <CardFlavorTextComponent text={`<game>${rule.title}</game>`} /> }
      { !!rule.text && <View style={{ width: '100%' }}><CardTextComponent text={rule.text} /></View>}
      { !!rule.table && <Text>{JSON.stringify(rule.table)}</Text>}
      { map(rule.rules || [], (rule, idx) => <RuleComponent key={idx} rule={rule} level={level + 1} />) }
    </View>
  );
}

type Props = RuleViewProps & NavigationProps;
export default function RuleView({ componentId, rule }: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  return (
    <ScrollView contentContainerStyle={backgroundStyle}>
      <RuleComponent rule={rule} level={0} noTitle />
    </ScrollView>
  )
}
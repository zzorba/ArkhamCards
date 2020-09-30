import React, { useCallback, useContext, useEffect, useState } from 'react';
import { flatMap, map } from 'lodash';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Rule } from '@data/scenario/types';
import StyleContext from '@styles/StyleContext';
import CardFlavorTextComponent from '@components/card/CardFlavorTextComponent';
import CardTextComponent from '@components/card/CardTextComponent';
import { s } from '@styles/space';

interface Props {
  componentId: string;
}

function RuleComponent({ rule, level }: { rule: Rule; level: number }) {
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = useCallback(() => setCollapsed(!collapsed), [collapsed]);
  const { typography } = useContext(StyleContext);
  return (
    <View style={{ paddingLeft: s * (level + 1)}}>
      <TouchableOpacity onPress={toggleCollapsed}>
        <CardFlavorTextComponent text={`<game>${rule.title}</game>`} />
      </TouchableOpacity>
      <Collapsible collapsed={collapsed}>
        { !!rule.text && <CardTextComponent text={rule.text} /> }
        { map(rule.rules || [], (rule, idx) => <RuleComponent key={idx} rule={rule} level={level + 1} />) }
      </Collapsible>
    </View>
  );
}

interface State {
  rules: Rule[];
}
export default function RulesView({ componentId }: Props) {
  const [rules, setRules] = useState([]);
  const { colors } = useContext(StyleContext);
  useEffect(() => setRules(require('../../../assets/rules.json')), [setRules]);
  return (
    <ScrollView>
      { !rules.length ? <ActivityIndicator size="small" animating color={colors.lightText} /> : (
        flatMap(rules, (rule, idx) => (
          rule ? <RuleComponent key={idx} rule={rule} level={0} /> : null
        ))
      )}
    </ScrollView>
  );
}
import React, { useCallback, useContext, useMemo } from 'react';
import { map, sortBy } from 'lodash';
import { ScrollView, View } from 'react-native';
import { Table, Row, Cell } from 'react-native-table-component';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';

import Rule, { RuleTableRow } from '@data/types/Rule';
import StyleContext from '@styles/StyleContext';
import CardFlavorTextComponent from '@components/card/CardFlavorTextComponent';
import CardTextComponent from '@components/card/CardTextComponent';
import { openUrl } from '@components/nav/helper';
import { s, m } from '@styles/space';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import { useSelector } from 'react-redux';
import { AppState, makeTabooSetSelector } from '@reducers';
import { BasicStackParamList } from '@navigation/types';
import RuleTitleComponent from './RuleTitleComponent';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { t } from 'ttag';

export interface RuleViewProps {
  rule: Rule
}

function RuleTable({ table }: { table: RuleTableRow[] }) {
  const { colors } = useContext(StyleContext);
  const specialColors: { [key: string]: string } = {
    green: colors.faction.rogue.lightBackground,
    red: colors.faction.survivor.lightBackground,
    grey: colors.faction.neutral.lightBackground,
  };

  return (
    <Table>
      { map(table, (row, idx) => {
        return (
          <Row
            key={idx}
            data={map(row.row, (cell, idx) => (
              <Cell
                key={idx}
                style={{ backgroundColor: cell.color && specialColors[cell.color], padding: s }}
                data={<CardTextComponent text={cell.text} />}
              />
            ))}
          />
        );
      }) }
    </Table>
  );
}

function RuleComponent({ rule, level, noTitle }: { rule: Rule; level: number; noTitle?: boolean }) {
  const navigation = useNavigation();
  const { db } = useContext(DatabaseContext);
  const { colors } = useContext(StyleContext);
  const tabooSetSelector = useMemo(makeTabooSetSelector, []);
  const tabooSetId = useSelector((state: AppState) => tabooSetSelector(state, undefined));
  const linkPressed = useCallback(
    (url: string) => {
      openUrl(navigation, url, db, colors, tabooSetId);
    }, [navigation, db, colors, tabooSetId]);
  const rules = useMemo(() => sortBy(rule.rules || [], rule => rule.order || 0), [rule.rules]);
  return (
    <>
      <View style={{ paddingLeft: m, paddingRight: m, paddingBottom: m }}>
        { !noTitle && <CardFlavorTextComponent text={`<game>${rule.title}</game>`} /> }
        { !!rule.text && <CardTextComponent text={rule.text} onLinkPress={linkPressed} />}
        { !!rule.table && <RuleTable table={rule.table} /> }
      </View>
      { map(rules, (rule, idx) => <RuleComponent key={idx} rule={rule} level={level + 1} />) }
    </>
  );
}

export default function RuleView() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Rule'>>();
  const { rule } = route.params;
  const { backgroundStyle } = useContext(StyleContext);
  return (
    <ScrollView contentContainerStyle={backgroundStyle}>
      <RuleComponent rule={rule} level={0} noTitle />
    </ScrollView>
  );
}

function options<T extends BasicStackParamList>({ route }: { route: RouteProp<T, 'Rule'> }): NativeStackNavigationOptions {
  return {
    headerTitle: () => (
      <RuleTitleComponent title={route.params?.rule.title ?? t`Rule`} />
    ),
  };
};
RuleView.options = options;

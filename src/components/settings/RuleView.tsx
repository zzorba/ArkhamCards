import React, { useCallback, useContext, useMemo } from 'react';
import { map } from 'lodash';
import { ScrollView, View } from 'react-native';
import { Table, Row, Cell } from 'react-native-table-component';

import Rule, { RuleTableRow } from '@data/types/Rule';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import CardFlavorTextComponent from '@components/card/CardFlavorTextComponent';
import CardTextComponent from '@components/card/CardTextComponent';
import { openUrl } from '@components/nav/helper';
import { s, m } from '@styles/space';
import { NavigationProps } from '@components/nav/types';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import { useSelector } from 'react-redux';
import { AppState, makeTabooSetSelector } from '@reducers';

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
              <Cell key={idx} style={{ backgroundColor: cell.color && specialColors[cell.color], padding: s }} data={<CardTextComponent text={cell.text} />} />
            ))}
          />
        );
      }) }
    </Table>
  );
}

function RuleComponent({ componentId, rule, level, noTitle }: { componentId: string; rule: Rule; level: number; noTitle?: boolean }) {
  const { db } = useContext(DatabaseContext);
  const tabooSetSelector = useMemo(makeTabooSetSelector, []);
  const tabooSetId = useSelector((state: AppState) => tabooSetSelector(state, undefined));
  const linkPressed = useCallback(
    (url: string, context: StyleContextType) => {
      openUrl(url, context, db, componentId, tabooSetId);
    }, [componentId, db, tabooSetId]);

  return (
    <>
      <View style={{ paddingLeft: m, paddingRight: m, paddingBottom: m }}>
        { !noTitle && <CardFlavorTextComponent text={`<game>${rule.title}</game>`} /> }
        { !!rule.text && <CardTextComponent text={rule.text} onLinkPress={linkPressed} />}
        { !!rule.table && <RuleTable table={rule.table} /> }
      </View>
      { map(rule.rules || [], (rule, idx) => <RuleComponent key={idx} componentId={componentId} rule={rule} level={level + 1} />) }
    </>
  );
}

type Props = RuleViewProps & NavigationProps;
export default function RuleView({ componentId, rule }: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  return (
    <ScrollView contentContainerStyle={backgroundStyle}>
      <RuleComponent componentId={componentId} rule={rule} level={0} noTitle />
    </ScrollView>
  );
}
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { map } from 'lodash';

import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { TableRow } from '@data/scenario/types';
import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  row: TableRow;
  background: 'header' | 'light' | 'dark';
  last?: boolean
}

const ROW_COLORS = {
  header: '#a0dba3',
  light: '#e3fce4',
  dark: '#c7ebc9',
};

export default function TableRowComponent({ row, background, last }: Props) {
  const { borderStyle } = useContext(StyleContext);
  return (
    <View style={styles.row}>
      { map(row.cells, (cell, idx) => (
        <View style={[
          styles.cell,
          borderStyle,
          {
            flex: cell.size,
            backgroundColor: ROW_COLORS[background],
          },
          cell.size === 1 ? { alignItems: 'center' } : {},
          cell.size === 2 ? { paddingLeft: s, paddingRight: s } : {},
          idx === row.cells.length - 1 ? { borderRightWidth: 2 } : {},
          last ? { borderBottomWidth: 2 } : {},
        ]} key={idx}>
          <CampaignGuideTextComponent text={cell.size === 1 ? cell.text : cell.text} />
        </View>
      )) }
    </View>
  );

}

const styles = StyleSheet.create({
  cell: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 0,
    justifyContent: 'center',
    padding: xs,
  },
  row: {
    flexDirection: 'row',
  },
});
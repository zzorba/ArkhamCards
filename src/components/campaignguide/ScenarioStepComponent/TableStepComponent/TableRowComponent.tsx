import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { map } from 'lodash';

import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { TableRow } from '@data/scenario/types';
import COLORS from '@styles/colors';
import { s, xs } from '@styles/space';

interface Props {
  row: TableRow;
  style: 'header' | 'light' | 'dark';
  last?: boolean
}

const ROW_COLORS = {
  header: '#a0dba3',
  light: '#e3fce4',
  dark: '#c7ebc9',
};

export default function TableRowComponent({ row, style, last }: Props) {
  return (
    <View style={styles.row}>
      { map(row.cells, (cell, idx) => (
        <View style={[
          styles.cell, 
          { 
            flex: cell.size,
            backgroundColor: ROW_COLORS[style],
          }, 
          cell.size === 1 ? { alignItems: 'center' } : {}, 
          cell.size === 2 ? { paddingLeft: s, paddingRight: s } : {},
          idx === row.cells.length - 1 ? { borderRightWidth: 2 } : {},
          last ? { borderBottomWidth: 2 }  : {},
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
    borderColor: COLORS.divider,
    justifyContent: 'center',
    padding: xs,
  },
  row: {
    flexDirection: 'row',    
  },
});
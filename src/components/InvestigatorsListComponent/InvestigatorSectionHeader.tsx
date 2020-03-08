import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from 'styles/colors';
import typography from 'styles/typography';
import { s, xs } from 'styles/space';

interface Props {
  title: string;
  bold?: boolean;
}

export default function InvestigatorSectionHeader({ title, bold }: Props) {
  return (
    <View style={[styles.row, bold ? styles.boldRow : {}]}>
      <Text style={[typography.text, styles.headerText]}>
        { title }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: xs,
    paddingBottom: xs,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  boldRow: {
    backgroundColor: '#ccc',
    borderColor: '#bdbdbd',
  },
  headerText: {
    marginLeft: s,
    color: COLORS.black,
  },
});

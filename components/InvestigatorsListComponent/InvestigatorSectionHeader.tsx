import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '../../styles/colors';
import typography from '../../styles/typography';

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
    height: 30,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  boldRow: {
    backgroundColor: '#ccc',
    borderColor: '#bdbdbd',
  },
  headerText: {
    marginLeft: 8,
    color: COLORS.black,
  },
});

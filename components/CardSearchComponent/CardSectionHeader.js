import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '../../styles/colors';
import typography from '../../styles/typography';
import { isBig } from '../../styles/space';

export const ROW_HEADER_HEIGHT = isBig ? 42 : 30;

export const ROW_HEADER_HEIGHT = 30;
export default function CardSectionHeader({ title, bold }) {
  return (
    <View style={[styles.row, bold ? styles.boldRow : {}]}>
      <Text style={[typography.text, styles.headerText]}>
        { title }
      </Text>
    </View>
  );
}

CardSectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  bold: PropTypes.bool,
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: ROW_HEADER_HEIGHT,
    borderTopWidth: 1,
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

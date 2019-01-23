import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '../../styles/colors';
import typography from '../../styles/typography';

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

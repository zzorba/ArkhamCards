import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '../../styles/colors';

export default function CardSectionHeader({ title }) {
  return (
    <View style={styles.row}>
      <Text style={styles.headerText}>
        { title }
      </Text>
    </View>
  );
}

CardSectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 24,
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
  },
  headerText: {
    marginLeft: 4,
    fontFamily: 'System',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black,
  },
});

import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
} from 'react-native';
import SearchInput from 'react-native-search-filter';

export default function SearchBox({ onChangeText, placeholder }) {
  return (
    <SearchInput
      style={styles.searchInput}
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  );
}

SearchBox.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  searchInput: {
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1,
  },
});

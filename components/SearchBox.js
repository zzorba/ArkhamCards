import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

export const SEARCH_BAR_HEIGHT = 58;
export default class SearchBox extends React.Component {
  static propTypes = {
    onChangeText: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    sideButton: PropTypes.node,
  };

  render() {
    const {
      onChangeText,
      placeholder,
      sideButton,
    } = this.props;

    return (
      <View style={[styles.container, !sideButton ? styles.underline : {}]}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            style={styles.searchInput}
            clearButtonMode="always"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={onChangeText}
            placeholder={placeholder}
          />
          { sideButton }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  underline: {
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  container: {
    backgroundColor: 'white',
    width: '100%',
  },
  searchInputWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    height: SEARCH_BAR_HEIGHT,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontFamily: 'System',
    fontSize: 18,
    color: '#111',
    backgroundColor: '#EEE',
    borderRadius: 10,
  },
});

import React from 'react';
import PropTypes from 'prop-types';
import { forEach } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import MultipleSelect from './MultipleSelect';

export default class SearchMultiSelect extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    values: PropTypes.array.isRequired,
    selection: PropTypes.array,
  };

  render() {
    const {
      placeholder,
      values,
      selection,
      onChange,
    } = this.props;
    const options = {};
    forEach(values, value => {
      options[value] = value;
    });
    return (
      <View style={styles.flex}>
        <MultipleSelect
          options={options}
          selected={selection}
          placeholder={placeholder}
          placeholderTextColor="#757575"
          returnValue="label"
          callback={onChange}
          rowBackgroundColor="#eee"
          rowHeight={40}
          rowRadius={5}
          iconColor="#00a2dd"
          iconSize={30}
          selectedIconName="checkbox-marked-circle-outline"
          unselectedIconName="circle-outline"
          scrollViewHeight="100%"
          search
          multiple
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: 'white',
  },
});

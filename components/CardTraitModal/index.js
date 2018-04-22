import React from 'react';
import PropTypes from 'prop-types';
import { forEach } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import MultipleSelect from '../core/MultipleSelect';

export default class TraitModal extends React.Component {
  static propTypes = {
    traits: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    selection: PropTypes.array,
  };

  render() {
    const {
      traits,
      selection,
      onChange,
    } = this.props;
    const options = {};
    forEach(traits, trait => {
      options[trait] = trait;
    });
    return (
      <View style={styles.flex}>
        <MultipleSelect
          options={options}
          selected={selection}
          placeholder="Search Traits"
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

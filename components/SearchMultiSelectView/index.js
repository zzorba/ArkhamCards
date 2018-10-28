import React from 'react';
import PropTypes from 'prop-types';
import { filter, map } from 'lodash';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  View,
} from 'react-native';

import L from '../../app/i18n';
import SearchBox from '../SearchBox';
import SelectRow from './SelectRow';

export default class SearchMultiSelectView extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    values: PropTypes.array.isRequired,
    selection: PropTypes.array,
  };

  static get options() {
    return {
      topBar: {
        backButton: {
          title: L('Back'),
        },
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      search: '',
      selection: props.selection,
    };

    this._syncSelection = this.syncSelection.bind(this);
    this._onChangeText = this.onChangeText.bind(this);
    this._onSelectChanged = this.onSelectChanged.bind(this);
    this._renderItem = this.renderItem.bind(this);
    this._keyExtractor = this.keyExtractor.bind(this);
  }

  syncSelection() {
    const {
      selection,
    } = this.state;
    this.props.onChange(selection);
  }

  onSelectChanged(value, selected) {
    const {
      selection,
    } = this.state;
    Keyboard.dismiss();
    const newSelection = selected ?
      [...selection, value] :
      filter(selection, v => v !== value);

    this.setState({
      selection: newSelection,
    }, this._syncSelection);
  }

  keyExtractor(item) {
    return item.value;
  }

  renderItem({ item }) {
    return (
      <SelectRow
        value={item.value}
        selected={item.selected}
        onSelectChanged={this._onSelectChanged}
      />
    );
  }

  onChangeText(text) {
    this.setState({
      search: text,
    });
  }

  getValues() {
    const {
      values,
    } = this.props;
    const {
      search,
    } = this.state;

    const lowerCaseSearch = search.toLowerCase();

    return filter(values, value =>
      search === '' || value.toLowerCase().includes(lowerCaseSearch));
  }

  render() {
    const {
      placeholder,
    } = this.props;
    const {
      selection,
    } = this.state;

    const selectedSet = new Set(selection);
    const values = this.getValues();
    const data = map(values, value => {
      return {
        value,
        selected: selectedSet.has(value),
      };
    });
    return (
      <View style={styles.flex}>
        <SearchBox
          onChangeText={this._onChangeText}
          placeholder={placeholder}
        />
        <FlatList
          data={data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
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

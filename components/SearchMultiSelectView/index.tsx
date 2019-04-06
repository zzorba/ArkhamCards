import React from 'react';
import PropTypes from 'prop-types';
import { filter, map } from 'lodash';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  View,
} from 'react-native';
import { Navigation, EventSubscription } from 'react-native-navigation';

import L from '../../app/i18n';
import SearchBox from '../SearchBox';
import SelectRow from './SelectRow';
import { COLORS } from '../../styles/colors';

interface Props {
  componentId: string;
  placeholder: string;
  onChange: (selection: string[]) => void;
  values: string[];
  selection?: string[];
}

interface State {
  search: string;
  selection: string[]
}

interface Item {
  value: string;
  selected: boolean;
}

export default class SearchMultiSelectView extends React.Component<Props, State> {
  _navEventListener?: EventSubscription;
  constructor(props: Props) {
    super(props);

    this.state = {
      search: '',
      selection: props.selection || [],
    };

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  _syncSelection = () => {
    const {
      selection,
    } = this.state;
    this.props.onChange(selection);
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: selection && selection.length > 0 ?
          [{
            text: L('Clear'),
            id: 'clear',
            color: COLORS.navButton,
          }] : [],
      },
    });
  };

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'clear') {
      this.setState({
        selection: [],
      }, this._syncSelection);
    }
  }

  _onSelectChanged = (value: string, selected: boolean) => {
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
  };

  _keyExtractor = (item: Item) => {
    return item.value;
  };

  _renderItem = ({ item }: { item: Item }) => {
    return (
      <SelectRow
        value={item.value}
        selected={item.selected}
        onSelectChanged={this._onSelectChanged}
      />
    );
  };

  _onChangeText = (text: string) => {
    this.setState({
      search: text,
    });
  };

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
      search,
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
          value={search}
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

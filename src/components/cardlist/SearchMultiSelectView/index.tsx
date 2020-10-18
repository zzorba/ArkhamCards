import React from 'react';
import { filter, map } from 'lodash';
import {
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import { NavigationProps } from '@components/nav/types';
import SelectRow from './SelectRow';
import COLORS from '@styles/colors';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';

export interface SearchSelectProps {
  placeholder: string;
  onChange: (selection: string[]) => void;
  values: string[];
  selection?: string[];
  capitalize?: boolean;
}

type Props = NavigationProps & SearchSelectProps;

interface State {
  search: string;
  selection: string[];
}

interface Item {
  value: string;
  selected: boolean;
}

export default class SearchMultiSelectView extends React.Component<Props, State> {
  static contextType = StyleContext;
  context!: StyleContextType;

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
            text: t`Clear`,
            id: 'clear',
            color: COLORS.M,
            accessibilityLabel: t`Clear`,
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
    const { capitalize } = this.props;
    return (
      <SelectRow
        value={item.value}
        selected={item.selected}
        onSelectChanged={this._onSelectChanged}
        capitalize={capitalize}
      />
    );
  };

  _onChangeText = (text: string) => {
    this.setState({
      search: text,
    });
  };

  getValues(): string[] {
    const {
      values,
    } = this.props;
    const {
      search,
    } = this.state;
    if (!search) {
      return values;
    }
    const lowerCaseSearch = search.toLowerCase();
    return filter(values, value =>
      search === '' || (!!value && value.toLowerCase().includes(lowerCaseSearch)));
  }

  _renderHeader = () => {
    if (Platform.OS === 'android') {
      return <View style={styles.searchBarPadding} />;
    }
    return null;
  };

  render() {
    const {
      placeholder,
    } = this.props;
    const {
      selection,
      search,
    } = this.state;
    const { backgroundStyle } = this.context;

    const selectedSet = new Set(selection);
    const values = this.getValues();
    const data = map(values, value => {
      return {
        value,
        selected: selectedSet.has(value),
      };
    });
    return (
      <CollapsibleSearchBox
        prompt={placeholder}
        searchTerm={search}
        onSearchChange={this._onChangeText}
      >
        { onScroll => (
          <FlatList
            contentInset={Platform.OS === 'ios' ? { top: SEARCH_BAR_HEIGHT } : undefined}
            contentOffset={Platform.OS === 'ios' ? { x: 0, y: -SEARCH_BAR_HEIGHT } : undefined}
            contentContainerStyle={backgroundStyle}
            data={data}
            onScroll={onScroll}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            ListHeaderComponent={this._renderHeader}
          />
        ) }
      </CollapsibleSearchBox>
    );
  }
}

const styles = StyleSheet.create({
  searchBarPadding: {
    height: SEARCH_BAR_HEIGHT,
  },
});

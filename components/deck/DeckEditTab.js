import React from 'react';
const {
  StyleSheet,
  View,
  Text,
} = require('react-native');
import SearchInput from 'react-native-search-filter';

export default class DeckEditTab extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
    };

    this._searchUpdated = this.searchUpdated.bind(this);
  }

  searchUpdated(term) {
    this.setState({
      searchTerm: term,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchInput
          onChangeText={this._searchUpdated}
          style={styles.searchInput}
          placeholder="Search for a card"
        />
        <Text>{ this.state.searchTerm }</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  searchInput: {
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1,
  },
});

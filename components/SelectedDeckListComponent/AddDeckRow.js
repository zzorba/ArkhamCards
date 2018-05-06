import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

export default class AddDeckRow extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    deckAdded: PropTypes.func.isRequired,
    selectedDeckIds: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this._showDeckSelector = this.showDeckSelector.bind(this);
    this._onDeckSelect = this.onDeckSelect.bind(this);
  }

  onDeckSelect(id) {
    const {
      navigator,
      deckAdded,
    } = this.props;
    deckAdded(id);
    navigator.pop();
  }

  showDeckSelector() {
    const {
      navigator,
      selectedDeckIds,
    } = this.props;
    navigator.push({
      screen: 'Dialog.DeckSelector',
      passProps: {
        onDeckSelect: this._onDeckSelect,
        selectedDeckIds: selectedDeckIds,
      },
    });
  }

  render() {
    return (
      <TouchableOpacity onPress={this._showDeckSelector}>
        <View style={styles.row}>
          <MaterialCommunityIcons name="plus-box-outline" size={80} color="#444" />
          <Text style={styles.text}>Add Another</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    position: 'relative',
    height: 100,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#000000',
    paddingLeft: 8,
    paddingRight: 8,
  },
  text: {
    fontSize: 36,
  },
});

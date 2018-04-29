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
  }

  showDeckSelector() {
    const {
      navigator,
      deckAdded,
      selectedDeckIds,
    } = this.props;
    navigator.push({
      screen: 'Dialog.DeckSelector',
      passProps: {
        onDeckSelect: deckAdded,
        selectedDeckIds: selectedDeckIds,
      },
    });
  }

  render() {
    return (
      <TouchableOpacity onPress={this._showDeckSelector}>
        <View style={styles.row}>
          <MaterialCommunityIcons name="plus-box-outline" size={80} color="#444" />
          <Text style={styles.text}>Add</Text>
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
  },
  text: {
    fontSize: 36,
  },
});

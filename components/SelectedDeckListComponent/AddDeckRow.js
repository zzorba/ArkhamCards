import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import typography from '../../styles/typography';

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
      selectedDeckIds,
      deckAdded,
    } = this.props;
    navigator.showModal({
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
          <MaterialCommunityIcons
            name="plus-box-outline"
            size={80}
            color="#444"
          />
          <View style={styles.column}>
            <Text style={styles.text}>
              Add Another
            </Text>
            <Text style={typography.small}>
              Investigators can be added later
            </Text>
          </View>
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
  column: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 36,
  },
});

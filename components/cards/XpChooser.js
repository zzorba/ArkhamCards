import React from 'react';
import PropTypes from 'prop-types';
import { filter, flatMap, map, values } from 'lodash';
const {
  StyleSheet,
  Text,
} = require('react-native');
import { ButtonGroup } from 'react-native-elements';

const BUTTONS = ['0 XP', '2+ XP'];
const XP_LEVELS = [[0], [1, 2, 3, 4, 5]];
export default class XpChooser extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };
  constructor () {
    super()
    this.state = {
      selectedIndexes: [],
    }
    this._updateIndex = this.updateIndex.bind(this)
  }

  updateIndex(indexes) {
    this.setState({
      selectedIndexes: indexes,
    });
    const selection = flatMap(indexes, idx => XP_LEVELS[idx]);
    console.log(selection);
    this.props.onChange(selection);
  }

  render () {
    const {
      selectedIndexes,
    } = this.state
    return (
      <ButtonGroup
        onPress={this._updateIndex}
        selectedIndexes={selectedIndexes}
        buttons={BUTTONS}
        textStyle={styles.text}
        selectedTextStyle={styles.selectedText}
        buttonStyle={styles.button}
        selectedButtonStyle={styles.selectedButton}
        containerStyle={styles.container}
        selectMultiple
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: '30%',
  },
  text: {
    color: '#bdbdbd',
  },
  button: {
    backgroundColor: '#eeeeee',
  },
  selectedText: {
    color: '#000000',
  },
  selectedButton: {
    backgroundColor: '#FFFFFF',
  },
});

import React from 'react';
import PropTypes from 'prop-types';
import { flatMap } from 'lodash';
const {
  StyleSheet,
} = require('react-native');
import { ButtonGroup } from 'react-native-elements';

const BUTTONS = ['Assets', 'Events', 'Skills'];
const TYPE_CODES = ['asset', 'event', 'skill'];
export default class TypeChooser extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIndexes: [],
    };
    this._updateIndex = this.updateIndex.bind(this);
  }

  updateIndex(indexes) {
    this.setState({
      selectedIndexes: indexes,
    });
    const selection = flatMap(indexes, idx => TYPE_CODES[idx]);
    this.props.onChange(selection);
  }

  render() {
    const {
      selectedIndexes,
    } = this.state;
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: '60%',
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

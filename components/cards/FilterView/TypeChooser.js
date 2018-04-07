import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  StyleSheet,
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';

const BUTTONS = ['Assets', 'Events', 'Skills'];
const TYPE_CODES = ['asset', 'event', 'skill'];

export default class TypeChooser extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    selection: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this._updateIndex = this.updateIndex.bind(this);

  }

  updateIndex(indexes) {
    const selection = map(indexes, idx => TYPE_CODES[idx]);
    this.props.onChange(selection);
  }

  render() {
    const {
      selection,
    } = this.props;
    const selectedIndexes = map(selection, type => TYPE_CODES.indexOf(type));
    return (
      <ButtonGroup
        onPress={this._updateIndex}
        selectedIndexes={selectedIndexes}
        buttons={BUTTONS}
        textStyle={styles.text}
        selectedTextStyle={styles.text}
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
    color: 'rgb(41,41,41)',
  },
  button: {
    backgroundColor: 'rgb(246,246,246)',
  },
  selectedButton: {
    backgroundColor: 'rgb(221,221,221)',
  },
});

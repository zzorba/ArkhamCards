import React from 'react';
import PropTypes from 'prop-types';
import { flatMap } from 'lodash';
import {
  StyleSheet,
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';

const BUTTONS = ['0 XP', '1+ XP'];
const XP_LEVELS = [[0], [1, 2, 3, 4, 5]];

export default class XpChooser extends React.Component {
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
    const selection = flatMap(indexes, idx => XP_LEVELS[idx]);
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
    width: '30%',
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

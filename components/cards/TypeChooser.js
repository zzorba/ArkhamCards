import React from 'react';
import PropTypes from 'prop-types';
import { filter, map, values } from 'lodash';
const {
  StyleSheet,
  Text,
} = require('react-native');
import { ButtonGroup } from 'react-native-elements';

export default class TypeChooser extends React.Component {
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
  }

  render () {
    const buttons = ['Assets', 'Events', 'Skills'];
    const {
      selectedIndexes,
    } = this.state
    return (
      <ButtonGroup
        onPress={this._updateIndex}
        selectedIndexes={selectedIndexes}
        buttons={buttons}
        textStyle={{ color: '#bdbdbd' }}
        selectedTextStyle={{ color: '#000000' }}
        buttonStyle={{ backgroundColor: '#eeeeee' }}
        selectedButtonStyle={{ backgroundColor: '#FFFFFF' }}
        containerStyle={{height: 40}}
        selectMultiple
      />
    )
  }
}

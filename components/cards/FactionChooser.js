import React from 'react';
import PropTypes from 'prop-types';
import { filter, flatMap, map, values } from 'lodash';
const {
  StyleSheet,
  Text,
} = require('react-native');
import { ButtonGroup } from 'react-native-elements';

import ArkhamIcon from '../../assets/ArkhamIcon';
import { FACTION_CODES, FACTION_COLORS } from '../../constants';

export default class FactionChooser extends React.Component {
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
    const selection = flatMap(indexes, idx => FACTION_CODES[idx].toLowerCase());
    this.props.onChange(selection);
  }

  render () {
    const {
      selectedIndexes,
    } = this.state;

    const buttons = map(FACTION_CODES, (faction, idx) => {
      const iconName = faction === 'neutral' ? 'elder_sign' : faction;
      const selected = selectedIndexes.indexOf(idx) !== -1 ;
      return {
        element: () => <ArkhamIcon
          name={iconName}
          size={28}
          color={ selected ? FACTION_COLORS[faction] : '#bdbdbd'} />,
      };
    });
    return (
      <ButtonGroup
        onPress={this._updateIndex}
        selectedIndexes={selectedIndexes}
        buttons={buttons}
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
  },
  button: {
    backgroundColor: '#eeeeee',
  },
  selectedButton: {
    backgroundColor: '#FFFFFF',
  },
});

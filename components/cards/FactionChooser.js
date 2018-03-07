import React from 'react';
import PropTypes from 'prop-types';
import { filter, map, values } from 'lodash';
const {
  StyleSheet,
  Text,
} = require('react-native');
import { ButtonGroup } from 'react-native-elements';

import ArkhamIcon from '../../assets/ArkhamIcon';
import { FACTION_CODES, FACTION_COLORS } from '../../constants';

export default class FactionChooser extends React.Component {
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
        buttonStyle={{ backgroundColor: '#eeeeee' }}
        selectedButtonStyle={{ backgroundColor: '#FFFFFF' }}
        containerStyle={{height: 40}}
        selectMultiple
      />
    )
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, map } from 'lodash';
const {
  StyleSheet,
} = require('react-native');
import { ButtonGroup } from 'react-native-elements';

import ArkhamIcon from '../../../assets/ArkhamIcon';
import { FACTION_COLORS } from '../../../constants';

function factionToIconName(faction) {
  if (faction === 'neutral') {
    return 'elder_sign';
  }
  if (faction === 'mythos') {
    return 'auto_fail';
  }
  return faction;
}

export default class FactionChooser extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    factions: PropTypes.array.isRequired,
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
    const selection = flatMap(indexes, idx =>
      this.props.factions[idx].toLowerCase());
    this.props.onChange(selection);
  }

  render() {
    const {
      selectedIndexes,
    } = this.state;

    const buttons = map(this.props.factions, (faction, idx) => {
      const selected = selectedIndexes.indexOf(idx) !== -1;
      return {
        element: () => (
          <ArkhamIcon
            name={factionToIconName(faction)}
            size={28}
            color={selected ? FACTION_COLORS[faction] : '#bdbdbd'}
          />
        ),
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
  },
  button: {
    backgroundColor: 'rgb(246,246,246)',
  },
  selectedButton: {
    backgroundColor: 'rgb(221,221,221)',
  },
});

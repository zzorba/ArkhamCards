import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, map } from 'lodash';
import {
  StyleSheet,
} from 'react-native';
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
    onFilterChange: PropTypes.func.isRequired,
    factions: PropTypes.array.isRequired,
    selection: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this._updateIndex = this.updateIndex.bind(this);
  }

  updateIndex(indexes) {
    const {
      factions,
      onFilterChange,
    } = this.props;
    const selection = flatMap(indexes, idx => factions[idx].toLowerCase());
    onFilterChange('factions', selection);
  }

  render() {
    const {
      factions,
      selection,
    } = this.props;

    if (factions.length <= 1) {
      return null;
    }

    const selectedIndexes = [];
    const buttons = map(factions, (faction, idx) => {
      const selected = selection.indexOf(faction) !== -1;
      if (selected) {
        selectedIndexes.push(idx);
      }
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

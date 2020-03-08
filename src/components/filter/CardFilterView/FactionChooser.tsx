import React from 'react';
import { flatMap, map } from 'lodash';
import {
  StyleSheet,
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';

import ArkhamIcon from 'icons/ArkhamIcon';
import { FACTION_COLORS, FactionCodeType } from 'constants';

function factionToIconName(faction: FactionCodeType) {
  if (faction === 'neutral') {
    return 'elder_sign';
  }
  if (faction === 'mythos') {
    return 'auto_fail';
  }
  return faction;
}

interface Props {
  onFilterChange: (setting: string, value: any) => void;
  factions: FactionCodeType[];
  selection: FactionCodeType[];
}

export default class FactionChooser extends React.Component<Props> {
  _updateIndex = (indexes: number[]) => {
    const {
      factions,
      onFilterChange,
    } = this.props;
    const selection = flatMap(indexes, idx => factions[idx].toLowerCase());
    onFilterChange('factions', selection);
  };

  render() {
    const {
      factions,
      selection,
    } = this.props;

    if (factions.length <= 1) {
      return null;
    }

    const selectedIndexes: number[] = [];
    const buttons = map(factions, (faction, idx) => {
      const selected = selection.indexOf(faction) !== -1;
      if (selected) {
        selectedIndexes.push(idx);
      }
      return {
        element: () => {
          const iconName = factionToIconName(faction);
          return (
            <ArkhamIcon
              name={iconName}
              size={iconName !== faction ? 28 : 32}
              color={selected ? FACTION_COLORS[faction] : '#bdbdbd'}
            />
          );
        },
      };
    });
    return (
      <ButtonGroup
        // @ts-ignore
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

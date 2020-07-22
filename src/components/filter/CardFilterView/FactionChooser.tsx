import React from 'react';
import { flatMap, map } from 'lodash';
import {
  StyleSheet,
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';

import ArkhamIcon from '@icons/ArkhamIcon';
import { FactionCodeType } from '@app_constants';
import COLORS from '@styles/colors';

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
              color={selected ? COLORS.faction[faction].text : '#bdbdbd'}
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
    backgroundColor: COLORS.toggleButton,
  },
  selectedButton: {
    backgroundColor: COLORS.selectedToggleButton,
  },
});

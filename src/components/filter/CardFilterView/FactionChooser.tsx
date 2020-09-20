import React from 'react';
import { flatMap, map } from 'lodash';
import { StyleSheet, View } from 'react-native';

import ArkhamButtonGroup from '@components/core/ArkhamButtonGroup';
import ArkhamIcon from '@icons/ArkhamIcon';
import { FactionCodeType } from '@app_constants';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

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
  static contextType = StyleContext;
  context!: StyleContextType;

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
    const { colors } = this.context;
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
        element: (selected: boolean) => {
          const iconName = factionToIconName(faction);
          return (
            <View style={[styles.icon, (faction === 'mythos' || faction === 'neutral') ? { height: 28 } : {}]}>
              <ArkhamIcon
                name={iconName}
                size={iconName !== faction ? 28 : 32}
                color={selected ? colors.faction[faction].text : colors.L10}
              />
            </View>
          );
        },
      };
    });
    return (
      <ArkhamButtonGroup
        onPress={this._updateIndex}
        selectedIndexes={selectedIndexes}
        buttons={buttons}
      />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 36,
  },
});

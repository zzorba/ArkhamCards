import React, { useCallback, useContext } from 'react';
import { flatMap, map } from 'lodash';
import { StyleSheet, View } from 'react-native';

import ArkhamButtonGroup from '@components/core/ArkhamButtonGroup';
import ArkhamIcon from '@icons/ArkhamIcon';
import { FactionCodeType } from '@app_constants';
import StyleContext from '@styles/StyleContext';

function factionToIconName(faction: FactionCodeType) {
  if (faction === 'mythos') {
    return 'auto_fail';
  }
  return faction;
}

function factionSize(faction: FactionCodeType) {
  if (faction === 'mythos') {
    return 28;
  }
  if (faction === 'neutral') {
    return 30;
  }
  return 32;
}

interface Props {
  onFilterChange: (setting: string, value: any) => void;
  factions: FactionCodeType[];
  selection: FactionCodeType[];
}

export default function FactionChooser({ onFilterChange, factions, selection }: Props) {
  const { colors } = useContext(StyleContext);
  const updateIndex = useCallback((indexes: number[]) => {
    const selection = flatMap(indexes, idx => factions[idx].toLowerCase());
    onFilterChange('factions', selection);
  }, [factions, onFilterChange]);

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
          <View key={faction} style={[styles.icon, (faction === 'mythos') ? { height: 28 } : {}, faction === 'neutral' ? { paddingTop: 3 } : undefined]}>
            <ArkhamIcon
              name={iconName}
              size={factionSize(faction)}
              color={selected ? colors.faction[faction].text : colors.M}
            />
          </View>
        );
      },
    };
  });
  return (
    <ArkhamButtonGroup
      onPress={updateIndex}
      selectedIndexes={selectedIndexes}
      buttons={buttons}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 36,
  },
});

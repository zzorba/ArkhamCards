import React, { useCallback, useContext, useMemo } from 'react';
import { flatMap, find, map } from 'lodash';
import { StyleSheet, View } from 'react-native';

import ArkhamButtonGroup from '@components/core/ArkhamButtonGroup';
import ArkhamIcon from '@icons/ArkhamIcon';
import { FactionCodeType } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';

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
  multiClass: boolean;
  selection: FactionCodeType[];
  componentId: string;
}

const SUPPORT_MULTI_CLASS = true;

const PLAYER_FACTIONS = new Set<FactionCodeType>(['guardian', 'seeker', 'rogue', 'mystic', 'survivor']);

export default function FactionChooser({ onFilterChange, factions, multiClass, selection, componentId }: Props) {
  const { colors } = useContext(StyleContext);
  const fullFactions: (FactionCodeType | 'multiClass')[] = useMemo(() => {
    if (SUPPORT_MULTI_CLASS && factions.find(f => PLAYER_FACTIONS.has(f)) && factions.find(f => f === 'neutral')) {
      return flatMap(factions, f => {
        if (f === 'neutral') {
          return ['multiClass', f];
        }
        return f;
      });
    }
    return factions;
  }, [factions])
  const updateIndex = useCallback((indexes: number[]) => {
    const selection = flatMap(indexes, idx => {
      if (fullFactions[idx] === 'multiClass') {
        return [];
      }
      return fullFactions[idx].toLowerCase();
    });
    onFilterChange('factions', selection);
    if (SUPPORT_MULTI_CLASS) {
      const multiClass = !!find(indexes, idx => fullFactions[idx] === 'multiClass');
      onFilterChange('multiClass', multiClass);
    }
  }, [fullFactions, onFilterChange]);

  const [selectedIndexes, buttons] = useMemo(() => {
    const selectedIndexes: number[] = [];
    const buttons = map(fullFactions, (faction, idx) => {
      if (faction === 'multiClass') {
        if (multiClass) {
          selectedIndexes.push(idx);
        }
        return {
          element: (selected: boolean) => {
            return (
              <View key={faction} style={styles.icon}>
                <AppIcon
                  name="multiclass"
                  size={36}
                  color={selected ? colors.faction.dual.text : colors.M}
                />
              </View>
            );
          },
        };
      }
      const selected = selection.indexOf(faction) !== -1;
      if (selected) {
        selectedIndexes.push(idx);
      }
      return {
        element: (selected: boolean) => {
          const iconName = factionToIconName(faction);
          return (
            <View key={faction} style={[
              styles.icon,
              (faction === 'mythos') ? { height: 28 } : undefined,
              faction === 'neutral' ? { paddingTop: 3 } : undefined,
            ]}>
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
    return [selectedIndexes, buttons];
  }, [colors, multiClass, selection, fullFactions]);

  if (fullFactions.length <= 1) {
    return null;
  }
  return (
    <ArkhamButtonGroup
      onPress={updateIndex}
      selectedIndexes={selectedIndexes}
      buttons={buttons}
      componentId={componentId}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 36,
  },
});

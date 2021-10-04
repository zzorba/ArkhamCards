import React, { useCallback, useContext, useMemo } from 'react';
import { flatMap, map, max, min } from 'lodash';
import {
  Text,
} from 'react-native';
import { t } from 'ttag';

import ArkhamButtonGroup from '@components/core/ArkhamButtonGroup';
import StyleContext from '@styles/StyleContext';

interface Props {
  onFilterChange: (setting: string, value: any) => void;
  onToggleChange: (setting: string, value: boolean) => void;
  maxLevel: number;
  levels: [number, number];
  enabled: boolean;
  exceptional: boolean;
  nonExceptional: boolean;
}

export default function XpChooser({
  onFilterChange,
  onToggleChange,
  maxLevel,
  levels,
  enabled,
  exceptional,
  nonExceptional,
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  const levelRanges = useMemo(() => {
    const result = [[0, 0]];
    if (maxLevel > 0) {
      result.push([1, maxLevel]);
    }
    return result;
  }, [maxLevel]);
  const selectedIndexes = useMemo(() => flatMap(levelRanges, (xyz, idx) => {
    if (enabled &&
        xyz[0] >= levels[0] && xyz[0] <= levels[1] &&
        xyz[1] >= levels[0] && xyz[1] <= levels[1]) {
      return [idx];
    }
    return [];
  }), [levelRanges, enabled, levels]);
  const buttons = useMemo(() => map(levelRanges, xyz => {
    const startXp = xyz[0];
    const endXp = xyz[1];
    const xp = startXp === endXp ?
      t`Level ${startXp}` :
      t`Level ${startXp} - ${endXp}`;
    return {
      element: () => (
        <Text style={[typography.small, { color: colors.D30 }]}>
          { xp }
        </Text>
      ),
    };
  }), [levelRanges, colors, typography]);
  const updateIndex = useCallback((indexes: number[]) => {
    const selection = flatMap(indexes, idx => levelRanges[idx]);
    const level = indexes.length > 0 ? [min(selection), max(selection)] : [0, maxLevel];
    onFilterChange('level', level);
    if (indexes.length > 0) {
      if (!enabled) {
        onToggleChange('levelEnabled', true);
      }
    } else {
      if (enabled && !exceptional && !nonExceptional) {
        onToggleChange('levelEnabled', false);
      }
    }
  }, [onFilterChange, onToggleChange, maxLevel, enabled, exceptional, nonExceptional, levelRanges]);

  if (maxLevel <= 1) {
    return null;
  }

  return (
    <ArkhamButtonGroup
      onPress={updateIndex}
      selectedIndexes={selectedIndexes}
      buttons={buttons}
    />
  );
}

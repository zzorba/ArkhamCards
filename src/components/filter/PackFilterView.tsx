import React, { useCallback, useContext, useMemo } from 'react';
import { difference, forEach, find, filter, map, union } from 'lodash';
import {
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { t } from 'ttag';

import PackListComponent from '@components/core/PackListComponent';
import { getAllPacks } from '@reducers';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import useFilterFunctions, { FilterFunctionProps } from './useFilterFunctions';
import { NavigationProps } from '@components/nav/types';

const PackFilterView = (props: FilterFunctionProps & NavigationProps) => {
  const {
    filters,
    onFilterChange,
  } = useFilterFunctions(props, {
    title: t`Pack Filters`,
  });
  const { packs } = filters;
  const allPacks = useSelector(getAllPacks);
  const setChecked = useCallback((code: string, value: boolean) => {
    const deltaPacks = map(
      filter(allPacks, pack => pack.code === code),
      pack => pack.name
    );
    onFilterChange(
      'packs',
      value ? union(packs, deltaPacks) : difference(packs, deltaPacks)
    );
  }, [packs, onFilterChange, allPacks]);

  const setCycleChecked = useCallback((cycle_code: string, value: boolean) => {
    const cyclePack = find(allPacks, pack => pack.code == cycle_code);
    if (cyclePack) {
      const deltaPacks = map(
        filter(allPacks, pack => pack.cycle_position === cyclePack.cycle_position),
        pack => pack.name
      );

      onFilterChange(
        'packs',
        value ? union(packs, deltaPacks) : difference(packs, deltaPacks)
      );
    }
  }, [onFilterChange, packs, allPacks]);
  const { typography } = useContext(StyleContext);
  const selected = useMemo(() => {
    const selectedPackNames = new Set(packs || []);
    const result: { [pack_code: string]: boolean } = {};
    forEach(allPacks, pack => {
      if (selectedPackNames.has(pack.name)) {
        result[pack.code] = true;
      }
    });
    return result;
  }, [allPacks, packs]);

  if (!allPacks.length) {
    return (
      <View>
        <Text style={typography.text}>{t`Loading`}</Text>
      </View>
    );
  }
  return (
    <PackListComponent
      coreSetName={t`Core Set`}
      componentId={props.componentId}
      packs={allPacks}
      checkState={selected}
      setChecked={setChecked}
      setCycleChecked={setCycleChecked}
    />
  );
};
PackFilterView.options = () => {
  return {
    topBar: {
      backButton: {
        title: t`Back`,
        color: COLORS.M,
      },
      title: {
        text: t`Select Packs`,
      },
    },
  };
};
export default PackFilterView;

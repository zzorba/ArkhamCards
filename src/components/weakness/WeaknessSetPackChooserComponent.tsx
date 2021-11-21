import React, { useEffect, useMemo } from 'react';
import { filter, forEach, map, uniqBy, sortBy } from 'lodash';
import { useSelector } from 'react-redux';

import PackListComponent from '@components/core/PackListComponent';
import { BASIC_WEAKNESS_QUERY } from '@data/sqlite/query';
import { getPacksInCollection, AppState } from '@reducers';
import { useToggles, useWeaknessCards } from '@components/core/hooks';

export function ControlledWeaknessSetPackChooserComponent({
  componentId,
  onPackCheck,
  compact,
  selected,
}: {
  componentId: string;
  selected: { [pack: string]: boolean | undefined };
  compact?: boolean;
  onPackCheck: (pack: string, checked: boolean) => void;
}) {
  const packs = useSelector((state: AppState) => state.packs.all);
  const weaknessCards = useWeaknessCards();
  const weaknessPacks = useMemo(() => {
    const weaknessPackSet = new Set(
      uniqBy(
        map(weaknessCards || [], card => card.pack_code),
        code => code
      ));
    return sortBy(filter(packs, pack => weaknessPackSet.has(pack.code)), pack => pack.cycle_position);
  }, [packs, weaknessCards]);
  return (
    <PackListComponent
      componentId={componentId}
      packs={weaknessPacks}
      checkState={selected}
      setChecked={onPackCheck}
      baseQuery={BASIC_WEAKNESS_QUERY}
      compact={compact}
      noFlatList
    />
  );
}

interface OwnProps {
  componentId: string;
  onSelectedPacksChanged: (packs: string[]) => void;
  compact?: boolean;
}

export default function WeaknessSetPackChooserComponent({
  componentId,
  onSelectedPacksChanged,
  compact,
}: OwnProps) {
  const [override, , onPackCheck] = useToggles({ core: true });
  const packs = useSelector((state: AppState) => state.packs.all);
  const all_packs = useMemo(() => {
    const result: { [key: string]: boolean } = {};
    forEach(packs, p => {
      result[p.code] = true;
    });
    return result;
  }, [packs]);
  const in_collection = useSelector(getPacksInCollection);
  const ignore_collection = useSelector((state: AppState) => !!state.settings.ignore_collection);
  const weaknessCards = useWeaknessCards();
  const weaknessPacks = useMemo(() => {
    const weaknessPackSet = new Set(
      uniqBy(
        map(weaknessCards || [], card => card.pack_code),
        code => code
      ));
    return sortBy(filter(packs, pack => weaknessPackSet.has(pack.code)), pack => pack.cycle_position);
  }, [packs, weaknessCards]);

  const checkState = useMemo(() => {
    const checks: { [key: string]: boolean } = {
      ...(ignore_collection ? all_packs : in_collection),
    };
    forEach(override, (value, key) => {
      checks[key] = !!value;
    });
    return checks;
  }, [in_collection, ignore_collection, all_packs, override]);

  useEffect(() => {
    const packs: string[] = [];
    forEach(weaknessPacks, pack => {
      if (checkState[pack.code]) {
        packs.push(pack.code);
      }
    });
    onSelectedPacksChanged(packs);
  }, [checkState, onSelectedPacksChanged, weaknessPacks]);

  return (
    <ControlledWeaknessSetPackChooserComponent
      componentId={componentId}
      selected={checkState}
      onPackCheck={onPackCheck}
      compact={compact}
    />
  );
}

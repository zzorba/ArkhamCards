import React, { useEffect, useMemo } from 'react';
import { filter, forEach, map, uniqBy } from 'lodash';
import { useSelector } from 'react-redux';

import PackListComponent from '@components/core/PackListComponent';
import { BASIC_WEAKNESS_QUERY } from '@data/sqlite/query';
import { getPacksInCollection, AppState } from '@reducers';
import { useToggles, useWeaknessCards } from '@components/core/hooks';

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
    return filter(packs, pack => weaknessPackSet.has(pack.code));
  }, [packs, weaknessCards]);

  useEffect(() => {
    const includePack = { ...(ignore_collection ? all_packs : in_collection), ...override };
    const packs: string[] = [];
    forEach(weaknessPacks, pack => {
      if (includePack[pack.code]) {
        packs.push(pack.code);
      }
    });
    onSelectedPacksChanged(packs);
  }, [override, all_packs, in_collection, ignore_collection, onSelectedPacksChanged, weaknessPacks]);

  const checkState = useMemo(() => {
    const checks: { [key: string]: boolean } = {
      ...(ignore_collection ? all_packs : in_collection),
    };
    forEach(override, (value, key) => {
      checks[key] = !!value;
    });
    return checks;
  }, [in_collection, ignore_collection, all_packs, override]);

  return (
    <PackListComponent
      componentId={componentId}
      packs={weaknessPacks}
      checkState={checkState}
      setChecked={onPackCheck}
      baseQuery={BASIC_WEAKNESS_QUERY}
      compact={compact}
      noFlatList
    />
  );
}

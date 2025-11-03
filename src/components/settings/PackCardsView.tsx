import React, { useCallback } from 'react';
import { Brackets } from 'typeorm/browser';

import CardSearchComponent from '../cardlist/CardSearchComponent';
import { combineQueries, where } from '@data/sqlite/query';
import { SORT_BY_PACK } from '@actions/types';
import FilterBuilder from '@lib/filters';
import { BasicStackParamList } from '@navigation/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { t } from 'ttag';

export interface PackCardsProps {
  pack_code: string;
  pack_name?: string;
  baseQuery?: Brackets;
}

export default function PackCardsView() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Pack'>>();
  const { pack_code, baseQuery } = route.params;
  const query = useCallback(() => {
    const filters = new FilterBuilder('packs');
    return combineQueries(
      where(`(c.hidden is null OR not c.hidden)`),
      [
        ...filters.packCodes([pack_code]),
        ...(baseQuery ? [baseQuery] : []),
      ],
      'and'
    );
  }, [pack_code, baseQuery]);
  return (
    <CardSearchComponent
      baseQuery={query}
      sort={SORT_BY_PACK}
      showNonCollection
      includeDuplicates
      screenType="pack"
    />
  );
}

function options<T extends BasicStackParamList>({ route }: { route: RouteProp<T, 'Pack'> }): NativeStackNavigationOptions {
  return { title: route.params?.pack_name || route.params?.pack_code || t`Pack` };
};
PackCardsView.options = options;


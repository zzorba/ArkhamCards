import React, { useCallback, useContext, useMemo } from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { setPackSpoiler, setCyclePackSpoiler } from '@actions';
import PackListComponent from '@components/core/PackListComponent';
import { NavigationProps } from '@components/nav/types';
import { getAllPacks, getPackSpoilers } from '@reducers';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

export default function SpoilersView({ componentId }: NavigationProps) {
  const { backgroundStyle, typography } = useContext(StyleContext);
  const packs = useSelector(getAllPacks);
  const show_spoilers = useSelector(getPackSpoilers);

  const header = useMemo(() => (
    <View style={space.paddingS}>
      <Text style={typography.small}>
        { t`Mark the scenarios you've played through to make the results start showing up in search results.` }
      </Text>
    </View>
  ), [typography]);

  const dispatch = useDispatch();
  const setChecked = useCallback((code: string, value: boolean) => {
    dispatch(setPackSpoiler(code, value));
  }, [dispatch]);
  const setCycleChecked = useCallback((cycle_code: string, value: boolean) => {
    dispatch(setCyclePackSpoiler(cycle_code, value));
  }, [dispatch]);

  if (!packs.length) {
    return (
      <View>
        <Text style={typography.text}>{ t`Loading` }</Text>
      </View>
    );
  }
  return (
    <View style={[styles.container, backgroundStyle]}>
      <PackListComponent
        componentId={componentId}
        packs={packs}
        header={header}
        checkState={show_spoilers}
        setChecked={setChecked}
        setCycleChecked={setCycleChecked}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


import React, { useCallback, useContext, useMemo } from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import PackListComponent from '@components/core/PackListComponent';
import { NavigationProps } from '@components/nav/types';
import { setInCollection, setCycleInCollection } from '@actions';
import { getAllPacks, getPacksInCollection, AppState } from '@reducers';
import StyleContext from '@styles/StyleContext';
import { setIgnoreCollection } from './actions';
import DeckCheckboxButton from '@components/deck/controls/DeckCheckboxButton';
import space from '@styles/space';

function CollectionEditView({ componentId }: NavigationProps) {
  const dispatch = useDispatch();
  const packs = useSelector(getAllPacks);
  const in_collection = useSelector(getPacksInCollection);
  const ignoreCollection = useSelector((state: AppState) => !!state.settings.ignore_collection);
  const setChecked = useCallback((code: string, value: boolean) => {
    dispatch(setInCollection(code, value));
  }, [dispatch]);

  const toggleIgnoreCollection = useCallback((value: boolean) => {
    dispatch(setIgnoreCollection(value));
  }, [dispatch]);

  const setCycleChecked = useCallback((cycle_code: string, value: boolean) => {
    dispatch(setCycleInCollection(cycle_code, value));
  }, [dispatch]);

  const { backgroundStyle, typography } = useContext(StyleContext);
  const disableButton = useMemo(() => {
    return (
      <View style={space.paddingSideS}>
        <DeckCheckboxButton
          icon="show"
          title={t`Show all cards`}
          description={ignoreCollection ? t`Disable to choose individual packs to show` : t`All cards are shown throughout the app`}
          value={ignoreCollection}
          onValueChange={toggleIgnoreCollection}
        />
      </View>
    );
  }, [ignoreCollection, toggleIgnoreCollection]);
  if (!packs.length) {
    return (
      <View>
        <Text style={typography.text}>{t`Loading`}</Text>
      </View>
    );
  }
  if (ignoreCollection) {
    return (
      <View>
        <Text style={[typography.small, space.paddingS]}>
          { t`Use these controls to limit which cards are visible while searching, building decks, or upgrading cards to those in your own collection.` }
        </Text>
        { disableButton }
      </View>
    );
  }
  return (
    <View style={[styles.container, backgroundStyle]}>
      <PackListComponent
        coreSetName={t`Second Core Set`}
        componentId={componentId}
        packs={packs}
        header={disableButton}
        checkState={in_collection}
        setChecked={setChecked}
        setCycleChecked={setCycleChecked}
      />
    </View>
  );
}

CollectionEditView.options = () => {
  return {
    topBar: {
      title: {
        text: t`Edit Collection`,
      },
    },
  };
};

export default CollectionEditView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

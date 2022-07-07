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
import { setInCollection, setCycleInCollection, setPackDraft, setCycleDraft } from '@actions';
import { getAllPacks, getDraftPacks, getPacksInCollection } from '@reducers';
import StyleContext from '@styles/StyleContext';
import { setIgnoreCollection } from './actions';
import DeckCheckboxButton from '@components/deck/controls/DeckCheckboxButton';
import space from '@styles/space';
import { useSettingFlag, useSettingValue } from '@components/core/hooks';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { Navigation } from 'react-native-navigation';
import DeckButton from '@components/deck/controls/DeckButton';
import { useAppDispatch } from '@app/store';

export interface CollectionEditProps {
  draftMode?: boolean;
}

function CollectionEditView({ componentId, draftMode }: CollectionEditProps & NavigationProps) {
  const dispatch = useAppDispatch();
  const [draft] = useSelector(getDraftPacks);
  const [draftFromCollection, toggleDraftFromCollection] = useSettingFlag('draft_from_collection');
  const packs = useSelector(getAllPacks);
  const in_collection = useSelector(getPacksInCollection);
  const ignoreCollection = useSettingValue('ignore_collection');
  const setChecked = useCallback((code: string, value: boolean) => {
    if (draftMode) {
      dispatch(setPackDraft(code, value));
    } else {
      dispatch(setInCollection(code, value));
    }
  }, [dispatch, draftMode]);

  const toggleIgnoreCollection = useCallback((value: boolean) => {
    dispatch(setIgnoreCollection(value));
  }, [dispatch]);

  const setCycleChecked = useCallback((cycle_code: string, value: boolean) => {
    if (draftMode) {
      dispatch(setCycleDraft(cycle_code, value));
    } else {
      dispatch(setCycleInCollection(cycle_code, value));
    }
  }, [dispatch, draftMode]);

  const { backgroundStyle, typography } = useContext(StyleContext);
  const onEditCollection = useCallback(() => {
    Navigation.push<CollectionEditProps>(componentId, {
      component: {
        name: 'My.Collection',
        passProps: {
          draftMode: false,
        },
      },
    });
  }, [componentId]);
  const header = useMemo(() => {
    if (draftMode) {
      return (
        <>
          <View style={space.paddingSideS}>
            <DeckCheckboxButton
              icon="draft"
              title={t`Draft from card collection`}
              description={draftFromCollection ? t`Disable to choose which packs to draft from` : t`Draft using your card collection`}
              value={draftFromCollection}
              onValueChange={toggleDraftFromCollection}
            />
          </View>
          { draftFromCollection && (
            <View style={space.paddingS}>
              <DeckButton icon="card-outline" onPress={onEditCollection} title={t`Edit Collection`} shrink />
            </View>
          ) }
        </>
      );
    }
    return (
      <>
        <Text style={[typography.small, space.paddingS]}>
          { t`Use these controls to limit which cards are visible while searching, building decks, or upgrading cards to those in your own collection.` }
        </Text>
        <View style={space.paddingSideS}>
          <DeckCheckboxButton
            icon="show"
            title={t`Show all cards`}
            description={ignoreCollection ? t`Disable to choose individual packs to show` : t`All cards are shown throughout the app`}
            value={ignoreCollection}
            onValueChange={toggleIgnoreCollection}
          />
        </View>
      </>
    );
  }, [ignoreCollection, typography, draftMode, draftFromCollection, onEditCollection, toggleIgnoreCollection, toggleDraftFromCollection]);
  if (!packs.length) {
    return (
      <LoadingSpinner large />
    );
  }
  return (
    <View style={[styles.container, backgroundStyle]}>
      { !draftMode && ignoreCollection ? header : (
        <PackListComponent
          alwaysShowCoreSet={draftMode}
          coreSetName={t`Second Core Set`}
          componentId={componentId}
          packs={packs}
          header={header}
          cyclesOnly={draftMode}
          includeNoCore
          checkState={draftMode ? draft : in_collection}
          setChecked={setChecked}
          setCycleChecked={setCycleChecked}
        />
      ) }
    </View>
  );
}

CollectionEditView.options = (passProps: CollectionEditProps) => {
  return {
    topBar: {
      title: {
        text: passProps.draftMode ? t`Draft Pool` : t`Edit Collection`,
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

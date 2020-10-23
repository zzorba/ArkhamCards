import React, { useCallback, useContext } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import PackListComponent from '@components/core/PackListComponent';
import { NavigationProps } from '@components/nav/types';
import { setInCollection, setCycleInCollection } from '@actions';
import { getAllPacks, getPacksInCollection } from '@reducers';
import StyleContext from '@styles/StyleContext';

function CollectionEditView({ componentId }: NavigationProps) {
  const dispatch = useDispatch();
  const packs = useSelector(getAllPacks);
  const in_collection = useSelector(getPacksInCollection);
  const setChecked = useCallback((code: string, value: boolean) => {
    dispatch(setInCollection(code, value));
  }, [dispatch]);

  const setCycleChecked = useCallback((cycle_code: string, value: boolean) => {
    dispatch(setCycleInCollection(cycle_code, value));
  }, [dispatch]);

  const { typography } = useContext(StyleContext);
  if (!packs.length) {
    return (
      <View>
        <Text style={typography.text}>{t`Loading`}</Text>
      </View>
    );
  }
  return (
    <PackListComponent
      coreSetName={t`Second Core Set`}
      componentId={componentId}
      packs={packs}
      checkState={in_collection}
      setChecked={setChecked}
      setCycleChecked={setCycleChecked}
    />
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
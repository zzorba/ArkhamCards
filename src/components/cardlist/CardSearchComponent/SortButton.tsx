import React, { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import AppIcon from '@icons/AppIcon';
import { SortType } from '@actions/types';
import { useSortDialog } from '@components/cardlist/CardSortDialog';
import { updateCardSort } from '@components/filter/actions';
import { AppState, getMythosMode, getCardSort } from '@reducers';
import StyleContext from '@styles/StyleContext';

const SIZE = 36;

interface Props {
  filterId: string;
  lightButton?: boolean;
  baseQuery?: string;
  modal?: boolean;
}

function SortButton({ filterId, lightButton }: Props) {
  const { colors } = useContext(StyleContext);
  const mythosModeSelector = useCallback((state: AppState) => getMythosMode(state, filterId), [filterId]);
  const sortSelector = useCallback((state: AppState) => getCardSort(state, filterId), [filterId]);
  const mythosMode = useSelector(mythosModeSelector);
  const sort = useSelector(sortSelector);
  const dispatch = useDispatch();

  const sortChanged = useCallback((sort: SortType) => {
    dispatch(updateCardSort(filterId, sort));
  }, [dispatch, filterId]);
  const [sortDialog, showSortDialog] = useSortDialog(sortChanged, sort, mythosMode);
  const onPress = useCallback(() => {
    Keyboard.dismiss();
    showSortDialog();
  }, [showSortDialog]);

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity onPress={onPress} testID="Sort">
          <View style={styles.touchable}>
            <AppIcon name="sort" size={22} color={lightButton ? 'white' : colors.M} />
          </View>
        </TouchableOpacity>
      </View>
      { sortDialog }
    </View>
  );
}


SortButton.WIDTH = SIZE + 4;
SortButton.HEIGHT = SIZE;
export default SortButton;

const EXTRA_ANDROID_WIDTH = (Platform.OS === 'android' ? 4 : 0);
const styles = StyleSheet.create({
  container: {
    marginLeft: Platform.OS === 'android' ? 8 : 0,
    width: SIZE + EXTRA_ANDROID_WIDTH,
    height: SIZE,
    position: 'relative',
  },
  touchable: {
    padding: 4,
    width: SIZE + EXTRA_ANDROID_WIDTH,
    height: SIZE,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

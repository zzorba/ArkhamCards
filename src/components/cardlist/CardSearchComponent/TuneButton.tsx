import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { t } from 'ttag';
import { Navigation } from 'react-native-navigation';
import { Brackets } from 'typeorm/browser';

import AppIcon from '@icons/AppIcon';
import { CardFilterProps } from '@components/filter/CardFilterView';
import FilterBuilder, { CardFilterData } from '@lib/filters';
import { AppState, getFilterState, getCardFilterData } from '@reducers';
import StyleContext from '@styles/StyleContext';

const SIZE = 36;

interface Props {
  filterId: string;
  lightButton?: boolean;
  baseQuery?: Brackets;
  modal?: boolean;
}

interface ReduxProps {
  filters: boolean;
  cardData?: CardFilterData;
}


function TuneButton({ filterId, lightButton, baseQuery, modal }: Props) {
  const { colors } = useContext(StyleContext);
  const filterSelector = useCallback((state: AppState) => {
    const cardData = getCardFilterData(state, filterId);
    const filters = getFilterState(state, filterId);
    if (!filters) {
      return [false, cardData];
    }
    return [
      !!new FilterBuilder('default').filterToQuery(filters),
      cardData,
    ];
  }, [filterId]);
  const [filters, cardData] = useSelector(filterSelector);
  const onPress = useCallback(() => {
    if (!cardData) {
      return;
    }
    Navigation.push<CardFilterProps>(filterId, {
      component: {
        name: 'SearchFilters',
        passProps: {
          filterId,
          baseQuery,
          modal,
        },
        options: {
          topBar: {
            backButton: {
              title: t`Apply`,
            },
            title: {
              text: t`Filters`,
            },
          },
        },
      },
    });
  }, [filterId, baseQuery, modal, cardData]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.touchable}>
          <AppIcon name="filter" size={22} color={lightButton ? 'white' : colors.M} />
          { filters && <View style={styles.chiclet} /> }
        </View>
      </TouchableOpacity>
    </View>
  );
}

TuneButton.WIDTH = SIZE + (Platform.OS === 'android' ? 16 : 0);
TuneButton.HEIGHT = SIZE;

export default TuneButton;

const EXTRA_ANDROID_WIDTH = (Platform.OS === 'android' ? 4 : 0);
const styles = StyleSheet.create({
  container: {
    marginLeft: Platform.OS === 'android' ? 8 : 0,
    marginRight: Platform.OS === 'android' ? 8 : 0,
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
  chiclet: {
    borderColor: 'white',
    borderWidth: 1,
    position: 'absolute',
    top: 1,
    right: 1 + EXTRA_ANDROID_WIDTH,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

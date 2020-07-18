import React from 'react';
import { connect } from 'react-redux';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { t } from 'ttag';
import { Navigation } from 'react-native-navigation';
import { Brackets } from 'typeorm/browser';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import { CardFilterProps } from '@components/filter/CardFilterView';
import FilterBuilder, { CardFilterData } from '@lib/filters';
import { AppState, getFilterState, getCardFilterData } from '@reducers';
import COLORS from '@styles/colors';

const SIZE = 36;

interface OwnProps {
  filterId: string;
  lightButton?: boolean;
  baseQuery?: Brackets;
  modal?: boolean;
}

interface ReduxProps {
  filters: boolean;
  cardData?: CardFilterData;
}

type Props = OwnProps & ReduxProps;

class TuneButton extends React.Component<Props> {
  _onPress = () => {
    const {
      filterId,
      baseQuery,
      modal,
      cardData,
    } = this.props;
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
          cardData,
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
  };

  render() {
    const {
      filters,
      lightButton,
    } = this.props;
    const defaultColor = COLORS.navButton;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._onPress}>
          <View style={styles.touchable}>
            <MaterialIcons name="tune" size={28} color={lightButton ? 'white' : defaultColor} />
            { filters && <View style={styles.chiclet} /> }
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  const cardData = getCardFilterData(state, props.filterId);
  const filters = getFilterState(state, props.filterId);
  if (!filters) {
    return {
      filters: false,
      cardData,
    };
  }
  return {
    filters: !!new FilterBuilder('default').filterToQuery(filters),
    cardData,
  };
}

export default connect(mapStateToProps)(TuneButton);

const EXTRA_ANDROID_WIDTH = (Platform.OS === 'android' ? 8 : 0);
const styles = StyleSheet.create({
  container: {
    marginLeft: Platform.OS === 'android' ? 8 : 12,
    width: SIZE + EXTRA_ANDROID_WIDTH,
    height: SIZE,
    position: 'relative',
  },
  touchable: {
    padding: 4,
    width: SIZE + EXTRA_ANDROID_WIDTH,
    height: SIZE,
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

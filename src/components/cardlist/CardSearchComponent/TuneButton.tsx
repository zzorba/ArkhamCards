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

import AppIcon from '@icons/AppIcon';
import { CardFilterProps } from '@components/filter/CardFilterView';
import FilterBuilder, { CardFilterData } from '@lib/filters';
import { AppState, getFilterState, getCardFilterData } from '@reducers';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

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
  static contextType = StyleContext;
  context!: StyleContextType;

  static WIDTH = SIZE + (Platform.OS === 'android' ? 16 : 0);
  static HEIGHT = SIZE;

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
    const { colors } = this.context;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._onPress}>
          <View style={styles.touchable}>
            <AppIcon name="filter" size={22} color={lightButton ? 'white' : colors.M} />
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

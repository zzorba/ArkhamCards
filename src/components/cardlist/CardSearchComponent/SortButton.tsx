import React from 'react';
import { connect } from 'react-redux';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { bindActionCreators, Dispatch, Action } from 'redux';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import { SortType } from 'actions/types';
import { updateCardSort } from 'components/filter/actions';
import { AppState, getMythosMode, getCardSort } from 'reducers';
import { COLORS } from 'styles/colors';

const SIZE = 36;

interface OwnProps {
  filterId: string;
  lightButton?: boolean;
  baseQuery?: string;
  modal?: boolean;
}

interface ReduxProps {
  mythosMode: boolean;
  sort: SortType;
}

interface ReduxActionProps {
  updateCardSort: (id: string, sort: SortType) => void;
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

class SortButton extends React.Component<Props> {
  _sortChanged = (sort: SortType) => {
    const {
      filterId,
      updateCardSort,
    } = this.props;
    updateCardSort(filterId, sort);
  };

  _onPress = () => {
    Keyboard.dismiss();
    Navigation.showOverlay({
      component: {
        name: 'Dialog.Sort',
        passProps: {
          sortChanged: this._sortChanged,
          selectedSort: this.props.sort,
          hasEncounterCards: this.props.mythosMode,
        },
        options: {
          layout: {
            backgroundColor: 'rgba(128,128,128,.75)',
          },
        },
      },
    });
  };

  render() {
    const {
      lightButton,
    } = this.props;
    const defaultColor = Platform.OS === 'ios' ? '#007AFF' : COLORS.button;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._onPress}>
          <View style={styles.touchable}>
            <MaterialIcons name="sort-by-alpha" size={28} color={lightButton ? 'white' : defaultColor} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  return {
    mythosMode: getMythosMode(state, props.filterId),
    sort: getCardSort(state, props.filterId),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    updateCardSort,
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(SortButton);

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
});

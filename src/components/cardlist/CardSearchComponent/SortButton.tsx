import React from 'react';
import { connect } from 'react-redux';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';

import AppIcon from '@icons/AppIcon';
import { SortType } from '@actions/types';
import { showSortDialog } from '@components/cardlist/CardSortDialog';
import { updateCardSort } from '@components/filter/actions';
import { AppState, getMythosMode, getCardSort } from '@reducers';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

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
  static contextType = StyleContext;
  context!: StyleContextType;

  static WIDTH = SIZE + 4;
  static HEIGHT = SIZE;

  _sortChanged = (sort: SortType) => {
    const {
      filterId,
      updateCardSort,
    } = this.props;
    updateCardSort(filterId, sort);
  };

  _onPress = () => {
    Keyboard.dismiss();
    showSortDialog(
      this._sortChanged,
      this.props.sort,
      this.props.mythosMode
    )
  };

  render() {
    const {
      lightButton,
    } = this.props;
    const { colors } = this.context;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._onPress} testID="Sort">
          <View style={styles.touchable}>
            <AppIcon name="sort" size={22} color={lightButton ? 'white' : colors.M} />
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

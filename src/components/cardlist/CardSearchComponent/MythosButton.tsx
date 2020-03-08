import React from 'react';
import { connect } from 'react-redux';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';

import ArkhamIcon from 'icons/ArkhamIcon';
import { toggleMythosMode } from 'components/filter/actions';
import { AppState, getMythosMode } from 'reducers';
import { COLORS } from 'styles/colors';

const SIZE = 36;

interface OwnProps {
  filterId: string;
  lightButton?: boolean;
}

interface ReduxProps {
  mythosMode: boolean;
}

interface ReduxActionProps {
  toggleMythosMode: (id: string, value: boolean) => void;
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

class MythosButton extends React.Component<Props> {
  _onPress = () => {
    const {
      filterId,
      toggleMythosMode,
      mythosMode,
    } = this.props;
    toggleMythosMode(filterId, !mythosMode);
  };

  render() {
    const {
      mythosMode,
      lightButton,
    } = this.props;
    const defaultColor = Platform.OS === 'ios' ? '#007AFF' : COLORS.button;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._onPress}>
          <View style={styles.touchable}>
            <ArkhamIcon
              name={mythosMode ? 'auto_fail' : 'per_investigator'}
              size={24}
              color={lightButton ? 'white' : defaultColor}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  return {
    mythosMode: getMythosMode(state, props.filterId),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    toggleMythosMode,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MythosButton);

const EXTRA_ANDROID_WIDTH = (Platform.OS === 'android' ? 8 : 0);
const styles = StyleSheet.create({
  container: {
    marginLeft: Platform.OS === 'android' ? 8 : 12,
    width: SIZE + EXTRA_ANDROID_WIDTH,
    height: SIZE,
    position: 'relative',
  },
  touchable: {
    padding: 6,
    width: SIZE + EXTRA_ANDROID_WIDTH,
    height: SIZE,
  },
});

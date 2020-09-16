import React from 'react';
import { connect } from 'react-redux';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Easing,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';

import { AnimatedArkhamIcon } from '@icons/ArkhamIcon';
import { toggleMythosMode } from '@components/filter/actions';
import { AppState, getMythosMode } from '@reducers';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

const SIZE = 32;

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

interface State {
  toggleAnim: Animated.Value;
  mythosMode: boolean;
}

class MythosButton extends React.Component<Props, State> {
  static contextType = StyleContext;
  context!: StyleContextType;

  static WIDTH = SIZE * 2 + 4
  static HEIGHT = SIZE;

  constructor(props: Props) {
    super(props);

    this.state = {
      toggleAnim: new Animated.Value(props.mythosMode ? 1 : 0),
      mythosMode: props.mythosMode,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { mythosMode } = this.props;
    if (mythosMode !== prevProps.mythosMode) {
      Animated.timing(
        this.state.toggleAnim,
        {
          toValue: mythosMode ? 1 : 0,
          duration: 250,
          useNativeDriver: false,
          easing: Easing.exp,
        }
      ).start();
    }
  }



  _onPress = () => {
    const {
      filterId,
      toggleMythosMode,
      mythosMode,
    } = this.props;
    toggleMythosMode(filterId, !mythosMode);
  };

  render() {
    const { toggleAnim } = this.state;
    const { colors } = this.context;

    const investigatorColor = toggleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.D30, colors.L10],
    });
    const mythosColor = toggleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.L10, colors.D30],
    });
    const movingCircleX = toggleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, SIZE],
    });

    const backgroundColor = colors.L10;

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this._onPress}>
          <View style={[styles.buttonContainer, { borderColor: backgroundColor }]}>
            <Animated.View style={[
              styles.circle,
              {
                backgroundColor,
                transform: [{ translateX: movingCircleX }],
              },
            ]} />
            <View style={styles.iconWrapper}>
              <Animated.Text style={{ color: investigatorColor }}>
                <AnimatedArkhamIcon
                  name={'per_investigator'}
                  size={24}
                />
              </Animated.Text>
            </View>
            <View style={styles.iconWrapper}>
              <Animated.Text style={{ color: mythosColor }}>
                <AnimatedArkhamIcon
                  name={'auto_fail'}
                  size={24}
                />
              </Animated.Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
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

const styles = StyleSheet.create({
  container: {
    width: MythosButton.WIDTH,
    height: MythosButton.HEIGHT,
    position: 'relative',
    marginBottom: 8,
  },
  iconWrapper: {
    width: SIZE,
    height: SIZE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    borderRadius: SIZE / 2,
    width: SIZE,
    height: SIZE,
    position: 'absolute',
    top: 1,
    left: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    width: SIZE * 2 + 4,
    height: SIZE + 4,
    paddingTop: 1,
    paddingLeft: 1,
    paddingRight: 1,
    borderWidth: 1,
    borderTopLeftRadius: SIZE / 2,
    borderBottomLeftRadius: SIZE / 2,
    borderTopRightRadius: SIZE / 2,
    borderBottomRightRadius: SIZE / 2,
  },
});

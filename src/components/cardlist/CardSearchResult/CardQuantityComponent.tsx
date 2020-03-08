import React from 'react';
import { debounce, range } from 'lodash';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Button from 'components/core/Button';
import PlusMinusButtons from 'components/core/PlusMinusButtons';
import CountButton from './CountButton';
import { rowHeight, buttonWidth, BUTTON_PADDING, toggleButtonMode } from './constants';
import typography from 'styles/typography';
import { s, xs } from 'styles/space';

interface Props {
  count: number;
  fontScale: number;
  countChanged: (count: number) => void;
  limit: number;
  showZeroCount?: boolean;
  forceBig?: boolean;
  light?: boolean;
}

interface State {
  open: boolean;
  count: number;
  slideAnim: Animated.Value;
}

/**
 * Simple sliding card count.
 */
export default class CardQuantityComponent extends React.PureComponent<Props, State> {
  _throttledCountChange!: (count: number) => void;
  constructor(props: Props) {
    super(props);

    this.state = {
      open: false,
      count: props.count,
      slideAnim: new Animated.Value(0),
    };

    this._throttledCountChange = debounce(
      props.countChanged,
      200,
      { trailing: true }
    );
  }

  componentDidUpdate(prevProps: Props) {
    const {
      count,
    } = this.props;
    if (count !== prevProps.count) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        count,
      });
    }
  }

  _increment = () => {
    const {
      limit,
    } = this.props;
    this.setState(state => {
      const count = Math.min((state.count || 0) + 1, limit);
      if (count !== state.count) {
        this._throttledCountChange(count);
      }
      return {
        count,
      };
    });
  };

  _decrement = () => {
    this.setState(state => {
      const count = Math.max((state.count || 0) - 1, 0);
      if (count !== state.count) {
        this._throttledCountChange(count);
      }
      return {
        count,
      };
    });
  };

  _selectCount = (count: number) => {
    const { fontScale } = this.props;
    this.setState({
      count: count,
    }, () => {
      setTimeout(() => {
        if (toggleButtonMode(fontScale)) {
          this._toggle();
        }
        this._throttledCountChange(count);
      }, 0);
    });
  }

  _selectZero = () => {
    this._selectCount(0);
  };

  _selectOne = () => {
    this._selectCount(1);
  };

  _selectTwo = () => {
    this._selectCount(2);
  };

  _toggle = () => {
    const {
      open,
      slideAnim,
    } = this.state;
    slideAnim.stopAnimation(() => {
      Animated.timing(slideAnim, {
        toValue: open ? 0 : 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
    this.setState({
      open: !open,
    });
  };

  renderTiny() {
    const {
      limit,
      fontScale,
    } = this.props;
    const {
      count,
      slideAnim,
    } = this.state;
    const drawerWidth = BUTTON_PADDING + (buttonWidth(fontScale) + BUTTON_PADDING) * (limit + 1);

    const translateX = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -drawerWidth],
      extrapolate: 'clamp',
    });

    return (
      <View style={[styles.tinyContainer, { height: rowHeight(fontScale) }]} pointerEvents="box-none">
        <Button
          style={[styles.button, { width: buttonWidth(fontScale) }]}
          color={count === 0 ? 'white' : undefined}
          size="small"
          align="center"
          width={buttonWidth(fontScale)}
          text={count.toString()}
          onPress={this._toggle}
        />
        <View style={styles.drawer} pointerEvents="box-none">
          <Animated.View style={[
            styles.slideDrawer,
            {
              height: rowHeight(fontScale),
              width: drawerWidth,
              transform: [{ translateX: translateX }],
            },
          ]}>
            <LinearGradient
              style={styles.gradient}
              colors={['#a0a0a0', '#f3f3f3']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
            >
              { range(0, limit + 1).map(buttonIdx => (
                <CountButton
                  key={buttonIdx}
                  fontScale={fontScale}
                  count={buttonIdx}
                  text={`${buttonIdx}`}
                  selected={count === buttonIdx}
                  onPress={this._selectCount}
                />
              )) }
            </LinearGradient>
          </Animated.View>
        </View>
      </View>
    );
  }

  render() {
    const {
      limit,
      showZeroCount,
      forceBig,
      light,
      fontScale,
    } = this.props;
    if (toggleButtonMode(fontScale) && !forceBig) {
      return this.renderTiny();
    }

    const {
      count,
    } = this.state;

    return (
      <View style={[styles.row, { height: rowHeight(fontScale) }]}>
        <PlusMinusButtons
          count={count}
          size={36}
          onIncrement={this._increment}
          onDecrement={this._decrement}
          limit={limit}
          color={light ? 'light' : undefined}
          hideDisabledMinus
          countRender={
            <Text style={[typography.text, styles.count, light ? { color: 'white', fontSize: 22 } : {}]}>
              { (showZeroCount || count !== 0) ? count : ' ' }
            </Text>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: xs,
  },
  count: {
    marginLeft: xs,
    width: 16,
    textAlign: 'center',
    marginRight: s,
    fontWeight: '600',
  },
  tinyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
  },
  button: {
    marginTop: xs,
    marginBottom: xs,
    marginRight: xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawer: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: '100%',
    overflow: 'visible',
  },
  slideDrawer: {
    borderColor: '#888888',
    borderLeftWidth: 1,
  },
  gradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: BUTTON_PADDING,
  },
});

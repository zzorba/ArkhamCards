import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Button from '../core/Button';
import PlusMinusButtons from '../core/PlusMinusButtons';
import CountButton from './CountButton';
import { ROW_HEIGHT, BUTTON_WIDTH, BUTTON_PADDING, TOGGLE_BUTTON_MODE } from './constants';
import typography from '../../styles/typography';


/**
 * Simple sliding card count.
 */
export default class CardQuantityComponent extends React.PureComponent {
  static propTypes = {
    count: PropTypes.number.isRequired,
    countChanged: PropTypes.func.isRequired,
    limit: PropTypes.number.isRequired,
    showZeroCount: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      count: props.count,
      slideAnim: new Animated.Value(0),
    };

    this._toggle = this.toggle.bind(this);

    this._throttledCountChange = debounce(
      props.countChanged,
      200,
      { trailing: true }
    );

    this._increment = this.increment.bind(this);
    this._decrement = this.decrement.bind(this);
    this._selectCount = this.selectCount.bind(this);
    this._selectZero = this.selectCount.bind(this, 0);
    this._selectOne = this.selectCount.bind(this, 1);
    this._selectTwo = this.selectCount.bind(this, 2);
  }

  componentDidUpdate(prevProps) {
    const {
      count,
    } = this.props;
    if (count !== prevProps.count) {
      this.setState({
        count,
      });
    }
  }

  increment() {
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
  }

  decrement() {
    this.setState(state => {
      const count = Math.max((state.count || 0) - 1, 0);
      if (count !== state.count) {
        this._throttledCountChange(count);
      }
      return {
        count,
      };
    });
  }

  selectCount(count) {
    this.setState({
      count: count,
    }, () => {
      setTimeout(() => {
        if (TOGGLE_BUTTON_MODE) {
          this.toggle(true);
        }
        this._throttledCountChange(count);
      }, 0);
    });
  }

  toggle() {
    const {
      open,
      slideAnim,
    } = this.state;
    slideAnim.stopAnimation(() => {
      Animated.timing(slideAnim, {
        toValue: open ? 0 : 1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.easeIn,
      }).start();
    });
    this.setState({
      open: !open,
    });
  }

  renderTiny() {
    const {
      limit,
    } = this.props;
    const {
      count,
      slideAnim,
    } = this.state;
    const drawerWidth = BUTTON_PADDING + (BUTTON_WIDTH + BUTTON_PADDING) * (limit + 1);

    const translateX = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -drawerWidth],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.tinyContainer} pointerEvents="box-none">
        <Button
          style={styles.button}
          color={count === 0 ? 'white' : null}
          size="small"
          align="center"
          width={BUTTON_WIDTH}
          text={count.toString()}
          onPress={this._toggle}
        />
        <View style={styles.drawer} pointerEvents="box-none">
          <Animated.View style={[
            styles.slideDrawer,
            {
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
              <CountButton
                text="0"
                selected={count === 0}
                onPress={this._selectZero}
              />
              <CountButton text="1"
                selected={count === 1}
                onPress={this._selectOne}
              />
              { (limit > 1) && (
                <CountButton
                  text="2"
                  selected={count === 2}
                  onPress={this._selectTwo}
                />
              ) }
            </LinearGradient>
          </Animated.View>
        </View>
      </View>
    );
  }

  render() {
    if (TOGGLE_BUTTON_MODE) {
      return this.renderTiny();
    }

    const {
      limit,
      showZeroCount,
    } = this.props;
    const {
      count,
    } = this.state;

    return (
      <View style={styles.row}>
        <PlusMinusButtons
          count={count}
          size={44}
          onIncrement={this._increment}
          onDecrement={this._decrement}
          limit={limit}
          noFill
        />
        <Text style={[typography.text, styles.count]}>
          { (showZeroCount || count !== 0) ? count : ' ' }
        </Text>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: ROW_HEIGHT,
  },
  count: {
    marginLeft: 4,
    width: 16,
    textAlign: 'center',
    marginRight: 8,
  },
  tinyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: ROW_HEIGHT,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
  },
  button: {
    marginTop: 4,
    marginBottom: 4,
    marginRight: 4,
    width: BUTTON_WIDTH,
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
    height: ROW_HEIGHT,
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

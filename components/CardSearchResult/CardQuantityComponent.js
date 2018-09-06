import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Button from '../core/Button';
import PlusMinusButtons from '../core/PlusMinusButtons';
import CountButton from './CountButton';
import { ROW_HEIGHT, BUTTON_WIDTH, BUTTON_PADDING } from './constants';
import typography from '../../styles/typography';

/**
 * Simple sliding card count.
 */
export default class CardQuantityComponent extends React.Component {
  static propTypes = {
    count: PropTypes.number.isRequired,
    countChanged: PropTypes.func.isRequired,
    limit: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    const tinyScreen = (Platform.OS === 'ios' &&
      Dimensions.get('window').width < 375
    );

    this.state = {
      tinyScreen,
      open: false,
      count: props.count,
      slideAnim: new Animated.Value(0),
    };

    this._toggle = this.toggle.bind(this);

    this._selectCount = this.selectCount.bind(this);
    this._selectZero = this.selectCount.bind(this, 0);
    this._selectOne = this.selectCount.bind(this, 1);
    this._selectTwo = this.selectCount.bind(this, 2);
  }

  static getDerivedStateFromProps(props) {
    return {
      count: props.count,
    };
  }

  selectCount(count) {
    this.setState({
      count: count,
    });
    setTimeout(() => {
      this.toggle();
      this.props.countChanged(count);
    }, 50);
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
      <View style={styles.container} pointerEvents="box-none">
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
    if (this.state.tinyScreen) {
      return this.renderTiny();
    }

    const {
      limit,
    } = this.props;
    const {
      count,
    } = this.state;

    return (
      <View style={styles.row}>
        { count !== 0 && (
          <Text style={[typography.text, styles.count]}>
            { `×${count}` }
          </Text>
        ) }
        <PlusMinusButtons
          count={count}
          size={44}
          onChange={this._selectCount}
          limit={limit}
          noFill
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
    height: ROW_HEIGHT,
  },
  count: {
    marginRight: 4,
  },
  container: {
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

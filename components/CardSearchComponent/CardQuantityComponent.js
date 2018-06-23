import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
} from 'react-native';
import { Button } from 'react-native-elements';

import { COLORS } from '../../styles/colors';
import { ROW_HEIGHT } from './constants';

const BUTTON_WIDTH = 40;
const BUTTON_PADDING = 12;

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

    this.state = {
      open: false,
      slideAnim: new Animated.Value(0),
    };

    this._toggle = this.toggle.bind(this);

    this._selectZero = this.selectCount.bind(this, 0);
    this._selectOne = this.selectCount.bind(this, 1);
    this._selectTwo = this.selectCount.bind(this, 2);
  }

  selectCount(count) {
    this.props.countChanged(count);
    this.toggle();
  }

  toggle() {
    const {
      open,
      slideAnim,
    } = this.state;
    slideAnim.stopAnimation(() => {
      Animated.timing(slideAnim, {
        toValue: open ? 0 : 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.easeIn,
      }).start();
    });
    this.setState({
      open: !open,
    });
  }

  render() {
    const {
      count,
      limit,
    } = this.props;
    const {
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
          containerStyle={styles.buttonContainer}
          textStyle={styles.buttonText}
          buttonStyle={styles.button}
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
            <Button
              text="0"
              containerStyle={styles.buttonContainer}
              textStyle={count === 0 ? styles.selectedButtonText : styles.buttonText}
              buttonStyle={count === 0 ? styles.selectedButton : styles.button}
              onPress={this._selectZero}
            />
            <Button text="1"
              containerStyle={styles.buttonContainer}
              textStyle={count === 1 ? styles.selectedButtonText : styles.buttonText}
              buttonStyle={count === 1 ? styles.selectedButton : styles.button}
              onPress={this._selectOne}
            />
            { (limit > 1) && (
              <Button
                text="2"
                containerStyle={styles.buttonContainer}
                textStyle={count === 2 ? styles.selectedButtonText : styles.buttonText}
                buttonStyle={count === 2 ? styles.selectedButton : styles.button}
                onPress={this._selectTwo}
              />
            ) }
          </Animated.View>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
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
  buttonText: {
    color: COLORS.black,
    lineHeight: 32,
    padding: 0,
    margin: 0,
  },
  selectedButtonText: {
    color: COLORS.white,
    lineHeight: 32,
    padding: 0,
    margin: 0,
  },
  button: {
    borderColor: COLORS.black,
    borderWidth: 1,
    backgroundColor: COLORS.lightGray,
    padding: 0,
    marginRight: BUTTON_PADDING,
    width: BUTTON_WIDTH,
  },
  selectedButton: {
    borderColor: COLORS.black,
    borderWidth: 1,
    backgroundColor: COLORS.darkGray,
    padding: 0,
    marginRight: BUTTON_PADDING,
    width: BUTTON_WIDTH,
  },
  drawer: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: '100%',
    overflow: 'visible',
  },
  slideDrawer: {
    borderColor: COLORS.black,
    borderWidth: 1,
    backgroundColor: COLORS.gray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: ROW_HEIGHT,
    paddingLeft: BUTTON_PADDING,
  },
});

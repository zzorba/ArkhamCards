import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
} from 'react-native';

import { ROW_HEIGHT, BUTTON_WIDTH, BUTTON_PADDING } from './constants';
import typography from '../../styles/typography';

const DEPRESS_HEIGHT = 6;

export default class CountButton extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string,
    selected: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      anim: new Animated.Value(props.selected ? 1.0 : 0.0),
    };
  }

  componentDidUpdate(prevProps) {
    const {
      selected,
    } = this.props;
    const {
      anim,
    } = this.state;
    if (selected !== prevProps.selected) {
      if (selected) {
        anim.stopAnimation(() => {
          Animated.timing(anim, {
            toValue: 1,
            duration: 250,
            easing: Easing.easeIn,
            useNativeDriver: true,
          }).start();
        });
      } else {
        anim.stopAnimation(() => {
          Animated.timing(anim, {
            toValue: 0,
            duration: 100,
            easing: Easing.easeOut,
            useNativeDriver: true,
          }).start();
        });
      }
    }
  }

  render() {
    const {
      text,
      selected,
      onPress,
    } = this.props;
    const {
      anim,
    } = this.state;
    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, DEPRESS_HEIGHT],
      extrapolate: 'clamp',
    });
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[
          styles.container,
        ]}>
          <View style={styles.shadow} />
          <Animated.View style={[
            styles.button,
            { borderColor: selected ? '#1b526f' : '#5191b2' },
            { backgroundColor: selected ? '#22678b' : '#59a9d2' },
            { transform: [{ translateY: translateY }] },
          ]}>
            { !!text && (
              <Text style={[typography.text, styles.buttonText]}>
                { text }
              </Text>
            ) }
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: BUTTON_WIDTH,
    height: ROW_HEIGHT,
    marginRight: BUTTON_PADDING,
    position: 'relative',
  },
  button: {
    position: 'absolute',
    top: 4,
    left: 0,
    height: ROW_HEIGHT - DEPRESS_HEIGHT - 2 - 8,
    width: BUTTON_WIDTH,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  shadow: {
    backgroundColor: '#0e2c3c',
    borderRadius: 4,
    position: 'absolute',
    bottom: 4,
    left: 0,
    height: ROW_HEIGHT / 2,
    width: BUTTON_WIDTH,
  },
});

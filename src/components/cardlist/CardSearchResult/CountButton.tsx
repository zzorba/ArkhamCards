import React from 'react';
import {
  Animated,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
} from 'react-native';

import { rowHeight, buttonWidth, BUTTON_PADDING } from './constants';
import typography from 'styles/typography';

const DEPRESS_HEIGHT = 6;

interface Props {
  count: number;
  fontScale: number;
  text?: string;
  selected?: boolean;
  onPress: (count: number) => void;
}

interface State {
  anim: Animated.Value;
}

export default class CountButton extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      anim: new Animated.Value(props.selected ? 1.0 : 0.0),
    };
  }

  componentDidUpdate(prevProps: Props) {
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
            useNativeDriver: true,
          }).start();
        });
      } else {
        anim.stopAnimation(() => {
          Animated.timing(anim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }).start();
        });
      }
    }
  }

  _onPress = () => {
    const {
      count,
      onPress,
    } = this.props;
    onPress(count);
  }

  render() {
    const {
      text,
      selected,
      fontScale,
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
      <TouchableWithoutFeedback onPress={this._onPress}>
        <View style={[
          styles.container,
          {
            height: rowHeight(fontScale),
            width: buttonWidth(fontScale),
          },
        ]}>
          <View style={[styles.shadow, {
            height: rowHeight(fontScale) / 2,
            width: buttonWidth(fontScale),
          }]} />
          <Animated.View style={[
            styles.button,
            {
              height: rowHeight(fontScale) - DEPRESS_HEIGHT - 2 - 8,
              width: buttonWidth(fontScale),
              borderColor: selected ? '#1b526f' : '#5191b2',
              backgroundColor: selected ? '#22678b' : '#59a9d2',
              transform: [{ translateY: translateY }],
            },
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
    marginRight: BUTTON_PADDING,
    position: 'relative',
  },
  button: {
    position: 'absolute',
    top: 4,
    left: 0,
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
  },
});

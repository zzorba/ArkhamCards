import React, { PureComponent } from 'react';
import { pick } from 'lodash';
import {
  View,
  Animated,
  Easing,
  Platform,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  I18nManager,
  StyleSheet,
  LayoutChangeEvent,
  GestureResponderEvent,
  ViewProps,
} from 'react-native';

const radius = 10;
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: 'transparent',
    overflow: 'hidden',
  },

  ripple: {
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    overflow: 'hidden',
    position: 'absolute',
  },
});

interface OwnProps {
  rippleColor?: string;
  rippleOpacity?: number;
  rippleDuration?: number;
  rippleSize?: number;
  rippleContainerBorderRadius?: number;
  rippleCentered?: boolean;
  rippleSequential?: boolean;
  rippleFades?: boolean;
  disabled?: boolean;
}

type Props = OwnProps & TouchableWithoutFeedbackProps & ViewProps;

interface Ripple {
  unique: number;
  progress: Animated.Value;
  locationX: number;
  locationY: number;
  R: number;
}
interface State {
  width: number;
  height: number;
  ripples: Ripple[]
}

const DEFAULT_PROPS = {
  rippleColor: 'rgb(0, 0, 0)',
  rippleOpacity: 0.30,
  rippleDuration: 400,
  rippleSize: 400,
  rippleContainerBorderRadius: 0,
  rippleCentered: false,
  rippleSequential: false,
  rippleFades: true,
  disabled: false,
};

export default class RippleComponent extends PureComponent<Props, State> {
  unique: number;
  mounted: boolean;

  constructor(props: Props) {
    super(props);

    this.unique = 0;
    this.mounted = false;

    this.state = {
      width: 0,
      height: 0,
      ripples: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  _onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    const { onLayout } = this.props;

    if (typeof onLayout === 'function') {
      onLayout(event);
    }

    this.setState({ width, height });
  };

  _onPress = (event: GestureResponderEvent) => {
    const { ripples } = this.state;
    const {
      onPress,
      rippleSequential = DEFAULT_PROPS.rippleSequential,
    } = this.props;

    if (!rippleSequential || !ripples.length) {
      this.startRipple(event);
      if (typeof onPress === 'function') {
        requestAnimationFrame(() => onPress(event));
      }
    }
  };

  _onLongPress = (event: GestureResponderEvent) => {
    const { onLongPress } = this.props;

    if (typeof onLongPress === 'function') {
      requestAnimationFrame(() => onLongPress(event));
    }

    this.startRipple(event);
  };

  _onPressIn = (event: GestureResponderEvent) => {
    const { onPressIn } = this.props;

    if (typeof onPressIn === 'function') {
      onPressIn(event);
    }
    this.startRipple(event);
  };

  _onPressOut = (event: GestureResponderEvent) => {
    const { onPressOut } = this.props;

    if (typeof onPressOut === 'function') {
      onPressOut(event);
    }
  };

  _onAnimationEnd = () => {
    if (this.mounted) {
      this.setState(({ ripples }) => ({ ripples: ripples.slice(1) }));
    }
  };

  startRipple(event: GestureResponderEvent) {
    const { width, height } = this.state;
    const {
      rippleDuration = DEFAULT_PROPS.rippleDuration,
      rippleCentered = DEFAULT_PROPS.rippleCentered,
      rippleSize = DEFAULT_PROPS.rippleSize,
    } = this.props;

    const w2 = 0.5 * width;
    const h2 = 0.5 * height;

    const { locationX, locationY } = rippleCentered ?
      { locationX: w2, locationY: h2 } :
      event.nativeEvent;

    const offsetX = Math.abs(w2 - locationX);
    const offsetY = Math.abs(h2 - locationY);

    const R = rippleSize > 0 ?
      0.5 * rippleSize :
      Math.sqrt(Math.pow(w2 + offsetX, 2) + Math.pow(h2 + offsetY, 2));

    const ripple = {
      unique: this.unique++,
      progress: new Animated.Value(0),
      locationX,
      locationY,
      R,
    };

    const animation = Animated
      .timing(ripple.progress, {
        toValue: 1,
        easing: Easing.out(Easing.ease),
        duration: rippleDuration,
        useNativeDriver: true,
      });

    animation.start(this._onAnimationEnd);

    this.setState(({ ripples }) => ({ ripples: ripples.concat(ripple) }));
  }

  _renderRipple = ({ unique, progress, locationX, locationY, R }: Ripple) => {
    const {
      rippleColor = DEFAULT_PROPS.rippleColor,
      rippleOpacity = DEFAULT_PROPS.rippleOpacity,
      rippleFades = DEFAULT_PROPS.rippleFades,
    } = this.props;

    const rippleStyle = {
      top: locationY - radius,
      [I18nManager.isRTL ? 'right' : 'left']: locationX - radius,
      backgroundColor: rippleColor,

      transform: [{
        scale: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5 / radius, R / radius],
        }),
      }],

      opacity: rippleFades ?
        progress.interpolate({
          inputRange: [0, 1],
          outputRange: [rippleOpacity, 0],
        }) :
        rippleOpacity,
    };

    return (
      <Animated.View style={[styles.ripple, rippleStyle]} key={unique} />
    );
  };

  render() {
    const { ripples } = this.state;
    const {
      delayLongPress,
      delayPressIn,
      delayPressOut,
      disabled,
      hitSlop,
      pressRetentionOffset,
      children,
      testID,
      nativeID,
      accessible,
      accessibilityHint,
      accessibilityLabel,

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onPress,
      onLongPress,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onLayout,

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      rippleColor = DEFAULT_PROPS.rippleColor,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      rippleOpacity = DEFAULT_PROPS.rippleOpacity,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      rippleDuration = DEFAULT_PROPS.rippleDuration,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      rippleSize = DEFAULT_PROPS.rippleSize,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      rippleCentered = DEFAULT_PROPS.rippleCentered,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      rippleSequential = DEFAULT_PROPS.rippleSequential,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      rippleFades = DEFAULT_PROPS.rippleFades,
      style,
      ...props
    } = this.props;

    const touchableProps = {
      delayLongPress,
      delayPressIn,
      delayPressOut,
      disabled,
      hitSlop,
      pressRetentionOffset,
      testID,
      accessible,
      accessibilityHint,
      accessibilityLabel,
      onLayout: this._onLayout,
      onPress: this._onPress,
      onPressIn: this._onPressIn,
      onPressOut: this._onPressOut,
      onLongPress: onLongPress ?
        this._onLongPress :
        undefined,

      ...(Platform.OS !== 'web' ? { nativeID } : null),
    };

    const containerStyle = pick(
      StyleSheet.flatten(style),
      ['borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius']
    );

    return (
      <TouchableWithoutFeedback {...touchableProps}>
        <Animated.View {...props} style={style} pointerEvents="box-only">
          {children}
          <View style={[styles.container, containerStyle]}>
            { ripples.map(this._renderRipple) }
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
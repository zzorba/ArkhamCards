/**
 * Taken from https://github.com/Kosiarznerek/react-native-typescript-recipes/blob/master/compotents/SwipeRecognizer.tsx
 * Based on https://github.com/glepur/react-native-swipe-gestures
 * Had to be changed because of scrollView / listView problem
 */

import React from 'react';
import {
  View,
  ViewProps,
  PanResponder,
  PanResponderInstance,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';

// Avaiable swipe directions
export enum SwipeDirection {
  SWIPE_LEFT = 'SWIPE_LEFT',
  SWIPE_RIGHT = 'SWIPE_RIGHT'
}

// Swipe config interface
interface SwipeConfig {
  velocityThreshold: number;
  directionalOffsetThreshold: number;
}

// Default swipe config
const swipeConfig: SwipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

// Properties interface
interface Props extends ViewProps {
  onSwipe?: (direction: SwipeDirection, gestState: PanResponderGestureState) => any;
  onSwipeLeft?: (gestState: PanResponderGestureState) => any;
  onSwipeRight?: (gestState: PanResponderGestureState) => any;
  config?: SwipeConfig;
  children: React.ReactNode;
}

// SwipeRecognizer class
export default class SwipeRecognizer extends React.Component<Props> {
  private _swipeConfig: SwipeConfig;
  private _panResponder!: PanResponderInstance;

  constructor(props: Props) {
    super(props);

    this._swipeConfig = Object.assign(swipeConfig, props.config);
    const responderEnd = this._handlePanResponderEnd.bind(this);
    const shouldSetResponder = this._handleShouldSetPanResponder.bind(this);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: shouldSetResponder,
      onMoveShouldSetPanResponder: shouldSetResponder,
      onPanResponderRelease: responderEnd,
      onPanResponderTerminate: responderEnd,
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.config !== prevProps.config) {
      this._swipeConfig = Object.assign(swipeConfig, this.props.config);
    }
  }

  /**
   * Checks if swipe is valid
   * @param {number} v Velocity
   * @param {number} vt Velocity threshold
   * @param {number} dir_o Directional offset
   * @param {number} dot Directional offset threshold
   * @return {boolean}
   * @private
   */
  private _isValidSwipe(v: number, vt: number, dir_o: number, dot: number): boolean {
    return Math.abs(v) > vt && Math.abs(dir_o) < dot;
  }

  /**
   * Pan responder handler
   * @param {GestureResponderEvent} evt
   * @param {PanResponderGestureState} gestureState
   * @return {boolean}
   * @private
   */
  private _handleShouldSetPanResponder(evt: GestureResponderEvent, gestureState: PanResponderGestureState): boolean {
    return evt.nativeEvent.touches.length === 1 && !this._gestureIsClick(gestureState);
  }

  /**
   * Checks if geture is click
   * @param {PanResponderGestureState} gestureState
   * @return {boolean}
   * @private
   */
  private _gestureIsClick(gestureState: PanResponderGestureState) {
    return Math.abs(gestureState.dx) < 30;
  }

  /**
   * Pan responder handler
   * @param {GestureResponderEvent} evt
   * @param {PanResponderGestureState} gestureState
   * @private
   */
  private _handlePanResponderEnd(evt: GestureResponderEvent, gestureState: PanResponderGestureState): void {
    const swipeDirection = this._getSwipeDirection(gestureState);
    swipeDirection && this._triggerSwipeHandlers(swipeDirection, gestureState);
  }

  /**
   * Swipe handler
   * @param {SwipeDirection} swipeDirection
   * @param {PanResponderGestureState} gestureState
   * @private
   */
  private _triggerSwipeHandlers(
    swipeDirection: SwipeDirection,
    gestureState: PanResponderGestureState
  ): void {
    const { onSwipe, onSwipeLeft, onSwipeRight } = this.props;
    const { SWIPE_LEFT, SWIPE_RIGHT } = SwipeDirection;
    onSwipe && onSwipe(swipeDirection, gestureState);
    switch (swipeDirection) {
      case SWIPE_LEFT:
        onSwipeLeft && onSwipeLeft(gestureState);
        break;
      case SWIPE_RIGHT:
        onSwipeRight && onSwipeRight(gestureState);
        break;
    }
  }

  /**
   * Gets swipe direction
   * @param {PanResponderGestureState} gestureState
   * @return {SwipeDirection | null}
   * @private
   */
  private _getSwipeDirection(gestureState: PanResponderGestureState): SwipeDirection | null {
    const { SWIPE_LEFT, SWIPE_RIGHT } = SwipeDirection;
    const { dx } = gestureState;
    if (this._isValidHorizontalSwipe(gestureState)) {
      return (dx > 0) ? SWIPE_RIGHT : SWIPE_LEFT;
    }
    return null;
  }

  /**
   * Checks if swipe is horizontal
   * @param {PanResponderGestureState} gestureState
   * @return {boolean}
   * @private
   */
  private _isValidHorizontalSwipe(gestureState: PanResponderGestureState): boolean {
    const {
      vx,
      dy,
    } = gestureState;
    const {
      velocityThreshold,
      directionalOffsetThreshold,
    } = this._swipeConfig;
    return this._isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
  }

  render() {
    const {
      children,
      ...otherProps
    } = this.props;
    return (
      <View {...otherProps} {...this._panResponder.panHandlers}>
        { children }
      </View>
    );
  }
}

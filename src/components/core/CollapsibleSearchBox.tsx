import React from 'react';
import { throttle } from 'lodash';
import { Animated, NativeSyntheticEvent, NativeScrollEvent, StyleSheet, View, Platform } from 'react-native';

import SearchBox, { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import { m, s, xs } from '@styles/space';

export interface SearchOptions {
  controls: React.ReactNode;
  height: number;
}

interface OwnProps {
  prompt: string;
  advancedOptions?: SearchOptions;
  searchTerm: string;
  onSearchChange: (text: string) => void;
  children: (
    handleScroll: (...args: any[]) => void,
  ) => React.ReactNode;
}

interface State {
  visible: boolean;
  advancedOpen: boolean;
  scrollAnim: Animated.Value;
  advancedToggleAnim: Animated.Value;
}

const SCROLL_DISTANCE_BUFFER = 50;
type Props = OwnProps & DimensionsProps;

class CollapsibleSearchBox extends React.Component<Props, State> {
  static contextType = StyleContext;
  context!: StyleContextType;

  state: State = {
    visible: true,
    advancedOpen: false,
    scrollAnim: new Animated.Value(1),
    advancedToggleAnim: new Animated.Value(0),
  };

  _handleScroll!: (...args: any[]) => void;
  lastOffsetY: number = 0;
  scrollY = new Animated.Value(0);

  constructor(props: Props) {
    super(props);

    this._handleScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
      {
        listener: this._onScroll,
        useNativeDriver: false,
      },
    );
  }

  _onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // Dispatch the throttle event to handle hiding/showing stuff on transition.
    this._throttledScroll(offsetY);
  };

  /**
   * This is the throttle scrollEvent, throttled so we check it slightly
   * less often and are able to make decisions about whether we update
   * the stored scrollY or not.
   */
  _throttledScroll = throttle(
    (offsetY: number) => {
      if (offsetY <= 0) {
        this._showHeader();
      } else {
        const delta = Math.abs(offsetY - this.lastOffsetY);
        if (delta < SCROLL_DISTANCE_BUFFER) {
          // Not a long enough scroll, don't update scrollY and don't take any
          // action at all.
          return;
        }

        // We have a decent sized scroll so we will make a direction based
        // show/hide decision UNLESS we are near the top/bottom of the content.
        const scrollingUp = offsetY < this.lastOffsetY;

        if (scrollingUp) {
          this._showHeader();
        } else {
          this._hideHeader();
        }
        this.lastOffsetY = offsetY;
      }
    },
    250,
    { trailing: true }
  );

  _showHeader = () => {
    if (!this.state.visible) {
      this.animateScroll(true);
    }
  };

  _hideHeader = () => {
    const { searchTerm } = this.props;
    const {
      visible,
    } = this.state;
    if (visible && searchTerm === '') {
      this.animateScroll(false);
    }
  }

  animateScroll(visible: boolean) {
    const { scrollAnim, advancedOpen } = this.state;
    if (!advancedOpen) {
      scrollAnim.stopAnimation(() => {
        Animated.timing(scrollAnim, {
          toValue: visible ? 1 : 0,
          duration: 350,
          useNativeDriver: false,
        }).start();
      });
      this.setState({
        visible,
      });
    }
  }

  _toggleAdvanced = () => {
    const {
      advancedToggleAnim,
      advancedOpen,
    } = this.state;

    advancedToggleAnim.stopAnimation(() => {
      Animated.timing(advancedToggleAnim, {
        toValue: !advancedOpen ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });
    this.setState({
      advancedOpen: !advancedOpen,
    });
  };

  renderAdvancedOptions() {
    const { advancedOptions, width } = this.props;
    const { advancedToggleAnim } = this.state;
    const { colors } = this.context;
    if (!advancedOptions) {
      return null;
    }
    const controlHeight = advancedToggleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-(SEARCH_BAR_HEIGHT + advancedOptions.height), SEARCH_BAR_HEIGHT],
    });
    return (
      <Animated.View style={[
        styles.advancedOptions,
        {
          backgroundColor: colors.L20,
          width,
          height: advancedOptions.height,
          transform: [{ translateY: controlHeight }],
        },
      ]}>
        <View style={[styles.textSearchOptions, {
          height: advancedOptions.height,
        }]}>
          { advancedOptions.controls }
        </View>
      </Animated.View>
    );
  }

  render() {
    const { advancedOptions, children, prompt, searchTerm, onSearchChange, width } = this.props;
    const { advancedOpen, scrollAnim } = this.state;
    const { backgroundStyle, borderStyle } = this.context;
    const scrollY = advancedOpen ? 0 : scrollAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-SEARCH_BAR_HEIGHT, 0],
    });
    return (
      <View style={[styles.wrapper, backgroundStyle]}>
        <View style={[styles.container, backgroundStyle, borderStyle]}>
          { children(this._handleScroll) }
        </View>
        { advancedOpen && !!advancedOptions && Platform.OS === 'android' && (
          <View style={[
            styles.slider,
            {
              top: 0,
              width,
              height: SEARCH_BAR_HEIGHT + advancedOptions.height,
              backgroundColor: 'transparent',
            }
          ]} />
        ) }
        <Animated.View style={[
          styles.slider,
          backgroundStyle,
          {
            width,
            transform: [{ translateY: scrollY }],
            height: SEARCH_BAR_HEIGHT,
            zIndex: 2,
          },
        ]}>
          { this.renderAdvancedOptions() }
          <View style={[styles.fixed, { width }]}>
            <SearchBox
              onChangeText={onSearchChange}
              placeholder={prompt}
              advancedOpen={advancedOpen}
              toggleAdvanced={advancedOptions ? this._toggleAdvanced : undefined}
              value={searchTerm}
            />
          </View>
        </Animated.View>
      </View>
    );
  }
}

export default withDimensions(CollapsibleSearchBox);


const styles = StyleSheet.create({
  textSearchOptions: {
    paddingLeft: xs,
    paddingRight: m + s,
    paddingBottom: xs,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  slider: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  fixed: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  wrapper: {
    position: 'relative',
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  advancedOptions: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    flexDirection: 'column',
  },
});

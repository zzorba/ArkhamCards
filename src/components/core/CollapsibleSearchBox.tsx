import React from 'react';
import { throttle } from 'lodash';
import { Animated, NativeSyntheticEvent, NativeScrollEvent, StyleSheet, View } from 'react-native';
import SearchBox, { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import COLORS from '@styles/colors';

interface Props {
  prompt: string;
  advancedOptions?: React.ReactNode;
  searchTerm: string;
  onSearchChange: (text: string) => void;
  children: (
    handleScroll: (...args: any[]) => void,
  ) => React.ReactNode;
}

interface State {
  visible: boolean;
  advancedOpen: boolean;
  anim: Animated.Value;
}

export const SEARCH_OPTIONS_HEIGHT = 44;
const SCROLL_DISTANCE_BUFFER = 50;

export default class CollapsibleSearchBox extends React.Component<Props, State> {
  state: State = {
    visible: true,
    advancedOpen: false,
    anim: new Animated.Value(SEARCH_BAR_HEIGHT),
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
      this.animate(true);
    }
  };

  _hideHeader = () => {
    const { searchTerm } = this.props;
    const {
      visible,
    } = this.state;
    if (visible && searchTerm === '') {
      this.animate(false);
    }
  }

  animate(visible: boolean) {
    const { anim, advancedOpen } = this.state;
    const height = SEARCH_BAR_HEIGHT + (advancedOpen ? SEARCH_OPTIONS_HEIGHT : 0);
    anim.stopAnimation(() => {
      Animated.timing(anim, {
        toValue: visible ? height : 0,
        duration: 350,
        useNativeDriver: false,
      }).start();
    });
    this.setState({
      visible,
    });
  }

  _toggleAdvanced = () => {
    const {
      anim,
      advancedOpen,
    } = this.state;

    anim.stopAnimation(() => {
      Animated.timing(anim, {
        toValue: SEARCH_BAR_HEIGHT + (!advancedOpen ? SEARCH_OPTIONS_HEIGHT : 0),
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
    this.setState({
      advancedOpen: !advancedOpen,
    });
  };

  render() {
    const { advancedOptions, children, prompt, searchTerm, onSearchChange } = this.props;
    const { advancedOpen, anim } = this.state;
    return (
      <View style={styles.wrapper}>
        <Animated.View style={[styles.slider, { height: anim }]}>
          <SearchBox
            onChangeText={onSearchChange}
            placeholder={prompt}
            advancedOpen={advancedOpen}
            toggleAdvanced={advancedOptions ? this._toggleAdvanced : undefined}
            value={searchTerm}
          />
          { !!advancedOptions && advancedOptions }
        </Animated.View>
        <View style={styles.container}>
          { children(this._handleScroll) }
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  slider: {
    width: '100%',
    backgroundColor: COLORS.background,
  },
  wrapper: {
    position: 'relative',
    backgroundColor: COLORS.background,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
});

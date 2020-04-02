import React from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import { t } from 'ttag';

import SearchBox, { SEARCH_BAR_HEIGHT } from 'components/core/SearchBox';

export const SEARCH_OPTIONS_HEIGHT = 44;

interface Props {
  value?: string;
  visible: boolean;
  onChangeText: (search: string) => void;
}

interface State {
  anim: Animated.Value;
  advancedOpen: boolean;
}

export default class InvestigatorSearchBox extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      anim: new Animated.Value(props.visible ? SEARCH_BAR_HEIGHT : 0),
      advancedOpen: false,
    };
  }

  _onChangeText = (search: string) => {
    this.props.onChangeText(search);
  };

  toggleAdvanced() {
    const {
      anim,
      advancedOpen,
    } = this.state;

    anim.stopAnimation(() => {
      Animated.timing(anim, {
        toValue: SEARCH_BAR_HEIGHT + (!advancedOpen ? SEARCH_OPTIONS_HEIGHT : 0),
        duration: 200,
        easing: Easing.in(Easing.ease),
      }).start();
    });
    this.setState({
      advancedOpen: !advancedOpen,
    });
  }

  componentDidUpdate(prevProps: Props) {
    const {
      visible,
    } = this.props;
    const {
      anim,
    } = this.state;
    if (visible !== prevProps.visible) {
      const height = SEARCH_BAR_HEIGHT;
      anim.stopAnimation(() => {
        Animated.timing(anim, {
          toValue: visible ? height : 0,
          duration: 250,
          easing: Easing.in(Easing.ease),
        }).start();
      });
    }
  }

  render() {
    const {
      anim,
    } = this.state;
    return (
      <Animated.View style={[styles.slider, { height: anim }]}>
        <SearchBox
          value={this.props.value}
          onChangeText={this._onChangeText}
          placeholder={t`Search`}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  slider: {
    width: '100%',
    backgroundColor: 'white',
  },
});

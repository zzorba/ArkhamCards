import React from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import {
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';

import L from '../../app/i18n';
import SearchBox, { SEARCH_BAR_HEIGHT } from '../SearchBox';

export const SEARCH_OPTIONS_HEIGHT = 44;

export default class InvestigatorSearchBox extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onChangeText: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      anim: new Animated.Value(props.visible ? SEARCH_BAR_HEIGHT : 0),
    };

    this._onChangeText = throttle(this.onChangeText.bind(this), 250, { trailing: true });
  }

  onChangeText(search) {
    this.props.onChangeText(search);
  }

  toggleAdvanced() {
    const {
      anim,
      advancedOpen,
    } = this.state;

    anim.stopAnimation(() => {
      Animated.timing(anim, {
        toValue: SEARCH_BAR_HEIGHT + (!advancedOpen ? SEARCH_OPTIONS_HEIGHT : 0),
        duration: 200,
        easing: Easing.easeIn,
      }).start();
    });
    this.setState({
      advancedOpen: !advancedOpen,
    });
  }

  componentDidUpdate(prevProps) {
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
          easing: Easing.easeIn,
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
          onChangeText={this._onChangeText}
          placeholder={L('Search')}
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

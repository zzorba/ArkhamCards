import React from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import L from '../../app/i18n';
import Switch from '../core/Switch';
import SearchBox, { SEARCH_BAR_HEIGHT } from '../SearchBox';

export const SEARCH_OPTIONS_HEIGHT = 44;

export default class CardSearchBox extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onChangeText: PropTypes.func.isRequired,

    searchText: PropTypes.bool.isRequired,
    searchFlavor: PropTypes.bool.isRequired,
    searchBack: PropTypes.bool.isRequired,
    toggleSearchText: PropTypes.func.isRequired,
    toggleSearchFlavor: PropTypes.func.isRequired,
    toggleSearchBack: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      anim: new Animated.Value(props.visible ? SEARCH_BAR_HEIGHT : 0),
      advancedOpen: false,
    };

    this._onChangeText = throttle(this.onChangeText.bind(this), 250, { trailing: true });
    this._toggleAdvanced = this.toggleAdvanced.bind(this);
    this._renderTextSearchOptions = this.renderTextSearchOptions.bind(this);
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

  renderToggleButton() {
    const {
      advancedOpen,
    } = this.state;
    return (
      <TouchableOpacity style={styles.toggleButton} onPress={this._toggleAdvanced}>
        <View style={styles.icon}>
          <MaterialCommunityIcons
            name={advancedOpen ? 'chevron-double-up' : 'dots-horizontal'}
            size={32}
            color="#888"
          />
        </View>
      </TouchableOpacity>
    );
  }

  renderTextSearchOptions() {
    const {
      searchText,
      searchFlavor,
      searchBack,
      toggleSearchText,
      toggleSearchFlavor,
      toggleSearchBack,
    } = this.props;
    return (
      <View style={styles.textSearchOptions}>
        <Text style={styles.searchOption}>{ L('Game\nText') }</Text>
        <Switch
          value={searchText}
          onValueChange={toggleSearchText}
        />
        <Text style={styles.searchOption}>{ L('Flavor\nText') }</Text>
        <Switch
          value={searchFlavor}
          onValueChange={toggleSearchFlavor}
        />
        <Text style={styles.searchOption}>{ L('Card\nBacks') }</Text>
        <Switch
          value={searchBack}
          onValueChange={toggleSearchBack}
        />
      </View>
    );
  }

  componentDidUpdate(prevProps) {
    const {
      visible,
    } = this.props;
    const {
      anim,
      advancedOpen,
    } = this.state;
    if (visible !== prevProps.visible) {
      const height = SEARCH_BAR_HEIGHT + (advancedOpen ? SEARCH_OPTIONS_HEIGHT : 0);
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
          placeholder={L('Search for a card')}
          sideButton={this.renderToggleButton()}
        />
        { this.renderTextSearchOptions() }
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  slider: {
    width: '100%',
    backgroundColor: 'white',
  },
  textSearchOptions: {
    paddingLeft: 4,
    paddingRight: 8,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    height: SEARCH_OPTIONS_HEIGHT,
  },
  searchOption: {
    fontFamily: 'System',
    fontSize: 12,
    marginLeft: 10,
    marginRight: 2,
  },
  toggleButton: {
    marginLeft: 8,
  },
  icon: {
    width: 32,
    height: 32,
  },
});

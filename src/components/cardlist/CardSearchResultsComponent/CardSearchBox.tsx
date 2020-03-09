import React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import Switch from 'components/core/Switch';
import SearchBox, { SEARCH_BAR_HEIGHT } from 'components/core/SearchBox';
import { isBig, s, xs } from 'styles/space';
import typography from 'styles/typography';

export const SEARCH_OPTIONS_HEIGHT = 44;

interface Props {
  visible: boolean;
  onChangeText: (search: string) => void;
  value: string;

  searchText: boolean;
  searchFlavor: boolean;
  searchBack: boolean;
  toggleSearchText: () => void;
  toggleSearchFlavor: () => void;
  toggleSearchBack: () => void;
}

interface State {
  anim: Animated.Value;
  advancedOpen: boolean;
}

export default class CardSearchBox extends React.Component<Props, State> {
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

  _toggleAdvanced = () => {
    const {
      anim,
      advancedOpen,
    } = this.state;

    anim.stopAnimation(() => {
      Animated.timing(anim, {
        toValue: SEARCH_BAR_HEIGHT + (!advancedOpen ? SEARCH_OPTIONS_HEIGHT : 0),
        duration: 200,
      }).start();
    });
    this.setState({
      advancedOpen: !advancedOpen,
    });
  };

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
        <Text style={[typography.smallLabel, styles.searchOption]}>
          { isBig ? t`Game Text` : t`Game\nText` }
        </Text>
        <Switch
          value={searchText}
          onValueChange={toggleSearchText}
        />
        <Text style={[typography.smallLabel, styles.searchOption]}>
          { isBig ? t`Flavor Text` : t`Flavor\nText` }
        </Text>
        <Switch
          value={searchFlavor}
          onValueChange={toggleSearchFlavor}
        />
        <Text style={[typography.smallLabel, styles.searchOption]}>
          { isBig ? t`Card Backs` : t`Card\nBacks` }
        </Text>
        <Switch
          value={searchBack}
          onValueChange={toggleSearchBack}
        />
      </View>
    );
  }

  componentDidUpdate(prevProps: Props) {
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
        }).start();
      });
    }
  }

  render() {
    const {
      value,
    } = this.props;
    const {
      anim,
      advancedOpen,
    } = this.state;
    return (
      <Animated.View style={[styles.slider, { height: anim }]}>
        <SearchBox
          onChangeText={this._onChangeText}
          placeholder={t`Search for a card`}
          advancedOpen={advancedOpen}
          toggleAdvanced={this._toggleAdvanced}
          value={value}
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
    paddingLeft: xs,
    paddingRight: s,
    paddingBottom: xs,
    flexDirection: 'row',
    alignItems: 'center',
    height: SEARCH_OPTIONS_HEIGHT,
  },
  searchOption: {
    marginLeft: s,
    marginRight: xs,
  },
});

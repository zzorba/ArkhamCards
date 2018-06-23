import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

const SEARCH_BAR_HEIGHT = 58;
export default class SearchBox extends React.Component {
  static propTypes = {
    onChangeText: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    focusComponent: PropTypes.node,
    focusComponentHeight: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {
      heightAnim: new Animated.Value(0),
      open: false,
    };

    this._toggleFocusComponent = this.toggleFocusComponent.bind(this);
  }

  toggleFocusComponent() {
    const {
      heightAnim,
      open,
    } = this.state;

    heightAnim.stopAnimation(() => {
      Animated.timing(heightAnim, {
        toValue: open ? 0 : 1,
        duration: 250,
        easing: Easing.easeIn,
      }).start();
    });
    this.setState({
      open: !open,
    });
  }

  render() {
    const {
      onChangeText,
      placeholder,
      focusComponent,
      focusComponentHeight,
    } = this.props;
    const {
      heightAnim,
      open,
    } = this.state;

    const containerHeight = heightAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [SEARCH_BAR_HEIGHT, SEARCH_BAR_HEIGHT + focusComponentHeight],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[
        styles.container,
        { height: containerHeight },
      ]}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            style={styles.searchInput}
            clearButtonMode="always"
            autoCorrect={false}
            onChangeText={onChangeText}
            placeholder={placeholder}
          />
          { !!focusComponent && (
            <TouchableOpacity onPress={this._toggleFocusComponent}>
              <View style={styles.icon}>
                <MaterialCommunityIcons
                  name={open ? 'chevron-double-up' : 'dots-horizontal'}
                  size={32}
                  color="#888"
                />
              </View>
            </TouchableOpacity>
          ) }
        </View>
        { focusComponent }
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  searchInputWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    height: SEARCH_BAR_HEIGHT,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontFamily: 'System',
    fontSize: 18,
    color: '#111',
    backgroundColor: '#EEE',
    borderRadius: 10,
  },
  icon: {
    marginLeft: 8,
    height: '100%',
    width: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

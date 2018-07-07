import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import typography from '../../styles/typography';

export default class AccordionChooser extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired,
    enabled: PropTypes.bool.isRequired,
    toggleName: PropTypes.string.isRequired,
    onToggleChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      heightAnim: new Animated.Value(props.enabled ? 1 : 0),
    };

    this._togglePressed = this.togglePressed.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {
      enabled,
    } = this.props;
    if (enabled !== prevProps.enabled) {
      const {
        heightAnim,
      } = this.state;
      heightAnim.stopAnimation(() => {
        Animated.timing(heightAnim, {
          toValue: enabled ? 1 : 0,
          duration: 250,
          easing: enabled ? Easing.easeIn : Easing.easeOut,
        }).start();
      });
    }
  }

  togglePressed() {
    const {
      toggleName,
      onToggleChange,
    } = this.props;
    onToggleChange(toggleName);
  }

  renderLabel() {
    const {
      label,
      enabled,
    } = this.props;
    return (
      <View style={styles.row}>
        <Text style={typography.text}>
          { label }
        </Text>
        <Switch
          value={enabled}
          onValueChange={this._togglePressed}
          onTintColor="#222222"
        />
      </View>
    );
  }

  render() {
    const {
      height,
      children,
    } = this.props;

    const containerHeight = this.state.heightAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [40, height],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View style={[styles.container, { height: containerHeight }]}>
        { this.renderLabel() }
        { children }
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  row: {
    paddingTop: 4,
    paddingLeft: 8,
    paddingRight: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

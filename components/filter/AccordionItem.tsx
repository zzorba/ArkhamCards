import React, { ReactNode } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Switch from '../core/Switch';
import typography from '../../styles/typography';

interface Props {
  label: string;
  height: number;
  children: ReactNode;
  enabled: boolean;
  toggleName: string;
  onToggleChange: (toggleName: string) => void;
}

interface State {
  heightAnim: Animated.Value;
}

export default class AccordionChooser extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      heightAnim: new Animated.Value(props.enabled ? 1 : 0),
    };
  }

  componentDidUpdate(prevProps: Props) {
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
          easing: enabled ? Easing.in(Easing.ease) : Easing.out(Easing.ease),
        }).start();
      });
    }
  }

  _togglePressed = () => {
    const {
      toggleName,
      onToggleChange,
    } = this.props;
    onToggleChange(toggleName);
  };

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
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

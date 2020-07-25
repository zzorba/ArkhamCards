import React, { Component } from 'react';
import {
  StyleSheet, Text, TextProps, TextStyle, TouchableOpacity, View, ViewProps, ViewStyle,
} from 'react-native';
import PropTypes from 'prop-types';

const style = StyleSheet.create({
  defaultContainerStyle: {
    padding: 0,
    minHeight: 50,
    backgroundColor: 'white',
    position: 'relative',
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  defaultTitleStyle: {
    flex: 0,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 16,
  },
  defaultDescriptionStyle: {
    flex: 0,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 12,
  },
  defaultRightIconWrapperStyle: {
    flex: 0,
  },
  defaultDisabledOverlayStyle: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  titleWrapper: { flex: 1, position: 'relative' },
});

interface Props {
  containerProps?: ViewProps;
  containerStyle?: ViewStyle;
  disabledOverlayStyle?: ViewStyle;
  titleProps?: TextProps;
  titleStyle?: TextStyle;
  title: string;
  descriptionProps?: TextProps;
  descriptionStyle?: TextStyle;
  description?: string;
  rightIconWrapperStyle?: ViewStyle;
  rightIcon?: React.ReactNode;
  disabled?: boolean
  onPress: () => void;
}

class SettingsButton extends Component<Props> {
  static defaultProps = {
    containerProps: {},
    containerStyle: {},
    disabledOverlayStyle: {},
    titleProps: {},
    titleStyle: {},
    descriptionProps: {},
    descriptionStyle: {},
    description: null,
    rightIconWrapperStyle: {},
    rightIcon: null,
    disabled: false,
  };

  render() {
    const {
      containerProps = {}, 
      containerStyle = {}, 
      titleProps = {}, 
      titleStyle = {}, 
      title, 
      disabled = false,
      disabledOverlayStyle = {}, 
      rightIconWrapperStyle = {}, 
      rightIcon = null,
      onPress,
      descriptionProps = {}, 
      descriptionStyle = {}, 
      description = null,
    } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        {...containerProps}
        style={[style.defaultContainerStyle, containerStyle]}
        onPress={onPress}
      >
        <View style={style.wrapper}>
          <View style={style.titleWrapper}>
            <Text
              {...titleProps}
              style={[style.defaultTitleStyle, titleStyle]}
            >
              {title}
            </Text>
            {description ? (
              <Text
                {...descriptionProps}
                style={[style.defaultDescriptionStyle, descriptionStyle]}
              >
                {description}
              </Text>
            ) : null}
          </View>
          {rightIcon ? (
            <View
              style={[style.defaultRightIconWrapperStyle, rightIconWrapperStyle]}
            >
              { rightIcon }
            </View>
          ) : null}
          {(disabled) ? (
            <View
              style={[style.defaultDisabledOverlayStyle, (disabled) ? disabledOverlayStyle : null]}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

export default SettingsButton;

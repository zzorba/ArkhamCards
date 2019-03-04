import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import typography from '../../styles/typography';

export default function Button({
  text,
  icon,
  align = 'center',
  size = 'normal',
  width,
  onPress,
  style,
  color,
  grow,
}) {
  let containerStyle = styles.centerContainer;
  switch (align) {
    case 'left': containerStyle = styles.leftContainer; break;
    case 'right': containerStyle = styles.rightContainer; break;
    default: containerStyle = styles.centerContainer; break;
  }
  let padding = 16;
  let fontWeight = '700';
  switch(size) {
    case 'small':
      fontWeight = '400';
      padding = 8;
      break;
    default:
      padding = 16;
      break;
  }
  let borderWidth = 0;
  let borderColor = null;
  let textColor = '#FFFFFF';
  let colors = ['#3093c7', '#1c5a85'];
  switch(color) {
    case 'green':
      colors = ['#107116', '#0b4f0f'];
      break;
    case 'red':
      colors = ['#cc3038', '#a3262d'];
      break;
    case 'purple':
      colors = ['#4331b9', '#2f2282'];
      break;
    case 'yellow':
      colors = ['#ec8426', '#bd6a1e'];
      break;
    case 'white':
      borderWidth = 1;
      borderColor = '#888888';
      textColor = '#222222';
      colors = ['#ffffff', '#d3d3d3'];
      break;
  }
  return (
    <View style={[containerStyle, style, grow ? { flex: 1 } : {}]}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          borderColor ? { borderRadius: 4, borderWidth, borderColor } : {},
          grow ? { flex: 1 } : {},
        ]}
      >
        <LinearGradient colors={colors} style={[
          styles.button,
          styles.row,
          width ? { width } : {},
          { paddingLeft: padding, paddingRight: padding },
          grow ? { flex: 1 } : {},
        ]}>
          { !!icon && (
            <View style={[styles.icon, text ? { marginRight: padding / 2 } : {}]}>
              { icon }
            </View>
          ) }
          { !!text && (
            <Text style={[
              typography.text,
              { fontWeight, color: textColor },
            ]}>
              { text }
            </Text>
          ) }
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

Button.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.node,
  onPress: PropTypes.func,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  size: PropTypes.oneOf(['small', 'normal']),
  style: ViewPropTypes.style,
  width: PropTypes.number,
  color: PropTypes.oneOf(['default', 'green', 'purple', 'red', 'yellow', 'white']),
  grow: PropTypes.bool,
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 4,
    marginLeft: 4,
  },
  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 8,
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 8,
  },
  centerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

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

export default function Button({ text, icon, align = 'center', onPress, style }) {
  let containerStyle = styles.centerContainer;
  switch (align) {
    case 'left': containerStyle = styles.leftContainer; break;
    case 'right': containerStyle = styles.rightContainer; break;
    default: containerStyle = styles.centerContainer; break;
  }
  return (
    <View style={[containerStyle, style]}>
      <TouchableOpacity onPress={onPress}>
        <LinearGradient colors={['#3093c7', '#1c5a85']} style={styles.button}>
          { !!icon && (
            <View style={styles.icon}>
              { icon }
            </View>
          ) }
          { !!text && (
            <Text style={[typography.text, styles.buttonText]}>
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
  onPress: PropTypes.func.isRequired,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  style: ViewPropTypes.style,
};

const styles = StyleSheet.create({
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
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
  },
});

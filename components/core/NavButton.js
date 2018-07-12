import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import typography from '../../styles/typography';

export default function NavButton({ text, onPress, indent }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[
        styles.container,
        indent ? styles.indentedContainer : styles.bottomBorder,
      ]}>
        <Text style={[styles.text, typography.text]} numberOfLines={1}>
          { text }
        </Text>
        <View style={styles.icon}>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            color="rgb(0, 122,255)"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

NavButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  indent: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 6,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  indentedContainer: {
    paddingLeft: 18,
  },
  text: {
    flex: 1,
  },
  icon: {
    width: 40,
  },
});

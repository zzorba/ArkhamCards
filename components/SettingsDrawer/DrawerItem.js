import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native';

export default function DrawerItem({ text, onPress }) {
  return (
    <View style={styles.wrapper}>
      <Button onPress={onPress} title={text} />
    </View>
  );
}

DrawerItem.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 4,
  },
});

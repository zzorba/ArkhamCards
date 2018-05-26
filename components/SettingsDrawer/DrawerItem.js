import React from 'react';
import PropTypes from 'prop-types';
import { keys } from 'lodash';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function DrawerItem({ text, onPress }) {
  return <Button onPress={onPress} title={text} />;
}

DrawerItem.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

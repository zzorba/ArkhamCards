import React from 'react';
import PropTypes from 'prop-types';
import { findIndex, flatMap, forEach, keys, map, range } from 'lodash';
import {
  Alert,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
  findNodeHandle,
} from 'react-native';
import DialogComponent from 'react-native-dialog';
import { BlurView } from 'react-native-blur';

export default function Dialog({ title, visible, viewRef, children }) {
  const blurComponentIOS = (
    <BlurView
      style={StyleSheet.absoluteFill}
      viewRef={findNodeHandle(viewRef)}
      blurType="xlight"
      blurAmount={50}
    />
  );
  return (
    <View>
      <DialogComponent.Container
        visible={visible}
        blurComponentIOS={blurComponentIOS}
      >
        <DialogComponent.Title>
          { title }
        </DialogComponent.Title>
        { children }
      </DialogComponent.Container>
    </View>
  );
}

import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
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

Dialog.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  viewRef: PropTypes.object.isRequired,
  children: PropTypes.node,
};

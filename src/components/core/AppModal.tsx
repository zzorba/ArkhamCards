import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface Props {
  children: React.ReactNode;

  alignment?: 'center' | 'bottom',
  avoidKeyboard?: boolean;
  visible: boolean;
  dismissable?: boolean;
  onDismiss?: () => void;
}
export default function AppModal({ children, avoidKeyboard, alignment, visible, dismissable, onDismiss }: Props) {
  const { darkMode } = useContext(StyleContext);
  return (
    <Modal
      avoidKeyboard={avoidKeyboard}
      isVisible={visible}
      animationIn={alignment === 'bottom' ? 'slideInUp' : 'fadeIn'}
      animationOut={alignment === 'bottom' ? 'slideOutDown' : 'fadeOut'}
      onBackdropPress={dismissable ? onDismiss : undefined}
      onBackButtonPress={dismissable ? onDismiss : undefined}
      hasBackdrop
      backdropOpacity={darkMode ? 0.75 : 0.5}
      backdropColor={darkMode ? '#444444' : '#000000'}
      style={[styles.wrapper, alignment === 'bottom' ? {
        justifyContent: 'flex-end',
        padding: s,
        paddingBottom: NOTCH_BOTTOM_PADDING + m,
      } : {
        justifyContent: 'center',
        padding: s,
      }]}
    >
      <GestureHandlerRootView>
        { children }
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
  },
});

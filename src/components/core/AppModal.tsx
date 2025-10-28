import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

import { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();
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
      style={styles.wrapper}
    >
      <GestureHandlerRootView style={ alignment === 'bottom' ? {
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'flex-end',
        padding: s,
        paddingBottom: insets.bottom + m,
      } : {
        justifyContent: 'center',
        padding: s,
      }}>
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

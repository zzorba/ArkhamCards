import React, { useCallback, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { Navigation } from 'react-native-navigation';

import { NavigationProps } from '@components/nav/types';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import AppIcon from '@icons/AppIcon';

interface ToastProps {
  message: string;
  timeout?: number
}

function Toast({ componentId, message, timeout = 3000 }: ToastProps & NavigationProps) {
  const { colors, typography, width } = useContext(StyleContext);
  const onPress = useCallback(() => {
    Navigation.dismissOverlay(componentId);
  }, [componentId]);
  useEffect(() => {
    let canceled = false;
    setTimeout(() => {
      if (!canceled) {
        Navigation.dismissOverlay(componentId);
      }
    }, timeout);
    return () => {
      canceled = true;
    };
  }, [componentId, timeout])
  return (
    <View style={[styles.root, { width }]}>
      <View style={[styles.toast, { backgroundColor: colors.D20 }]}>
        <Text style={[space.paddingSideM, typography.text, typography.inverted]}>
          {message}
        </Text>
        <TouchableOpacity
          style={space.marginSideS}
          onPress={onPress}
        >
          <AppIcon name="dismiss" size={24} color={colors.L10} />
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  root: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
    position: 'absolute',
    bottom: NOTCH_BOTTOM_PADDING,
    left: 0,
  },
  toast: {
    elevation: 2,
    flexDirection: 'row',
    height: 40,
    margin: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginLeft: 16,
  },
});

Toast.options = {
  layout: {
    componentBackgroundColor: 'transparent',
  },
  overlay: {
    interceptTouchOutside: false,
  },
};

export default Toast;

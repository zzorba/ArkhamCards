import React, { useContext } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, useWindowDimensions, ScrollView, View } from 'react-native';
import Modal from 'react-native-modal';

import NewDialogContentLine from './NewDialogContentLine';
import StyleContext from '@styles/StyleContext';
import ItemPickerLine from './ItemPickerLine';
import space, { m, s } from '@styles/space';
import AppIcon from '@icons/AppIcon';
import DeckButton from '@components/deck/controls/DeckButton';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';

interface Props {
  title: string;
  visible: boolean;
  confirm?: {
    onPress: () => void;
    loading?: boolean;
    title: string;
  };
  dismiss?: {
    onPress: () => void;
    title?: string;
  };
  children: React.ReactNode | React.ReactNode[];
  alignment?: 'center' | 'bottom',
  avoidKeyboard?: boolean;
}
function NewDialog({
  title,
  visible,
  dismiss,
  children,
  confirm,
  alignment = 'center',
  avoidKeyboard,
}: Props) {
  const { backgroundStyle, darkMode, colors, shadow, typography } = useContext(StyleContext);
  const { width } = useWindowDimensions();
  return (
    <Modal
      avoidKeyboard={avoidKeyboard}
      isVisible={visible}
      animationIn={alignment === 'bottom' ? 'slideInUp' : 'fadeIn'}
      animationOut={alignment === 'bottom' ? 'slideOutDown' : 'fadeOut'}
      onBackdropPress={dismiss?.onPress}
      onBackButtonPress={dismiss?.onPress}
      hasBackdrop
      backdropOpacity={darkMode ? 0.75 : 0.5}
      backdropColor={darkMode ? '#444444' : '#000000'}
      style={[styles.wrapper, alignment === 'bottom' ? {
        justifyContent: 'flex-end',
        padding: s,
        paddingBottom: NOTCH_BOTTOM_PADDING + m,
      } : {
        justifyContent: 'center',
        padding: m,
      }]}
    >
      <View style={[shadow.large, styles.dialog, { maxHeight: '60%', width: width - m * 2 }]}>
        <View style={[styles.header, { backgroundColor: colors.D20 }]}>
          <Text style={[typography.large, typography.inverted]}>{title}</Text>
          { !!dismiss && (
            <View style={styles.closeButton}>
              <TouchableOpacity onPress={dismiss.onPress}>
                <AppIcon
                  name="dismiss"
                  size={18}
                  color={colors.L30}
                />
              </TouchableOpacity>
            </View>
          ) }
        </View>
        <ScrollView overScrollMode="never" bounces={false} showsVerticalScrollIndicator style={[styles.body, backgroundStyle]}>
          { children }
          { (!!dismiss?.title || !!confirm) && (
            <View style={styles.actionButtons}>
              { !!dismiss?.title && (
                <View style={[styles.button, confirm ? space.marginRightXs : undefined]}>
                  <DeckButton
                    icon="dismiss"
                    color={confirm ? 'red' : undefined}
                    title={dismiss.title}
                    thin
                    onPress={dismiss.onPress}
                  />
                </View>
              )}
              { !!confirm && (
                <View style={[styles.button, dismiss?.title ? space.marginLeftXs : undefined]}>
                  <DeckButton
                    icon="check-thin"
                    title={confirm.title}
                    thin
                    onPress={confirm.onPress}
                    loading={confirm?.loading}
                  />
                </View>
              ) }
            </View>
          ) }
        </ScrollView>
      </View>
    </Modal>
  );
}

NewDialog.ContentLine = NewDialogContentLine;
NewDialog.PickerItem = ItemPickerLine;
export default NewDialog;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
  },
  dialog: Platform.select({
    default: {
      borderRadius: 8,
      shadowOpacity: 0.75,
    },
    android: {
      borderRadius: 8,
    },
  }),
  header: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: s,
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 10,
  },
  body: {
    padding: s,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  actionButtons: {
    marginTop: s,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

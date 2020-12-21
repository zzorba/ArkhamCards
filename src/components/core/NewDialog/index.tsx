import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
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
    title: string;
  };
  dismiss?: {
    onPress: () => void;
    title?: string;
  };
  children: React.ReactNode | React.ReactNode[];
  alignment?: 'center' | 'bottom',
}
function NewDialog({
  title,
  visible,
  dismiss,
  children,
  confirm,
  alignment = 'center',
}: Props) {
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  return (
    <Modal
      isVisible={visible}
      animationIn={alignment === 'bottom' ? 'slideInUp' : 'fadeIn'}
      animationOut={alignment === 'bottom' ? 'slideOutDown' : 'fadeOut'}
      onBackdropPress={dismiss?.onPress}
      onBackButtonPress={dismiss?.onPress}
      hasBackdrop
      backdropColor="#00000088"
      style={[styles.wrapper, alignment === 'bottom' ? {
        justifyContent: 'flex-end',
        padding: s,
        paddingBottom: NOTCH_BOTTOM_PADDING + m,
      } : {
        justifyContent: 'center',
        padding: m,
      }]}
    >
      <TouchableWithoutFeedback>
        <View style={styles.dialog}>
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
          <View style={[styles.body, backgroundStyle]}>
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
                    <DeckButton icon="check-thin" title={confirm.title} thin onPress={confirm.onPress} />
                  </View>
                ) }
              </View>
            ) }
          </View>
        </View>
      </TouchableWithoutFeedback>
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
  dialog: {
    width: '100%',
    borderRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.75,
  },
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

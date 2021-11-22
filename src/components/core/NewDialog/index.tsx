import React, { useContext, useMemo } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, ScrollView, View } from 'react-native';
import Modal from 'react-native-modal';
import { map } from 'lodash';

import NewDialogContentLine from './NewDialogContentLine';
import StyleContext from '@styles/StyleContext';
import ItemPickerLine from './ItemPickerLine';
import TextInputLine from './TextInputLine';
import space, { m, s } from '@styles/space';
import AppIcon from '@icons/AppIcon';
import { NOTCH_BOTTOM_PADDING, TINY_PHONE } from '@styles/sizes';
import Card from '@data/types/Card';
import CompactInvestigatorRow from '../CompactInvestigatorRow';
import LanguageContext from '@lib/i18n/LanguageContext';

interface Props {
  title: string;
  investigator?: Card;
  visible: boolean;
  dismissable?: boolean;
  onDismiss?: () => void;
  buttons?: React.ReactNode[];
  children: React.ReactNode;
  alignment?: 'center' | 'bottom',
  avoidKeyboard?: boolean;
  forceVerticalButtons?: boolean;
}
function NewDialog(props: Props) {
  const {
    title,
    investigator,
    visible,
    dismissable,
    onDismiss,
    buttons = [],
    children,
    alignment = 'center',
    avoidKeyboard,
    forceVerticalButtons,
  } = props;
  const { lang } = useContext(LanguageContext);
  const { backgroundStyle, darkMode, colors, shadow, typography, width, height } = useContext(StyleContext);
  const verticalButtons = forceVerticalButtons || buttons.length > 2 || TINY_PHONE || lang === 'de';
  const dismissButton = useMemo(() => {
    if (!dismissable) {
      return undefined;
    }
    return (
      <View style={investigator ? space.paddingRightS : styles.closeButton}>
        <TouchableOpacity onPress={onDismiss}>
          <AppIcon
            name="dismiss"
            size={18}
            color={colors.L30}
          />
        </TouchableOpacity>
      </View>
    );
  }, [dismissable, investigator, onDismiss, colors]);
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
      <View style={[
        shadow.large,
        styles.dialog,
        investigator ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 } : undefined,
        { width: width - s * 2 },
      ]}>
        { investigator ? (
          <CompactInvestigatorRow
            investigator={investigator}
            width={width - s * 2}
            open
          >
            { dismissButton }
          </CompactInvestigatorRow>
        ) : (
          <View style={[styles.header, { backgroundColor: colors.D20 }]}>
            <Text style={[typography.large, typography.inverted]}>{title}</Text>
            { dismissButton }
          </View>
        ) }
        <View style={[styles.body, backgroundStyle]}>
          <ScrollView
            overScrollMode="never"
            keyboardShouldPersistTaps="always"
            bounces={false}
            showsVerticalScrollIndicator
            style={{ maxHeight: height * 0.5 }}
            contentContainerStyle={[space.paddingTopS, space.paddingBottomS]}
          >
            { children }
          </ScrollView>
          { (buttons.length > 0) && (
            <View style={[styles.actionButtons, space.paddingBottomS, {
              flexDirection: verticalButtons ? 'column' : 'row',
            }]}>
              { map(buttons, (button, idx) => {
                return (
                  <View key={idx} style={[
                    styles.button,
                    {
                      flex: verticalButtons ? undefined : 1,
                    },
                    (idx < buttons.length - 1) ? {
                      marginRight: !verticalButtons ? s : undefined,
                      marginBottom: verticalButtons ? s : undefined,
                    } : undefined]}>
                    { button }
                  </View>
                );
              }) }
            </View>
          ) }
        </View>
      </View>
    </Modal>
  );
}

NewDialog.ContentLine = NewDialogContentLine;
NewDialog.PickerItem = ItemPickerLine;
NewDialog.TextInput = TextInputLine;
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
    paddingLeft: s,
    paddingRight: s,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: 'column',
  },
  actionButtons: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

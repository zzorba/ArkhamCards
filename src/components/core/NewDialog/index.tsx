import React, { useContext, useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { NestableScrollContainer } from 'react-native-draggable-flatlist';
import { map } from 'lodash';

import { TouchableQuickSize } from '@components/core/Touchables';
import NewDialogContentLine from './NewDialogContentLine';
import StyleContext from '@styles/StyleContext';
import ItemPickerLine from './ItemPickerLine';
import TextInputLine from './TextInputLine';
import space, { s } from '@styles/space';
import AppIcon from '@icons/AppIcon';
import { MAX_WIDTH, TINY_PHONE } from '@styles/sizes';
import Card from '@data/types/Card';
import CompactInvestigatorRow from '../CompactInvestigatorRow';
import LanguageContext from '@lib/i18n/LanguageContext';
import AppModal from '../AppModal';
import SectionHeader from './SectionHeader';
import COLORS from '@styles/colors';
import SpinnerLine from './SpinnerLine';
import LineItem from './LineItem';

interface Props {
  title: string;
  description?: string;
  investigator?: Card;
  visible: boolean;
  dismissable?: boolean;
  onDismiss?: () => void;
  buttons?: React.ReactNode[];
  children: React.ReactNode;
  alignment?: 'center' | 'bottom',
  avoidKeyboard?: boolean;
  forceVerticalButtons?: boolean;
  maxHeightPercent?: number;
  noPadding?: boolean;
  backgroundColor?: string;
  noScroll?: boolean;
}
function NewDialog(props: Props) {
  const {
    title,
    description,
    investigator,
    visible,
    dismissable,
    onDismiss,
    buttons = [],
    children,
    alignment = 'center',
    avoidKeyboard,
    forceVerticalButtons,
    maxHeightPercent = 0.5,
    noPadding,
    backgroundColor,
    noScroll,
  } = props;
  const { lang } = useContext(LanguageContext);
  const { backgroundStyle, colors, shadow, typography, width, height } = useContext(StyleContext);
  const verticalButtons = forceVerticalButtons || buttons.length > 2 || TINY_PHONE || lang === 'de';
  const dismissButton = useMemo(() => {
    if (!dismissable) {
      return undefined;
    }
    return (
      <View style={investigator ? space.paddingRightS : styles.closeButton}>
        <TouchableQuickSize onPress={onDismiss}>
          <AppIcon
            name="dismiss"
            size={18}
            color={investigator ? COLORS.white : colors.L30}
          />
        </TouchableQuickSize>
      </View>
    );
  }, [dismissable, investigator, onDismiss, colors]);
  return (
    <AppModal
      avoidKeyboard={avoidKeyboard}
      visible={visible}
      alignment={alignment}
      dismissable={dismissable}
      onDismiss={onDismiss}
    >
      <View style={[
        shadow.large,
        styles.dialog,
        { maxWidth: MAX_WIDTH },
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
          <View style={[styles.header, { backgroundColor: backgroundColor || colors.D20 }]}>
            <View style={styles.columnCenter}>
              <Text style={[typography.large, backgroundColor ? typography.white : typography.inverted]}>{title}</Text>
              { !!description && <Text style={[space.paddingTopXs, typography.small, backgroundColor ? typography.white : typography.invertedLight]}>{description}</Text> }
            </View>
            { dismissButton }
          </View>
        ) }
        <View style={[styles.body, noPadding ? undefined : space.paddingSideS, backgroundStyle]}>
          { noScroll ? (
            <View style={[{ maxHeight: height * maxHeightPercent }, noPadding ? undefined : [space.paddingTopS, space.paddingBottomS]]}>
              { children }
            </View>
          ) : (
            <NestableScrollContainer
              overScrollMode="never"
              keyboardShouldPersistTaps="always"
              bounces={false}
              showsVerticalScrollIndicator
              style={{ maxHeight: height * maxHeightPercent }}
              contentContainerStyle={noPadding ? undefined : [space.paddingTopS, space.paddingBottomS]}
            >
              { children }
            </NestableScrollContainer>
          ) }
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
    </AppModal>
  );
}

NewDialog.SectionHeader = SectionHeader;
NewDialog.ContentLine = NewDialogContentLine;
NewDialog.PickerItem = ItemPickerLine;
NewDialog.LineItem = LineItem;
NewDialog.TextInput = TextInputLine;
NewDialog.SpinnerLine = SpinnerLine;
export default NewDialog;

const styles = StyleSheet.create({
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
  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import ActionButton from 'react-native-action-button';

import StyleContext, { StyleContextType } from '@styles/StyleContext';
import { useComponentDidDisappear, useFlag, useKeyboardHeight, useTabooSetId } from '@components/core/hooks';
import { useDeckEditState, useParsedDeck } from './hooks';
import CardTextComponent from '@components/card/CardTextComponent';
import space, { s, xs } from '@styles/space';
import { openUrl } from '@components/nav/helper';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import { NavigationProps } from '@components/nav/types';
import AppIcon from '@icons/AppIcon';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import { setDeckDescription } from './actions';
import DeckNavFooter from '@components/deck/DeckNavFooter';
import { DeckId } from '@actions/types';

export interface DeckDescriptionProps {
  id: DeckId;
}

type Props = DeckDescriptionProps & NavigationProps;

export default function DeckDescriptionView({ id, componentId }: Props) {
  const { db } = useContext(DatabaseContext);
  const { backgroundStyle, colors, shadow, typography } = useContext(StyleContext);
  const textInputRef = useRef<TextInput>(null);
  const dispatch = useDispatch();
  const tabooSetId = useTabooSetId();
  const parsedDeckObj = useParsedDeck(id, componentId);
  const { mode } = useDeckEditState(parsedDeckObj);
  const { deck, deckEdits, parsedDeck } = parsedDeckObj;
  const factionColor = useMemo(() => colors.faction[parsedDeck?.investigator.factionCode() || 'neutral'].background, [parsedDeck, colors.faction]);
  const [description, setDescription] = useState(deckEdits?.descriptionChange || deck?.description_md || '');
  useEffect(() => {
    setDescription(deckEdits?.descriptionChange || deck?.description_md || '');
  }, [deck, deckEdits]);
  const [edit, toggleEdit] = useFlag(false);
  const linkPressed = useCallback(async(url: string, context: StyleContextType) => {
    await openUrl(url, context, db, componentId, tabooSetId);
  }, [componentId, tabooSetId, db]);
  const fabIcon = useCallback(() => (
    <AppIcon name={edit ? 'check' : 'edit'} color={mode === 'view' && !edit ? '#FFFFFF' : colors.L30} size={24} />
  ), [edit, colors, mode]);
  const saveChanges = useCallback(() => {
    dispatch(setDeckDescription(id, description));
    toggleEdit();
  }, [dispatch, id, description, toggleEdit]);
  const backPressed = useCallback(() => {
    if (edit) {
      dispatch(setDeckDescription(id, description));
    }
    Navigation.pop(componentId);
  }, [edit, id, description, dispatch, componentId]);
  useComponentDidDisappear(() => {
    if (edit) {
      dispatch(setDeckDescription(id, description));
    }
  }, componentId, [edit, id, description]);
  const hasDescriptionChange = description !== (deck?.description_md || '');
  const [keyboardHeight] = useKeyboardHeight();
  const onEdit = useCallback(() => {
    toggleEdit();
    if (Platform.OS === 'android') {
      setTimeout(() => {
        textInputRef.current && textInputRef.current.focus();
      }, 500);
    }
  }, [toggleEdit, textInputRef]);
  const fab = useMemo(() => {
    return (
      <ActionButton
        buttonColor={mode === 'view' && !edit ? factionColor : colors.D20}
        renderIcon={fabIcon}
        onPress={edit ? saveChanges : onEdit}
        offsetX={s + xs}
        offsetY={((Platform.OS === 'ios' ? keyboardHeight : 0) || NOTCH_BOTTOM_PADDING) + s + xs}
        shadowStyle={shadow.large}
        fixNativeFeedbackRadius
      />
    );
  }, [shadow, edit, fabIcon, onEdit, saveChanges, colors, mode, factionColor, keyboardHeight]);
  return (
    <View style={styles.wrapper}>
      { edit ? (
        <SafeAreaView style={[styles.wrapper, backgroundStyle]}>
          <TextInput
            value={description}
            ref={textInputRef}
            onChangeText={setDescription}
            autoFocus={Platform.OS === 'ios'}
            style={[space.paddingM, typography.text]}
            placeholderTextColor={colors.lightText}
            multiline
          />
        </SafeAreaView>
      ) : (
        <ScrollView contentContainerStyle={backgroundStyle} style={space.paddingM}>
          { !!deck && <CardTextComponent text={description} onLinkPress={linkPressed} /> }
        </ScrollView>
      ) }
      { (mode === 'edit' || hasDescriptionChange || edit) && (
        <DeckNavFooter
          deckId={id}
          componentId={componentId}
          forceShow
          control="fab"
          onPress={backPressed}
          yOffset={Platform.OS === 'ios' ? keyboardHeight : undefined} />
      ) }
      { !!deckEdits?.editable && fab }
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },
});

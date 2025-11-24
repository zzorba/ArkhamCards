import React, { useCallback, useContext, useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';
import { getDeckScreenOptions, openUrl } from '@components/nav/helper';


import StyleContext from '@styles/StyleContext';
import { useComponentDidDisappear, useFlag, useKeyboardHeight, useTabooSetId } from '@components/core/hooks';
import { useDeckEditState, useParsedDeck } from './hooks';
import CardTextComponent from '@components/card/CardTextComponent';
import space, { s, xs } from '@styles/space';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import AppIcon from '@icons/AppIcon';
import { setDeckDescription } from './actions';
import DeckNavFooter from '@components/deck/DeckNavFooter';
import { DeckId } from '@actions/types';
import SimpleFab from '@components/core/SimpleFab';
import { t } from 'ttag';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface DeckDescriptionProps {
  id: DeckId;
  headerBackgroundColor: string | undefined;
}

export default function DeckDescriptionView() {
  const route = useRoute<RouteProp<RootStackParamList, 'Deck.Description'>>();
  const navigation = useNavigation();
  const { id } = route.params;
  const { db } = useContext(DatabaseContext);
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const textInputRef = useRef<TextInput>(null);
  const dispatch = useDispatch();
  const tabooSetId = useTabooSetId();
  const parsedDeckObj = useParsedDeck(id);
  const { mode } = useDeckEditState(parsedDeckObj);
  const { deck, deckEdits, parsedDeck } = parsedDeckObj;
  const factionColor = useMemo(() => colors.faction[parsedDeck?.faction ?? 'neutral'].background, [parsedDeck, colors.faction]);
  const descriptionValue = useMemo(
    () => deckEdits?.descriptionChange || deck?.description_md || '',
    [deckEdits?.descriptionChange, deck?.description_md]
  );
  const [description, setDescription] = useState(descriptionValue);
  useEffect(() => {
    setDescription(descriptionValue);
  }, [descriptionValue]);
  const [edit, toggleEdit] = useFlag(false);

  useLayoutEffect(() => {
    if (parsedDeck) {
      const screenOptions = getDeckScreenOptions(
        colors,
        { title: t`Notes` },
        parsedDeck.investigator.front
      );
      navigation.setOptions(screenOptions);
    }
  }, [navigation, colors, parsedDeck]);

  const linkPressed = useCallback(async(url: string) => {
    await openUrl(navigation, url, db, colors, tabooSetId);
  }, [navigation, tabooSetId, db, colors]);
  const fabIcon = useMemo(() => (
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
    navigation.goBack();
  }, [edit, id, description, dispatch, navigation]);
  useComponentDidDisappear(() => {
    if (edit) {
      dispatch(setDeckDescription(id, description));
    }
  }, [edit, id, description]);
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
  const insets = useSafeAreaInsets();
  const fab = useMemo(() => {
    return (
      <SimpleFab
        color={mode === 'view' && !edit ? factionColor : colors.D20}
        icon={fabIcon}
        onPress={edit ? saveChanges : onEdit}
        position="right"
        accessiblityLabel={t`Edit`}
        offsetX={s + xs}
        offsetY={(Platform.OS === 'ios' ? keyboardHeight : 0) + insets.bottom + s + xs}
      />
    );
  }, [edit, fabIcon, onEdit, saveChanges, colors, mode, factionColor, insets, keyboardHeight]);
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

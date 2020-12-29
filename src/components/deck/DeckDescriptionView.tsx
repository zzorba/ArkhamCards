import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
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
import { useFlag, useTabooSetId } from '@components/core/hooks';
import { useDeckEditState, useParsedDeck } from './hooks';
import CardTextComponent from '@components/card/CardTextComponent';
import space, { s, xs } from '@styles/space';
import { openUrl } from '@components/nav/helper';
import DatabaseContext from '@data/DatabaseContext';
import { NavigationProps } from '@components/nav/types';
import AppIcon from '@icons/AppIcon';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import { setDeckDescription } from './actions';
import DeckNavFooter from '@components/deck/DeckNavFooter';

export interface DeckDescriptionProps {
  id: number;
}

type Props = DeckDescriptionProps & NavigationProps;

export default function DeckDescriptionView({ id, componentId }: Props) {
  const { db } = useContext(DatabaseContext);
  const { backgroundStyle, colors, shadow } = useContext(StyleContext);
  const dispatch = useDispatch();
  const tabooSetId = useTabooSetId();
  const parsedDeckObj = useParsedDeck(id, 'DeckDescription', componentId);
  const { mode } = useDeckEditState(parsedDeckObj);
  const { deck, deckEdits, parsedDeck, editable } = parsedDeckObj;
  const factionColor = useMemo(() => colors.faction[parsedDeck?.investigator.factionCode() || 'neutral'].background, [parsedDeck, colors.faction]);
  const [description, setDescription] = useState(deckEdits?.descriptionChange || deck?.description_md || '');
  useEffect(() => {
    setDescription(deckEdits?.descriptionChange || deck?.description_md || '');
  }, [deck, deckEdits]);
  const [edit, toggleEdit] = useFlag(false);
  const linkPressed = useCallback(async(url: string, context: StyleContextType) => {
    await openUrl(url, context, db, componentId, tabooSetId);
  }, [componentId, tabooSetId, db]);
  const fabIcon = useCallback(() => <AppIcon name={edit ? 'check' : 'edit'} color={colors.L30} size={24} />, [edit, colors]);
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
  const hasDescriptionChange = description !== (deck?.description_md || '');
  const fab = useMemo(() => {
    return (
      <ActionButton
        buttonColor={mode === 'view' && !edit ? factionColor : colors.D20}
        renderIcon={fabIcon}
        onPress={edit ? saveChanges : toggleEdit}
        offsetX={s + xs}
        offsetY={NOTCH_BOTTOM_PADDING + s + xs}
        shadowStyle={shadow.large}
        fixNativeFeedbackRadius
      />
    );
  }, [shadow, edit, fabIcon, toggleEdit, saveChanges, colors, mode, factionColor]);
  return (
    <View style={styles.wrapper}>
      { edit ? (
        <SafeAreaView style={[styles.wrapper, backgroundStyle]}>
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={space.paddingM}
            multiline
          />
        </SafeAreaView>
      ) : (
        <ScrollView contentContainerStyle={backgroundStyle} style={space.paddingM}>
          { !!deck && <CardTextComponent text={description} onLinkPress={linkPressed} /> }
        </ScrollView>
      ) }
      { (mode === 'edit' || hasDescriptionChange || edit) && (
        <DeckNavFooter deckId={id} componentId={componentId} forceShow control="fab" onPress={backPressed} />
      ) }
      { !!editable && fab }
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },
});

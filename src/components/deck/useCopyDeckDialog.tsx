import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { find, flatMap, keys, throttle, uniq } from 'lodash';
import { Action } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { NetInfoStateType } from '@react-native-community/netinfo';
import { t } from 'ttag';

import { saveClonedDeck } from './actions';
import { showDeckModal } from '@components/nav/helper';
import useNetworkStatus from '@components/core/useNetworkStatus';
import { login } from '@actions';
import { Deck, DeckId, getDeckId } from '@actions/types';
import NewDialog from '@components/core/NewDialog';
import { parseBasicDeck } from '@lib/parseDeck';
import { makeBaseDeckSelector, makeLatestDeckSelector, AppState } from '@reducers';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useDeck } from '@data/hooks';
import { useEffectUpdate, usePlayerCardsFunc } from '@components/core/hooks';
import { ThunkDispatch } from 'redux-thunk';
import { CUSTOM_INVESTIGATOR } from '@app_constants';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { DeckActions } from '@data/remote/decks';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import useSingleCard from '@components/card/useSingleCard';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { useDialog } from './dialogs';

interface SelectDeckSwitchPropsProps {
  deckId: DeckId;
  label: string;
  value: boolean;
  onValueChange: (deckId: DeckId, value: boolean) => void;
}

function SelectDeckSwitch({ deckId, label, value, onValueChange }: SelectDeckSwitchPropsProps) {
  const handleOnValueChange = useCallback((value: boolean) => {
    onValueChange(deckId, value);
  }, [onValueChange, deckId]);

  return (
    <NewDialog.ContentLine
      hideIcon
      text={label}
      paddingBottom={s}
      control={(
        <ArkhamSwitch
          value={value}
          onValueChange={handleOnValueChange}
        />
      )}
    />
  );
}

interface Props {
  campaign: MiniCampaignT | undefined;
  deckId?: DeckId;
  signedIn?: boolean;
  actions: DeckActions;
}

type DeckDispatch = ThunkDispatch<AppState, unknown, Action<string>>;

// TODO: remote decks
export default function useCopyDeckDialog({ campaign, deckId, signedIn, actions }: Props): [React.ReactNode, () => void] {
  const { colors, typography } = useContext(StyleContext);
  const { userId } = useContext(ArkhamCardsAuthContext);
  const [{ isConnected, networkType }, refreshNetworkStatus] = useNetworkStatus();
  const dispatch: DeckDispatch = useDispatch();
  const deck = useDeck(deckId);
  const baseDeckSelector = useMemo(makeBaseDeckSelector, []);
  const baseDeck = useSelector((state: AppState) => baseDeckSelector(state, deckId));
  const latestDeckSelector = useMemo(makeLatestDeckSelector, []);
  const latestDeck = useSelector((state: AppState) => latestDeckSelector(state, deckId));
  const [saving, setSaving] = useState(false);
  const [deckName, setDeckName] = useState<string | undefined>();
  const isCustomContent = useMemo(() =>!!(
    deck?.deck.investigator_code === CUSTOM_INVESTIGATOR ||
    deck?.deck.investigator_code.startsWith('z') ||
    (deck && find([...keys(deck.deck.slots), ...keys(deck.deck.sideSlots), ...keys(deck.deck.ignoreDeckLimitSlots)], code => code.startsWith('z')))
  ), [deck]);
  const [offlineDeck, setOfflineDeck] = useState(!!(deck && deck.deck.local));
  const [selectedDeckId, setSelectedDeckId] = useState(deckId);
  const [error, setError] = useState<string | undefined>();

  const resetForm = useCallback(() => {
    setSaving(false);
    setSelectedDeckId(deckId);
    setDeckName(deck ? deck.name : undefined);
  }, [setSaving, setSelectedDeckId, setDeckName, deck, deckId]);

  useEffectUpdate(() => {
    if (deckId !== undefined) {
      resetForm();
    }
  }, [deckId]);
  const onDeckTypeChange = useCallback((value: boolean) => {
    if (value && !signedIn) {
      dispatch(login());
    }
    setOfflineDeck(!value);
  }, [dispatch, signedIn, setOfflineDeck]);

  const selectedDeck: Deck | undefined = useMemo(() => {
    if (baseDeck && getDeckId(baseDeck).uuid === selectedDeckId?.uuid) {
      return baseDeck;
    }
    if (latestDeck && getDeckId(latestDeck).uuid === selectedDeckId?.uuid) {
      return latestDeck;
    }
    return deck?.deck;
  }, [baseDeck, deck, latestDeck, selectedDeckId]);
  const [investigator] = useSingleCard(deck?.deck.investigator_code, 'player', deck?.deck.taboo_id);

  const showNewDeck = useCallback((deck: Deck) => {
    setSaving(false);
    // Change the deck options for required cards, if present.
    showDeckModal(getDeckId(deck), deck, campaign?.id, colors, investigator);
  }, [campaign, investigator, setSaving, colors]);
  const saveCopy = useCallback((isRetry: boolean) => {
    if (!selectedDeck) {
      return;
    }
    if (investigator && (!saving || isRetry)) {
      setSaving(true);
      const local = (offlineDeck || !signedIn || !isConnected || networkType === NetInfoStateType.none || isCustomContent);
      dispatch(saveClonedDeck(userId, actions, local, selectedDeck, deckName || t`New Deck`)).then(
        showNewDeck,
        (err) => {
          setSaving(false);
          setError(err.message);
        }
      );
    }
  }, [signedIn, actions, isConnected, networkType, userId, isCustomContent,
    deckName, offlineDeck, selectedDeck, saving, investigator,
    dispatch, setSaving, setError, showNewDeck]);
  const onOkayPress = useMemo(() => throttle(() => saveCopy(false), 200), [saveCopy]);

  const onDeckNameChange = useCallback((value: string) => {
    setDeckName(value);
  }, [setDeckName]);

  const selectedDeckIdChanged = useCallback((deckId: DeckId, value: boolean) => {
    setSelectedDeckId(value ? deckId : undefined);
  }, [setSelectedDeckId]);

  const [cards] = usePlayerCardsFunc(() => uniq(
    flatMap([
      ...(deck?.deck ? [deck.deck] : []),
      ...(baseDeck ? [baseDeck] : []),
      ...(latestDeck ? [latestDeck] : []),
    ], d => [
      d.investigator_code,
      ...keys(d.slots),
      ...keys(d.ignoreDeckLimitSlots),
      ...keys(d.slots),
    ])
  ), [deck, baseDeck, latestDeck], deck?.deck.taboo_id || 0);
  const parsedCurrentDeck = useMemo(() => cards && deck && parseBasicDeck(deck?.deck, cards), [cards, deck]);
  const parsedBaseDeck = useMemo(() => cards && baseDeck && parseBasicDeck(baseDeck, cards), [cards, baseDeck]);
  const parsedLatestDeck = useMemo(() => cards && latestDeck && parseBasicDeck(latestDeck, cards), [cards, latestDeck]);

  const deckSelector = useMemo(() => {
    if (parsedCurrentDeck && !parsedBaseDeck && !parsedLatestDeck) {
      // Only one deck, no need to show a selector.
      return null;
    }
    return (
      <>
        <NewDialog.SectionHeader text={t`Version to copy`} paddingTop={s} />
        { parsedBaseDeck?.id ? (
          <SelectDeckSwitch
            deckId={parsedBaseDeck.id}
            label={t`Base Version\n${parsedBaseDeck.experience} XP`}
            value={selectedDeckId?.uuid === parsedBaseDeck.id.uuid}
            onValueChange={selectedDeckIdChanged}
          />
        ) : null }
        { parsedCurrentDeck?.id && parsedCurrentDeck.deck ? (
          <SelectDeckSwitch
            deckId={parsedCurrentDeck.id}
            label={t`Current Version ${parsedCurrentDeck.deck.version}\n${parsedCurrentDeck.experience} XP`}
            value={selectedDeckId?.uuid === parsedCurrentDeck.id.uuid}
            onValueChange={selectedDeckIdChanged}
          />
        ) : null }
        { parsedLatestDeck?.id && parsedLatestDeck.deck ? (
          <SelectDeckSwitch
            deckId={parsedLatestDeck.id}
            label={t`Latest Version ${parsedLatestDeck.deck.version}\n${parsedLatestDeck.experience} XP`}
            value={selectedDeckId?.uuid === parsedLatestDeck.id.uuid}
            onValueChange={selectedDeckIdChanged}
          />
        ) : null }
      </>
    );
  }, [parsedBaseDeck, parsedCurrentDeck, parsedLatestDeck, selectedDeckId, selectedDeckIdChanged]);

  const formContent = useMemo(() => {
    if (saving) {
      return (
        <>
          <NewDialog.SectionHeader
            text={t`Saving`}
          />
          <ActivityIndicator
            style={styles.spinner}
            color={colors.lightText}
            size="large"
            animating
          />
        </>
      );
    }
    return (
      <>
        <NewDialog.SectionHeader
          text={t`Make a copy of a deck so that you can use it in a different campaign or choose different upgrades.`}
        />
        <View style={space.paddingBottomS}>
          <NewDialog.ContentLine
            text={t`New Name`}
            paddingBottom={s}
            control={null}
            hideIcon
          />
          <NewDialog.TextInput
            value={deckName || ''}
            placeholder={t`Required`}
            onChangeText={onDeckNameChange}
            returnKeyType="done"
          />
        </View>
        { deckSelector }
        <NewDialog.SectionHeader text={t`Deck Type`} paddingTop={s} />
        <NewDialog.ContentLine
          icon="arkhamdb"
          text={t`Create on ArkhamDB`}
          paddingBottom={s}
          control={
            <ArkhamSwitch
              value={!offlineDeck && !!signedIn && isConnected && networkType !== NetInfoStateType.none && !isCustomContent}
              disabled={isCustomContent || !isConnected || networkType === NetInfoStateType.none}
              onValueChange={onDeckTypeChange}
            />
          }
        />
        { !!isCustomContent && (
          <NewDialog.ContentLine
            hideIcon
            text={t`Note: this deck cannot be uploaded to ArkhamDB because it contains fan-made content.`}
            control={null}
            paddingBottom={s}
          />
        ) }
        { (!isConnected || networkType === NetInfoStateType.none) && (
          <TouchableOpacity onPress={refreshNetworkStatus}>
            <NewDialog.ContentLine
              icon="error"
              text={t`You seem to be offline. Refresh Network?`}
              control={null} />
          </TouchableOpacity>
        ) }
        { !!error && (
          <Text style={[typography.text, typography.center, styles.error, space.marginBottomS]}>
            { error }
          </Text>
        ) }
      </>
    );
  }, [signedIn, isCustomContent, networkType, isConnected, colors, typography, saving, deckName, offlineDeck, error, onDeckNameChange, refreshNetworkStatus, onDeckTypeChange, deckSelector]);
  const { dialog, showDialog } = useDialog({
    title: t`Clone deck`,
    content: formContent,
    allowDismiss: true,
    confirm: {
      onPress: onOkayPress,
      disabled: selectedDeckId === null,
      title: t`Clone deck`,
      loading: saving,
    },
    dismiss: {
      title: t`Cancel`,
    },
  });
  return [dialog, showDialog];
}

const styles = StyleSheet.create({
  spinner: {
    height: 80,
  },
  error: {
    color: 'red',
  },
});

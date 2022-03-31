import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { find, flatMap, keys, throttle, uniq } from 'lodash';
import { Action } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import DialogComponent from '@lib/react-native-dialog';
import { NetInfoStateType } from '@react-native-community/netinfo';
import { t } from 'ttag';

import SelectDeckSwitch from './SelectDeckSwitch';
import { saveClonedDeck } from '../actions';
import { showDeckModal } from '@components/nav/helper';
import Dialog from '@components/core/Dialog';
import useNetworkStatus from '@components/core/useNetworkStatus';
import { login } from '@actions';
import { Deck, DeckId, getDeckId } from '@actions/types';
import { parseBasicDeck } from '@lib/parseDeck';
import { makeBaseDeckSelector, makeLatestDeckSelector, AppState } from '@reducers';
import COLORS from '@styles/colors';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useDeck } from '@data/hooks';
import { useEffectUpdate, usePlayerCardsFunc } from '@components/core/hooks';
import { ThunkDispatch } from 'redux-thunk';
import { CUSTOM_INVESTIGATOR } from '@app_constants';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { DeckActions } from '@data/remote/decks';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import useSingleCard from '@components/card/useSingleCard';

interface Props {
  campaign: MiniCampaignT | undefined;
  toggleVisible: () => void;
  deckId?: DeckId;
  signedIn?: boolean;
  actions: DeckActions;
}

type DeckDispatch = ThunkDispatch<AppState, unknown, Action<string>>;

// TODO: remote decks
export default function CopyDeckDialog({ toggleVisible, campaign, deckId, signedIn, actions }: Props) {
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
    if (Platform.OS === 'android') {
      toggleVisible();
    }
    // Change the deck options for required cards, if present.
    showDeckModal(getDeckId(deck), deck, campaign?.id, colors, investigator);
  }, [campaign, toggleVisible, investigator, setSaving, colors]);
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
        <DialogComponent.Description style={[typography.dialogLabel, space.marginBottomS]}>
          { t`Version to copy` }
        </DialogComponent.Description>
        { parsedBaseDeck ? (
          <SelectDeckSwitch
            deckId={parsedBaseDeck.id}
            label={t`Base Version\n${parsedBaseDeck.experience} XP`}
            value={selectedDeckId?.uuid === parsedBaseDeck.id.uuid}
            onValueChange={selectedDeckIdChanged}
          />
        ) : null }
        { parsedCurrentDeck ? (
          <SelectDeckSwitch
            deckId={parsedCurrentDeck.id}
            label={t`Current Version ${parsedCurrentDeck.deck.version}\n${parsedCurrentDeck.experience} XP`}
            value={selectedDeckId?.uuid === parsedCurrentDeck.id.uuid}
            onValueChange={selectedDeckIdChanged}
          />
        ) : null }
        { parsedLatestDeck ? (
          <SelectDeckSwitch
            deckId={parsedLatestDeck.id}
            label={t`Latest Version ${parsedLatestDeck.deck.version}\n${parsedLatestDeck.experience} XP`}
            value={selectedDeckId?.uuid === parsedLatestDeck.id.uuid}
            onValueChange={selectedDeckIdChanged}
          />
        ) : null }
      </>
    );
  }, [parsedBaseDeck, parsedCurrentDeck, parsedLatestDeck, selectedDeckId, typography, selectedDeckIdChanged]);

  const formContent = useMemo(() => {
    if (saving) {
      return (
        <ActivityIndicator
          style={styles.spinner}
          color={colors.lightText}
          size="large"
          animating
        />
      );
    }
    return (
      <>
        <DialogComponent.Description style={[typography.dialogLabel, space.marginBottomS]}>
          { t`New Name` }
        </DialogComponent.Description>
        <DialogComponent.Input
          value={deckName || ''}
          placeholder={t`Required`}
          onChangeText={onDeckNameChange}
          returnKeyType="done"
        />
        { deckSelector }
        <DialogComponent.Description style={[typography.dialogLabel, space.marginBottomS]}>
          { t`Deck Type` }
        </DialogComponent.Description>
        <DialogComponent.Switch
          label={t`Create on ArkhamDB`}
          value={!offlineDeck && signedIn && isConnected && networkType !== NetInfoStateType.none && !isCustomContent}
          disabled={isCustomContent || !isConnected || networkType === NetInfoStateType.none}
          onValueChange={onDeckTypeChange}
          trackColor={COLORS.switchTrackColor}
        />
        { !!isCustomContent && (
          <DialogComponent.Description
            style={[space.marginSideL, space.marginBottomM, typography.small, typography.left]}
          >
            { t`Note: this deck cannot be uploaded to ArkhamDB because it contains fan-made content.` }
          </DialogComponent.Description>
        ) }
        { (!isConnected || networkType === NetInfoStateType.none) && (
          <TouchableOpacity onPress={refreshNetworkStatus}>
            <DialogComponent.Description style={[typography.small, { color: COLORS.red }, space.marginBottomS]}>
              { t`You seem to be offline. Refresh Network?` }
            </DialogComponent.Description>
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


  if (!investigator) {
    return null;
  }
  const okDisabled = saving || selectedDeckId === null;
  return (
    <Dialog
      title={t`Copy Deck`}
      visible={!!deckId}
    >
      <DialogComponent.Description
        style={[space.marginSideS, saving ? typography.center : typography.left, typography.text]}
      >
        { saving ?
          t`Saving` :
          t`Make a copy of a deck so that you can use it in a different campaign or choose different upgrades.`
        }
      </DialogComponent.Description>
      { formContent }
      <DialogComponent.Button
        label={t`Cancel`}
        onPress={toggleVisible}
      />
      <DialogComponent.Button
        label={t`Okay`}
        color={okDisabled ? COLORS.darkGray : COLORS.lightBlue}
        disabled={okDisabled}
        onPress={onOkayPress}
      />
    </Dialog>
  );
}

const styles = StyleSheet.create({
  spinner: {
    height: 80,
  },
  error: {
    color: 'red',
  },
});

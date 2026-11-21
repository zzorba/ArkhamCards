import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { find, flatMap, keys, throttle, uniq } from 'lodash';
import { Action } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { NetInfoStateType } from '@react-native-community/netinfo';
import { t } from 'ttag';

import { TouchableOpacity } from '@components/core/Touchables';
import { DeckTarget, saveClonedDeck } from './actions';
import { showDeckModal } from '@components/nav/helper';
import useNetworkStatus from '@components/core/useNetworkStatus';
import { arkhamBuildLogin, login } from '@actions';
import { Deck, DeckId, getDeckId, isArkhamBuildDeck } from '@actions/types';
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
import LanguageContext from '@lib/i18n/LanguageContext';
import { useNavigation } from '@react-navigation/native';

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
  const { userId, arkhamBuild: arkhamBuildSignedIn } = useContext(ArkhamCardsAuthContext);
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
    keys(deck?.deck.fan_made_content?.cards).length ||
    (deck && find([...keys(deck.deck.slots), ...keys(deck.deck.sideSlots), ...keys(deck.deck.ignoreDeckLimitSlots)], code => code.startsWith('z')))
  ), [deck]);
  // Fan-made content (ours or arkham.build's) can go to arkham.build, but not to ArkhamDB.
  const arkhamBuildEligible = deck?.deck.investigator_code !== CUSTOM_INVESTIGATOR;
  const [deckTarget, setDeckTarget] = useState<DeckTarget>(() => {
    if (!deck || deck.deck.local) {
      return 'local';
    }
    return isArkhamBuildDeck(deck.deck) ? 'arkhambuild' : 'arkhamdb';
  });
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
  const onArkhamDbChange = useCallback((value: boolean) => {
    if (value && !signedIn) {
      dispatch(login());
    }
    setDeckTarget(value ? 'arkhamdb' : 'local');
  }, [dispatch, signedIn]);
  const onArkhamBuildChange = useCallback((value: boolean) => {
    if (value && !arkhamBuildSignedIn) {
      dispatch(arkhamBuildLogin());
    }
    setDeckTarget(value ? 'arkhambuild' : 'local');
  }, [dispatch, arkhamBuildSignedIn]);
  const isOffline = !isConnected || networkType === NetInfoStateType.none;
  const effectiveTarget: DeckTarget = useMemo(() => {
    if (isOffline) {
      return 'local';
    }
    if (deckTarget === 'arkhambuild') {
      return arkhamBuildSignedIn && arkhamBuildEligible ? 'arkhambuild' : 'local';
    }
    if (deckTarget === 'arkhamdb') {
      return signedIn && !isCustomContent ? 'arkhamdb' : 'local';
    }
    return 'local';
  }, [isOffline, deckTarget, arkhamBuildSignedIn, arkhamBuildEligible, signedIn, isCustomContent]);

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
  const navigation = useNavigation();

  const showNewDeck = useCallback((deck: Deck) => {
    setSaving(false);
    // Change the deck options for required cards, if present.
    showDeckModal(navigation, colors, getDeckId(deck), deck, campaign?.id, investigator);
  }, [campaign, investigator, setSaving, navigation, colors]);
  const saveCopy = useCallback((isRetry: boolean) => {
    if (!selectedDeck) {
      return;
    }
    if (investigator && (!saving || isRetry)) {
      setSaving(true);
      dispatch(saveClonedDeck(userId, actions, effectiveTarget, selectedDeck, deckName || t`New Deck`)).then(
        showNewDeck,
        (err) => {
          setSaving(false);
          setError(err.message);
        }
      );
    }
  }, [actions, userId, effectiveTarget,
    deckName, selectedDeck, saving, investigator,
    dispatch, setSaving, setError, showNewDeck]);
  const onOkayPress = useMemo(() => throttle(() => saveCopy(false), 200), [saveCopy]);

  const onDeckNameChange = useCallback((value: string) => {
    setDeckName(value);
  }, [setDeckName]);

  const selectedDeckIdChanged = useCallback((deckId: DeckId, value: boolean) => {
    setSelectedDeckId(value ? deckId : undefined);
  }, [setSelectedDeckId]);

  const allCardCodes = useMemo(() => uniq(
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
  ), [deck, baseDeck, latestDeck]);
  const [cards] = usePlayerCardsFunc(() => allCardCodes, [allCardCodes], false, deck?.deck.taboo_id || 0);
  const { listSeperator } = useContext(LanguageContext);
  const parsedCurrentDeck = useMemo(() => cards && deck && parseBasicDeck(deck?.deck, cards, listSeperator), [cards, deck, listSeperator]);
  const parsedBaseDeck = useMemo(() => cards && baseDeck && parseBasicDeck(baseDeck, cards, listSeperator), [cards, baseDeck, listSeperator]);
  const parsedLatestDeck = useMemo(() => cards && latestDeck && parseBasicDeck(latestDeck, cards, listSeperator), [cards, latestDeck, listSeperator]);

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
        { arkhamBuildEligible && (
          <NewDialog.ContentLine
            icon="world"
            text={t`Create on arkham.build`}
            paddingBottom={s}
            control={
              <ArkhamSwitch
                value={effectiveTarget === 'arkhambuild'}
                disabled={isOffline}
                onValueChange={onArkhamBuildChange}
              />
            }
          />
        ) }
        <NewDialog.ContentLine
          icon="arkhamdb"
          text={t`Create on ArkhamDB`}
          paddingBottom={s}
          control={
            <ArkhamSwitch
              value={effectiveTarget === 'arkhamdb'}
              disabled={isCustomContent || isOffline}
              onValueChange={onArkhamDbChange}
            />
          }
        />
        { !!isCustomContent && (
          <NewDialog.ContentLine
            hideIcon
            text={t`Note: this deck cannot be uploaded to ArkhamDB because it contains fan-made/preview content.`}
            control={null}
            paddingBottom={s}
          />
        ) }
        { isOffline && (
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
  }, [isCustomContent, isOffline, arkhamBuildEligible, effectiveTarget, colors, typography, saving, deckName, error, onDeckNameChange, refreshNetworkStatus, onArkhamDbChange, onArkhamBuildChange, deckSelector]);
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

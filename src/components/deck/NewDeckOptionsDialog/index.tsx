import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { find, forEach, map, sumBy, throttle } from 'lodash';
import { Action } from 'redux';
import { useDispatch } from 'react-redux';
import { NetInfoStateType } from '@react-native-community/netinfo';
import { t } from 'ttag';

import SettingsSwitch from '@components/core/SettingsSwitch';
import EditText, { openDialog } from '@components/core/EditText';
import RequiredCardSwitch from './RequiredCardSwitch';
import { showDeckModal } from '@components/nav/helper';
import TabooSetPicker from '@components/core/TabooSetPicker';
import CardSectionHeader from '@components/core/CardSectionHeader';
import SettingsItem from '@components/settings/SettingsItem';
import BasicButton from '@components/core/BasicButton';
import withNetworkStatus, { NetworkStatusProps } from '@components/core/withNetworkStatus';
import withLoginState, { LoginStateProps } from '@components/core/withLoginState';
import { saveNewDeck } from '@components/deck/actions';
import { NavigationProps } from '@components/nav/types';
import { Deck, DeckMeta, Slots } from '@actions/types';
import { RANDOM_BASIC_WEAKNESS } from '@app_constants';
import Card from '@data/Card';
import { AppState } from '@reducers';
import space from '@styles/space';
import COLORS from '@styles/colors';
import starterDecks from '../../../../assets/starter-decks';
import StyleContext from '@styles/StyleContext';
import { useFlag, useInvestigatorCards, usePlayerCards, useTabooSetId } from '@components/core/hooks';
import { ThunkDispatch } from 'redux-thunk';
import DeckMetadataControls from '../controls/DeckMetadataControls';
import DeckPickerStyleButton from '../controls/DeckPickerStyleButton';
import DeckSectionBlock from '../section/DeckSectionBlock';
import DeckCheckboxButton from '../controls/DeckCheckboxButton';

export interface NewDeckOptionsProps {
  investigatorId: string;
  onCreateDeck: (deck: Deck) => void;
}

type Props = NavigationProps &
  NewDeckOptionsProps &
  NetworkStatusProps &
  LoginStateProps;

type DeckDispatch = ThunkDispatch<AppState, any, Action>;

function NewDeckOptionsDialog({
  investigatorId,
  onCreateDeck,
  componentId,
  signedIn,
  isConnected,
  networkType,
  login,
  refreshNetworkStatus,
}: Props) {
  const defaultTabooSetId = useTabooSetId();
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const [saving, setSaving] = useState(false);
  const [deckNameChange, setDeckNameChange] = useState<string | undefined>();
  const [offlineDeck, toggleOfflineDeck] = useFlag(!signedIn || !isConnected || networkType === NetInfoStateType.none);
  const [optionSelected, setOptionSelected] = useState<boolean[]>([true]);
  const [tabooSetId, setTabooSetId] = useState<number | undefined>(defaultTabooSetId);
  const [starterDeck, setStarterDeck] = useState(false);
  const investigators = useInvestigatorCards(tabooSetId);
  const cards = usePlayerCards(tabooSetId);
  const [meta, setMeta] = useState<DeckMeta>({});

  const updateMeta = useCallback((key: keyof DeckMeta, value?: string) => {
    const newMeta = { ...meta, [key]: value };
    if (!newMeta[key]) {
      delete newMeta[key];
    }
    setMeta(newMeta);
  }, [meta, setMeta]);
  const setParallel = useCallback((front: string, back: string) => {
    setMeta({
      ...meta,
      alternate_front: front,
      alternate_back: back,
    });
  }, [setMeta, meta]);
  const investigator = useMemo(() => (investigators && investigators[investigatorId]) || undefined, [investigatorId, investigators]);
  const defaultDeckName = useMemo(() => {
    if (!investigator || !investigator.name) {
      return t`New Deck`;
    }
    switch (investigator.factionCode()) {
      case 'guardian':
        return t`The Adventures of ${investigator.name}`;
      case 'seeker':
        return t`${investigator.name} Investigates`;
      case 'mystic':
        return t`The ${investigator.name} Mysteries`;
      case 'rogue':
        return t`The ${investigator.name} Job`;
      case 'survivor':
        return t`${investigator.name} on the Road`;
      default:
        return t`${investigator.name} Does It All`;
    }
  }, [investigator]);

  const requiredCardOptions = useMemo(() => {
    if (!cards || !investigator) {
      return [];
    }
    const result: Card[][] = [[]];
    forEach(
      investigator.deck_requirements ? investigator.deck_requirements.card : [],
      cardRequirement => {
        const code = cardRequirement.code;
        if (code) {
          const card = cards[code];
          if (card) {
            result[0].push(card);
          }
        }
        if (cardRequirement.alternates && cardRequirement.alternates.length) {
          forEach(cardRequirement.alternates, (altCode, index) => {
            while (result.length <= index + 1) {
              result.push([]);
            }
            const card = cards[altCode];
            if (card) {
              result[index + 1].push(card);
            }
          });
        }
      }
    );
    return result;
  }, [cards, investigator]);
  const slots = useMemo(() => {
    if (starterDeck && investigator && starterDecks[investigator.code]) {
      return starterDecks[investigator.code];
    }
    const slots: Slots = {
      // Random basic weakness.
      [RANDOM_BASIC_WEAKNESS]: 1,
    };

    // Seed all the 'basic' requirements from the investigator.
    if (cards && investigator && investigator.deck_requirements) {
      forEach(investigator.deck_requirements.card, cardRequirement => {
        const card = cardRequirement.code && cards[cardRequirement.code];
        if (!card) {
          return;
        }
        slots[card.code] = card.deck_limit || card.quantity || 0;
      });
      if (investigator.code === '06002') {
        slots['06008'] = 1;
      }
    }

    if (optionSelected[0] !== true ||
      sumBy(optionSelected, x => x ? 1 : 0) !== 1) {
      // Now sub in the options that were asked for if we aren't going
      // with the defaults.
      forEach(optionSelected, (include, index) => {
        const cards = requiredCardOptions[index];
        forEach(cards, card => {
          if (include) {
            slots[card.code] = card.deck_limit || card.quantity || 0;
          } else if (slots[card.code]) {
            delete slots[card.code];
          }
        });
      });
    }

    return slots;
  }, [cards, optionSelected, requiredCardOptions, investigator, starterDeck]);
  const dispatch: DeckDispatch = useDispatch();

  const showNewDeck = useCallback((deck: Deck) => {
    setSaving(false);
    // Change the deck options for required cards, if present.
    onCreateDeck && onCreateDeck(deck);
    showDeckModal(componentId, deck, colors, investigator);
  }, [componentId, onCreateDeck, colors, investigator, setSaving]);
  const createDeck = useCallback((isRetry?: boolean) => {
    const deckName = deckNameChange || defaultDeckName;
    if (investigator && (!saving || isRetry)) {
      const local = (offlineDeck || !signedIn || !isConnected || networkType === NetInfoStateType.none);
      setSaving(true);
      dispatch(saveNewDeck({
        local,
        deckName: deckName || t`New Deck`,
        investigatorCode: investigator.code,
        slots: slots,
        tabooSetId,
        problem: (starterDeck && starterDecks[investigator.code]) ? undefined : 'too_few_cards',
      })).then(
        showNewDeck,
        () => {
          setSaving(false);
        }
      );
    }
  }, [signedIn, dispatch, showNewDeck, slots,networkType, isConnected, offlineDeck, saving, starterDeck, tabooSetId, deckNameChange, investigator, defaultDeckName]);

  const onOkayPress = useMemo(() => throttle(() => createDeck(), 200), [createDeck]);
  const toggleOptionsSelected = useCallback((index: number, value: boolean) => {
    const updatedOptionSelected = [...optionSelected];
    updatedOptionSelected[index] = value;
    setOptionSelected(updatedOptionSelected);
  }, [optionSelected, setOptionSelected]);

  const showNameDialog = useCallback(() => openDialog({
    title: t`Name`,
    dialogDescription: t`Enter a name for this deck.`,
    value: deckNameChange,
    onValueChange: setDeckNameChange,
  }), [deckNameChange, setDeckNameChange]);

  const renderNamePicker = useCallback((last: boolean) => {
    return (
      <DeckPickerStyleButton
        last={last}
        icon="name"
        title={t`Name`}
        valueLabel={deckNameChange || defaultDeckName}
        onPress={showNameDialog}
        first
        editable
      />
    );
  }, [deckNameChange, defaultDeckName, showNameDialog]);

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
    const cardOptions = requiredCardOptions;
    let hasStarterDeck = false;
    if (investigatorId) {
      hasStarterDeck = starterDecks[investigatorId] !== undefined;
    }
    return (
      <>
        <View style={space.paddingS}>
          <DeckMetadataControls
            editable
            tabooSetId={tabooSetId || 0}
            setTabooSet={setTabooSetId}
            meta={meta}
            investigatorCode={investigatorId}
            setMeta={updateMeta}
            setParallel={setParallel}
            firstElement={renderNamePicker}
          />
        </View>
        <View style={[space.paddingSideS, space.paddingBottomS]}>
          <DeckSectionBlock title={t`Required Cards`} faction="neutral">
            { map(cardOptions, (requiredCards, index) => {
              return (
                <RequiredCardSwitch
                  key={`${investigatorId}-${index}`}
                  index={index}
                  disabled={(index === 0 && cardOptions.length === 1) || starterDeck}
                  cards={requiredCards}
                  value={optionSelected[index] || false}
                  onValueChange={toggleOptionsSelected}
                  last={index === (requiredCards.length - 1)}
                />
              );
            }) }
          </DeckSectionBlock>
        </View>
        <View style={[space.paddingSideS, space.paddingBottomS]}>
          <DeckCheckboxButton
            icon="card-outline"
            title={t`Use Starter Deck`}
            value={starterDeck}
            disabled={!hasStarterDeck}
            onValueChange={setStarterDeck}
          />
          { signedIn ? (
            <DeckCheckboxButton
              icon="world"
              title={t`Create on ArkhamDB`}
              value={!offlineDeck}
              disabled={!signedIn || !isConnected || networkType === NetInfoStateType.none}
              onValueChange={toggleOfflineDeck}
              last
            />
          ) : (
            <DeckCheckboxButton
              icon="world"
              title={t`Sign in to ArkhamDB`}
              value={false}
              onValueChange={login}
              last
            />
          ) }
          { (!isConnected || networkType === NetInfoStateType.none) && (
            <TouchableOpacity onPress={refreshNetworkStatus}>
              <View style={[space.paddingS, space.paddingLeftM]}>
                <Text style={[typography.small, { color: COLORS.red }, space.marginBottomS]}>
                  { t`You seem to be offline. Refresh Network?` }
                </Text>
              </View>
            </TouchableOpacity>
          ) }
        </View>
      </>
    );
  }, [investigatorId, signedIn, networkType, isConnected,
    offlineDeck, optionSelected, starterDeck, tabooSetId, requiredCardOptions, meta, colors, typography, saving,
    toggleOptionsSelected,toggleOfflineDeck, login, refreshNetworkStatus, renderNamePicker, setParallel, updateMeta]);

  const cancelPressed = useCallback(() => {
    Navigation.pop(componentId);
  }, [componentId]);

  if (!investigator) {
    return null;
  }
  const okDisabled = saving || !(starterDeck || !!find(optionSelected, selected => selected));
  return (
    <ScrollView contentContainerStyle={backgroundStyle}>
      { formContent }
      { !saving && (
        <>
          <BasicButton
            title={t`Create deck`}
            disabled={okDisabled}
            onPress={onOkayPress}
          />
          <BasicButton
            title={t`Cancel`}
            color={COLORS.red}
            onPress={cancelPressed}
          />
        </>
      ) }
    </ScrollView>
  );
}

export default withLoginState<NavigationProps & NewDeckOptionsProps>(
  withNetworkStatus<NavigationProps & NewDeckOptionsProps & LoginStateProps>(
    NewDeckOptionsDialog
  ),
  { noWrapper: true }
);

const styles = StyleSheet.create({
  spinner: {
    height: 80,
  },
});

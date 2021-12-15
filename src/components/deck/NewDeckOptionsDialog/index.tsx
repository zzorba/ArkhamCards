import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { find, forEach, map, sumBy, throttle, uniqBy } from 'lodash';
import { Action } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { NetInfoStateType } from '@react-native-community/netinfo';
import { t } from 'ttag';

import RequiredCardSwitch from './RequiredCardSwitch';
import { showCard, showCardSwipe, showDeckModal } from '@components/nav/helper';
import useNetworkStatus from '@components/core/useNetworkStatus';
import withLoginState, { LoginStateProps } from '@components/core/withLoginState';
import { saveNewDeck } from '@components/deck/actions';
import { NavigationProps } from '@components/nav/types';
import { CampaignId, Deck, DeckMeta, getDeckId, Slots } from '@actions/types';
import { CUSTOM_INVESTIGATOR, RANDOM_BASIC_WEAKNESS } from '@app_constants';
import Card from '@data/types/Card';
import { AppState } from '@reducers';
import space, { m, s } from '@styles/space';
import COLORS from '@styles/colors';
import starterDecks from '../../../../assets/starter-decks';
import StyleContext from '@styles/StyleContext';
import { useFlag, useInvestigatorCards, usePlayerCards, useTabooSetId } from '@components/core/hooks';
import { ThunkDispatch } from 'redux-thunk';
import DeckMetadataControls from '../controls/DeckMetadataControls';
import DeckPickerStyleButton from '../controls/DeckPickerStyleButton';
import DeckSectionBlock from '../section/DeckSectionBlock';
import DeckCheckboxButton from '../controls/DeckCheckboxButton';
import DeckButton from '../controls/DeckButton';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { useSimpleTextDialog } from '../dialogs';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import InvestigatorSummaryBlock from '@components/card/InvestigatorSummaryBlock';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import { useDeckActions } from '@data/remote/decks';

export interface NewDeckOptionsProps {
  investigatorId: string;
  campaignId: CampaignId | undefined;
  onCreateDeck: (deck: Deck) => void;
}

type Props = NavigationProps &
  NewDeckOptionsProps &
  LoginStateProps;

type DeckDispatch = ThunkDispatch<AppState, unknown, Action<string>>;

function NewDeckOptionsDialog({
  investigatorId,
  onCreateDeck,
  campaignId,
  componentId,
  signedIn,
  login,
}: Props) {
  const deckActions = useDeckActions();
  const defaultTabooSetId = useTabooSetId();
  const { userId } = useContext(ArkhamCardsAuthContext);
  const [{ isConnected, networkType }, refreshNetworkStatus] = useNetworkStatus();
  const singleCardView = useSelector((state: AppState) => state.settings.singleCardView || false);
  const { backgroundStyle, colors, fontScale, typography, width } = useContext(StyleContext);
  const [saving, setSaving] = useState(false);
  const [deckNameChange, setDeckNameChange] = useState<string | undefined>();
  const [offlineDeck, toggleOfflineDeck] = useFlag(
    investigatorId === CUSTOM_INVESTIGATOR ||
    !signedIn ||
    !isConnected ||
    networkType === NetInfoStateType.none);
  const [optionSelected, setOptionSelected] = useState<boolean[]>([true]);
  const [tabooSetIdChoice, setTabooSetId] = useState<number | undefined>(defaultTabooSetId);
  const [starterDeck, setStarterDeck] = useState(false);
  const tabooSetId = useMemo(() => {
    if (starterDeck) {
      return undefined;
    }
    return tabooSetIdChoice;
  }, [starterDeck, tabooSetIdChoice]);
  const investigators = useInvestigatorCards(tabooSetId);
  const cards = usePlayerCards(tabooSetId);
  const [metaState, setMeta] = useState<DeckMeta>({});
  const updateMeta = useCallback((key: keyof DeckMeta, value?: string) => {
    const newMeta = { ...metaState, [key]: value };
    if (!newMeta[key]) {
      delete newMeta[key];
    }
    setMeta(newMeta);
  }, [metaState, setMeta]);
  const setParallel = useCallback((front: string, back: string) => {
    setMeta({
      ...metaState,
      alternate_front: front,
      alternate_back: back,
    });
  }, [setMeta, metaState]);
  const investigator = useMemo(() => (investigators && investigators[investigatorId]) || undefined, [investigatorId, investigators]);
  const investigatorFront = useMemo(() => (investigators && metaState.alternate_front) ? investigators[metaState.alternate_front] : investigator,
    [investigator, investigators, metaState]);
  const investigatorBack = useMemo(() => (investigators && metaState.alternate_back) ? investigators[metaState.alternate_back] : investigator,
    [investigator, investigators, metaState]
  );

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
    return map(result, r => uniqBy(r, x => x.code));
  }, [cards, investigator]);
  const meta = useMemo((): DeckMeta =>{
    const starterDeckMeta = starterDeck && investigator && starterDecks.meta[investigator.code];
    if (starterDeckMeta) {
      return starterDeckMeta;
    }
    return metaState || {};
  }, [starterDeck, metaState, investigator]);
  const slots: Slots = useMemo(() => {
    if (starterDeck && investigator && starterDecks.cards[investigator.code]) {
      return starterDecks.cards[investigator.code] || {};
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
    showDeckModal(getDeckId(deck), deck, campaignId, colors, investigator);
  }, [campaignId, onCreateDeck, colors, investigator, setSaving]);
  const createDeck = useCallback((isRetry?: boolean) => {
    const deckName = deckNameChange || defaultDeckName;
    if (investigator && (!saving || isRetry)) {
      const local = (offlineDeck || !signedIn || !isConnected || networkType === NetInfoStateType.none);
      setSaving(true);
      dispatch(saveNewDeck(userId, deckActions, {
        local,
        meta,
        deckName: deckName || t`New Deck`,
        investigatorCode: investigator.code,
        slots: slots,
        tabooSetId,
        problem: (starterDeck && starterDecks.cards[investigator.code]) ? undefined : 'too_few_cards',
      })).then(
        showNewDeck,
        () => {
          setSaving(false);
        }
      );
    }
  }, [signedIn, dispatch, showNewDeck, deckActions, userId,
    slots, meta, networkType, isConnected, offlineDeck, saving, starterDeck, tabooSetId, deckNameChange, investigator, defaultDeckName]);

  const onOkayPress = useMemo(() => throttle(() => createDeck(), 200), [createDeck]);
  const toggleOptionsSelected = useCallback((index: number, value: boolean) => {
    const updatedOptionSelected = [...optionSelected];
    updatedOptionSelected[index] = value;
    setOptionSelected(updatedOptionSelected);
  }, [optionSelected, setOptionSelected]);

  const [nameDialog, showNameDialog] = useSimpleTextDialog({
    title: t`Name`,
    onValueChange: setDeckNameChange,
    value: deckNameChange || '',
    placeholder: t`Enter a name for this deck.`,
  });

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

  const onCardPress = useCallback((card: Card) => {
    if (singleCardView) {
      showCard(
        componentId,
        card.code,
        card,
        colors,
        true,
        tabooSetId
      );
      return;
    }
    let index = 0;
    const visibleCards: Card[] = [];
    forEach(requiredCardOptions, requiredCards => {
      forEach(requiredCards, requiredCard => {
        if (card.code === requiredCard.code) {
          index = visibleCards.length;
        }
        if (requiredCard) {
          visibleCards.push(requiredCard);
        }
      });
    });
    showCardSwipe(
      componentId,
      map(visibleCards, card => card.code),
      undefined,
      index,
      colors,
      visibleCards,
      false,
      tabooSetId,
      undefined,
      investigator
    );
  }, [componentId, requiredCardOptions, colors, investigator, singleCardView, tabooSetId]);
  const formContent = useMemo(() => {
    const hasStarterDeck = !!investigatorId && starterDecks.cards[investigatorId] !== undefined;
    return (
      <>
        <View style={space.paddingS}>
          <DeckMetadataControls
            editable={!starterDeck}
            tabooSetId={tabooSetId || 0}
            setTabooSet={setTabooSetId}
            meta={meta}
            investigatorCode={investigatorId}
            setMeta={updateMeta}
            setParallel={setParallel}
            firstElement={renderNamePicker}
          />
        </View>
        { !!find(requiredCardOptions, option => option.length > 0) && (
          <View style={[space.paddingSideS, space.paddingBottomS]}>
            <DeckSectionBlock title={t`Required Cards`} faction="neutral">
              { map(requiredCardOptions, (requiredCards, index) => {
                return (
                  <RequiredCardSwitch
                    key={`${investigatorId}-${index}`}
                    index={index}
                    onPress={onCardPress}
                    disabled={(index === 0 && requiredCardOptions.length === 1) || starterDeck}
                    cards={requiredCards}
                    value={optionSelected[index] || false}
                    onValueChange={toggleOptionsSelected}
                    last={index === (requiredCardOptions.length - 1)}
                  />
                );
              }) }
            </DeckSectionBlock>
          </View>
        ) }
        { investigatorId !== CUSTOM_INVESTIGATOR && (
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
        ) }
      </>
    );
  }, [investigatorId, signedIn, networkType, isConnected,
    offlineDeck, optionSelected, starterDeck, tabooSetId, requiredCardOptions, meta, typography,
    onCardPress, toggleOptionsSelected,toggleOfflineDeck, login, refreshNetworkStatus, renderNamePicker, setParallel, updateMeta]);

  const cancelPressed = useCallback(() => {
    Navigation.pop(componentId);
  }, [componentId]);

  if (!investigator) {
    return null;
  }
  const okDisabled = saving || !(starterDeck || !!find(optionSelected, selected => selected));
  const footerSize = s + m + NOTCH_BOTTOM_PADDING + 54 * fontScale;
  if (saving) {
    return (
      <LoadingSpinner large />
    );
  }
  return (
    <SafeAreaView style={[styles.column, backgroundStyle]}>
      <ScrollView contentContainerStyle={backgroundStyle} keyboardShouldPersistTaps="always">
        <View style={space.paddingS}>
          <InvestigatorSummaryBlock
            investigator={investigatorFront || investigator}
            tabooSetId={tabooSetId}
            investigatorBack={investigatorBack}
          />
        </View>
        { formContent }
        <View style={{ height: footerSize }} />
      </ScrollView>
      <View style={[{ position: 'absolute', bottom: 0, paddingTop: s, paddingBottom: m + NOTCH_BOTTOM_PADDING, left: 0, height: footerSize, width, backgroundColor: colors.L20 }, styles.row]}>
        <View style={[space.marginLeftS, styles.flex]}>
          <DeckButton
            title={t`Cancel`}
            color="red"
            icon="dismiss"
            onPress={cancelPressed}
          />
        </View>
        <View style={[styles.flex, space.marginRightS, space.marginLeftS]}>
          <DeckButton
            title={t`Create deck`}
            icon="plus-thin"
            onPress={okDisabled ? undefined : onOkayPress}
          />
        </View>
      </View>
      { nameDialog }
    </SafeAreaView>
  );
}

export default withLoginState<NavigationProps & NewDeckOptionsProps>(
  NewDeckOptionsDialog,
  { noWrapper: true }
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: '100%',
  },
});

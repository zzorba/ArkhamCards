import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { find, forEach, keys, range, throttle } from 'lodash';
import {
  Alert,
  AlertButton,
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Action } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation, OptionsTopBarButton } from 'react-native-navigation';
import DialogComponent from '@lib/react-native-dialog';
import deepDiff from 'deep-diff';
import { ngettext, msgid, t } from 'ttag';
import SideMenu from 'react-native-side-menu-updated';

import {
  SettingsButton,
} from '@lib/react-native-settings-components';
import BasicButton from '@components/core/BasicButton';
import withLoginState, { LoginStateProps } from '@components/core/withLoginState';
import withTraumaDialog, { TraumaProps } from '@components/campaign/withTraumaDialog';
import Dialog from '@components/core/Dialog';
import CardSectionHeader from '@components/core/CardSectionHeader';
import CopyDeckDialog from '@components/deck/CopyDeckDialog';
import { iconsMap } from '@app/NavIcons';
import {
  deleteDeckAction,
  uploadLocalDeck,
  saveDeckChanges,
} from '@components/deck/actions';
import { Slots, START_DECK_EDIT, UPDATE_DECK_EDIT } from '@actions/types';
import { updateCampaign } from '@components/campaign/actions';
import { DeckChecklistProps } from '@components/deck/DeckChecklistView';
import Card from '@data/Card';
import { parseDeck } from '@lib/parseDeck';
import { EditDeckProps } from '../DeckEditView';
import { CardUpgradeDialogProps } from '../CardUpgradeDialog';
import { UpgradeDeckProps } from '../DeckUpgradeDialog';
import { DeckHistoryProps } from '../DeckHistoryView';
import { EditSpecialCardsProps } from '../EditSpecialDeckCardsView';
import EditDeckDetailsDialog from './EditDeckDetailsDialog';
import DeckViewTab from './DeckViewTab';
import DeckNavFooter from '@components/DeckNavFooter';
import {
  getCampaign,
  getCampaignForDeck,
  getPacksInCollection,
  AppState,
} from '@reducers';
import { m } from '@styles/space';
import COLORS from '@styles/colors';
import { getDeckOptions, showCardCharts, showDrawSimulator } from '@components/nav/helper';
import StyleContext from '@styles/StyleContext';
import { useComponentVisible, useDeck, useDeckEdits, useFlag, useInvestigatorCards, useNavigationButtonPressed, useParsedDeck, usePlayerCards, useSlots, useTabooSet } from '@components/core/hooks';
import { ThunkDispatch } from 'redux-thunk';
import { NavigationProps } from '@components/nav/types';

const SHOW_CHECKLIST_EDITOR = true;
export interface DeckDetailProps {
  id: number;
  title?: string;
  subtitle?: string;
  campaignId?: number;
  hideCampaign?: boolean;
  isPrivate?: boolean;
  modal?: boolean;
}

type Props = NavigationProps &
  DeckDetailProps &
  TraumaProps &
  LoginStateProps;
type DeckDispatch = ThunkDispatch<AppState, any, Action>;


function DeckDetailView({
  componentId,
  id,
  title,
  subtitle,
  campaignId,
  hideCampaign,
  isPrivate,
  modal,
  signedIn,
  login,
  showTraumaDialog,
  investigatorDataUpdates,
}: Props) {
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const dispatch = useDispatch();
  const deckDispatch: DeckDispatch = useDispatch();
  const { width } = useWindowDimensions();

  const singleCardView = useSelector((state: AppState) => state.settings.singleCardView || false);
  const {
    deck,
    cards,
    previousDeck,
    deckEdits,
    deckEditsRef,
    visible,
    parsedDeck,
    tabooSetId,
  } = useParsedDeck(id, componentId, true);

  const [copying, toggleCopying] = useFlag(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | undefined>();
  const [menuOpen, toggleMenuOpen, setMenuOpen] = useFlag(false);
  const [tabooOpen, setTabooOpen] = useState(false);
  const [editDetailsOpen, toggleEditDetailsOpen, setEditDetailsOpen] = useFlag(false);

  const tabooSet = useTabooSet(tabooSetId);
  const investigators = useInvestigatorCards(tabooSetId);

  const parallelInvestigators = useMemo(() => {
    const investigator = deck?.investigator_code;
    if (!investigator) {
      return [];
    }
    const parallelInvestigators: Card[] = [];
    forEach(investigators, card => {
      if (card && investigator && card.alternate_of_code === investigator) {
        parallelInvestigators.push(card);
      }
    });
    return parallelInvestigators;
  }, [investigators, deck?.investigator_code]);

  const slotDeltas = useMemo(() => {
    const result: {
      removals: Slots;
      additions: Slots;
      ignoreDeckLimitChanged: boolean;
    } = {
      removals: {},
      additions: {},
      ignoreDeckLimitChanged: false,
    };
    if (!deck || !deckEdits) {
      return result;
    }
    forEach(deck.slots, (deckCount, code) => {
      const currentDeckCount = deckEdits.slots[code] || 0;
      if (deckCount > currentDeckCount) {
        result.removals[code] = deckCount - currentDeckCount;
      }
    });
    forEach(deckEdits.slots, (currentCount, code) => {
      const ogDeckCount = deck.slots[code] || 0;
      if (ogDeckCount < currentCount) {
        result.additions[code] = currentCount - ogDeckCount;
      }
      const ogIgnoreCount = ((deck.ignoreDeckLimitSlots || {})[code] || 0);
      if (ogIgnoreCount !== (deckEdits.ignoreDeckLimitSlots[code] || 0)) {
        result.ignoreDeckLimitChanged = true;
      }
    });
    return result;
  }, [deck, deckEdits]);

  const [investigatorFront, investigatorBack] = useMemo(() => {
    const altFront = deckEdits?.meta.alternate_front && find(
      parallelInvestigators,
      card => card.code === deckEdits?.meta.alternate_front);
    const investigatorFront = (altFront || (cards && deck && cards[deck.investigator_code]));

    const altBack = deckEdits?.meta.alternate_back && find(
      parallelInvestigators,
      card => card.code === deckEdits?.meta.alternate_back);
    const investigatorBack = altBack || (deck && cards && cards[deck.investigator_code]);
    return [investigatorFront, investigatorBack];
  }, [deck, cards, deckEdits?.meta, parallelInvestigators]);

  const problem = parsedDeck?.problem;
  const name = deckEdits?.nameChange !== undefined ? deckEdits.nameChange : deck?.name;
  const campaignSelector = useCallback((state: AppState) => campaignId ? getCampaign(state, campaignId) : getCampaignForDeck(state, deck?.id || id), [deck, id, campaignId]);
  const inCollection = useSelector(getPacksInCollection);
  const campaign = useSelector(campaignSelector);

  const [cardsByName, bondedCardsByName] = useMemo(() => {
    const cardsByName: {
      [name: string]: Card[];
    } = {};
    const bondedCardsByName: {
      [name: string]: Card[];
    } = {};
    forEach(cards, card => {
      if (card) {
        if (cardsByName[card.real_name]) {
          cardsByName[card.real_name].push(card);
        } else {
          cardsByName[card.real_name] = [card];
        }
        if (card.bonded_name) {
          if (bondedCardsByName[card.bonded_name]) {
            bondedCardsByName[card.bonded_name].push(card);
          } else {
            bondedCardsByName[card.bonded_name] = [card];
          }
        }
      }
    });
    return [cardsByName, bondedCardsByName];
  }, [cards]);

  const hasPendingEdits = useMemo(() => {
    if (!deck || !deckEdits) {
      return false;
    }
    const originalTabooSet: number = (deck.taboo_id || 0);
    const metaChanges = deepDiff(deckEdits.meta, deck.meta || {});
    return (deckEdits.nameChange && deck.name !== deckEdits.nameChange) ||
      (deckEdits.tabooSetChange !== undefined && originalTabooSet !== deckEdits.tabooSetChange) ||
      (deck.previous_deck && (deck.xp_adjustment || 0) !== deckEdits.xpAdjustment) ||
      keys(slotDeltas.removals).length > 0 ||
      keys(slotDeltas.additions).length > 0 ||
      slotDeltas.ignoreDeckLimitChanged ||
      (!!metaChanges && metaChanges.length > 0);
  }, [deck, deckEdits, slotDeltas]);

  const addedBasicWeaknesses = useMemo(() => {
    if (!cards || !deck) {
      return [];
    }
    const addedWeaknesses: string[] = [];
    forEach(slotDeltas.additions, (addition, code) => {
      const card = cards[code];
      if (card && card.subtype_code === 'basicweakness') {
        forEach(range(0, addition), () => addedWeaknesses.push(code));
      }
    });
    return addedWeaknesses;
  }, [deck, cards, slotDeltas]);
  const updateCampaignWeaknessSet = useCallback((newAssignedCards: string[]) => {
    if (campaign) {
      const assignedCards = {
        ...(campaign.weaknessSet && campaign.weaknessSet.assignedCards) || {},
      };
      forEach(newAssignedCards, code => {
        assignedCards[code] = (assignedCards[code] || 0) + 1;
      });
      dispatch(updateCampaign(
        campaign.id,
        {
          weaknessSet: {
            ...(campaign.weaknessSet || {}),
            assignedCards,
          },
        },
      ));
    }
  }, [campaign, dispatch]);

  const handleSaveError = useCallback((err: Error) => {
    setSaving(false);
    setSaveError(err.message || 'Unknown Error');
  }, [setSaveError, setSaving]);

  const actuallySaveEdits = useCallback((dismissAfterSave: boolean, isRetry?: boolean) => {
    if (saving && !isRetry) {
      return;
    }
    if (!deck || !parsedDeck || !deckEditsRef.current) {
      return;
    }
    const problemField = problem ? problem.reason : '';
    setSaving(true);
    deckDispatch(saveDeckChanges(
      deck,
      {
        name: deckEditsRef.current.nameChange,
        slots: deckEditsRef.current.slots,
        ignoreDeckLimitSlots: deckEditsRef.current.ignoreDeckLimitSlots,
        problem: problemField,
        spentXp: parsedDeck.changes ? parsedDeck.changes.spentXp : 0,
        xpAdjustment: deckEditsRef.current.xpAdjustment,
        tabooSetId,
        meta: deckEditsRef.current.ignoreDeckLimitSlots,
      }
    )).then(() => {
      updateCampaignWeaknessSet(addedBasicWeaknesses);
      if (dismissAfterSave) {
        Navigation.dismissAllModals();
      } else {
        setSaving(false);
      }
    }, handleSaveError);
  }, [deck, saving, parsedDeck, deckEditsRef, tabooSetId, addedBasicWeaknesses, problem,
    deckDispatch, handleSaveError, setSaving, updateCampaignWeaknessSet,
  ]);

  const saveEdits = useMemo(() => throttle((isRetry?: boolean) => actuallySaveEdits(false, isRetry), 500), [actuallySaveEdits]);
  const saveEditsAndDismiss = useMemo((isRetry?: boolean) => throttle(() => actuallySaveEdits(true, isRetry), 500), [actuallySaveEdits]);

  const handleBackPress = useCallback(() => {
    if (!visible) {
      return false;
    }
    if (hasPendingEdits) {
      Alert.alert(
        t`Save deck changes?`,
        t`Looks like you have made some changes that have not been saved.`,
        [{
          text: t`Save Changes`,
          onPress: () => {
            saveEditsAndDismiss();
          },
        }, {
          text: t`Discard Changes`,
          style: 'destructive',
          onPress: () => {
            Navigation.dismissAllModals();
          },
        }, {
          text: t`Cancel`,
          style: 'cancel',
        }],
      );
    } else {
      Navigation.dismissAllModals();
    }
    return true;
  }, [visible, hasPendingEdits, saveEditsAndDismiss]);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'back' || buttonId === 'androidBack') {
      handleBackPress();
    } else if (buttonId === 'save') {
      saveEdits();
    } else if (buttonId === 'menu') {
      toggleMenuOpen();
    }
  }, componentId, [saveEdits, toggleMenuOpen, handleBackPress]);

  const rightButtons = useMemo(() => {
    const rightButtons: OptionsTopBarButton[] = [{
      id: 'menu',
      icon: iconsMap.menu,
      color: 'white',
      accessibilityLabel: t`Menu`,
    }];
    if (hasPendingEdits) {
      rightButtons.push({
        text: t`Save`,
        id: 'save',
        color: 'white',
        accessibilityLabel: t`Save`,
      });
    }
    return rightButtons;
  }, [hasPendingEdits]);

  useEffect(() => {
    const leftButtons = modal ? [
      Platform.OS === 'ios' ? {
        text: t`Done`,
        id: 'back',
        color: 'white',
      } : {
        icon: iconsMap['arrow-left'],
        id: 'androidBack',
        color: 'white',
      },
    ] : [];

    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: title,
          color: '#FFFFFF',
        },
        subtitle: {
          text: name || subtitle,
          color: '#FFFFFF',
        },
        leftButtons,
        rightButtons,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, rightButtons, componentId]);

  const doUploadLocalDeck = useMemo(() => throttle((isRetry?: boolean) => {
    if (!parsedDeck || !deck) {
      return;
    }
    if (!saving || isRetry) {
      setSaving(true);
      deckDispatch(uploadLocalDeck(deck)).then(() => {
        setSaving(false);
      }, () => {
        setSaving(false);
      });
    }
  }, 200), [deckDispatch, parsedDeck, saving, deck, setSaving]);

  useEffect(() => {
    if (!deck) {
      if (!deleting && id > 0) {
        Alert.alert(
          t`Deck has been deleted`,
          t`It looks like you deleted this deck from ArkhamDB.\n\n If it was part of a campaign you can add the same investigator back to restore your campaign data.`,
          [{
            text: t`OK`,
            onPress: () => {
              Navigation.dismissAllModals();
            },
          }],
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck]);

  useEffect(() => {
    const newName = deckEdits?.nameChange || deck?.name;
    if (newName) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          subtitle: {
            text: newName,
            color: '#FFFFFF',
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckEdits?.nameChange]);

  const deleteDeck = useCallback((deleteAllVersions: boolean) => {
    if (!deleting) {
      setDeleting(true);

      deckDispatch(deleteDeckAction(id, deleteAllVersions, deck ? deck.local : id < 0)).then(() => {
        Navigation.dismissAllModals();
        setDeleting(false);
      });
    }
  }, [id, deck, deleting, setDeleting, deckDispatch]);

  const deleteAllDecks = useCallback(() => {
    deleteDeck(true);
  }, [deleteDeck]);

  const deleteSingleDeck = useCallback(() => {
    deleteDeck(false);
  }, [deleteDeck]);

  const actuallyDeleteBrokenDeck = useCallback(() => {
    if (!deleting) {
      setDeleting(true);

      deckDispatch(deleteDeckAction(id, false, id < 0)).then(() => {
        Navigation.dismissAllModals();
        setDeleting(false);
      });
    }
  }, [id, deckDispatch, deleting, setDeleting]);
  const deleteBrokenDeck = useCallback(() => {
    Alert.alert(
      t`Delete broken deck`,
      t`Looks like we are having trouble loading this deck for some reason`,
      [
        { text: t`Delete`, style: 'destructive', onPress: actuallyDeleteBrokenDeck },
        { text: t`Cancel`, style: 'cancel' },
      ]
    );
  }, [actuallyDeleteBrokenDeck]);

  const toggleCopyDialog = useCallback(() => {
    setMenuOpen(false);
    toggleCopying();
  }, [toggleCopying, setMenuOpen]);

  const savePressed = useCallback(() => {
    saveEdits();
  }, [saveEdits]);

  const onChecklistPressed = useCallback(() => {
    if (!deck || !cards || !deckEditsRef.current) {
      return;
    }
    setMenuOpen(false);
    const investigator = cards[deck.investigator_code];
    Navigation.push<DeckChecklistProps>(componentId, {
      component: {
        name: 'Deck.Checklist',
        passProps: {
          id: deck.id,
          slots: deckEditsRef.current.slots,
          tabooSetOverride: tabooSetId,
        },
        options: getDeckOptions(colors, { title: t`Checklist`, noTitle: true }, investigator),
      },
    });
  }, [componentId, deck, cards, tabooSetId, deckEditsRef, colors, setMenuOpen]);

  const onEditSpecialPressed = useCallback(() => {
    if (!deck || !cards) {
      return;
    }
    setMenuOpen(false);
    const investigator = cards[deck.investigator_code];
    Navigation.push<EditSpecialCardsProps>(componentId, {
      component: {
        name: 'Deck.EditSpecial',
        passProps: {
          campaignId: campaign ? campaign.id : undefined,
          id,
          assignedWeaknesses: addedBasicWeaknesses,
        },
        options: {
          statusBar: {
            style: 'light',
          },
          topBar: {
            title: {
              text: t`Edit Special Cards`,
              color: 'white',
            },
            backButton: {
              title: t`Back`,
              color: 'white',
            },
            background: {
              color: colors.faction[investigator ? investigator.factionCode() : 'neutral'].darkBackground,
            },
          },
        },
      },
    });
  }, [componentId, setMenuOpen, id, deck, cards, campaign, colors, addedBasicWeaknesses]);

  const onEditPressed = useCallback(() => {
    if (!deck || !cards) {
      return;
    }
    setMenuOpen(false);
    const investigator = cards[deck.investigator_code];
    Navigation.push<EditDeckProps>(componentId, {
      component: {
        name: 'Deck.Edit',
        passProps: {
          id,
        },
        options: {
          statusBar: {
            style: 'light',
          },
          topBar: {
            title: {
              text: t`Edit Deck`,
              color: 'white',
            },
            backButton: {
              title: t`Back`,
              color: 'white',
            },
            background: {
              color: colors.faction[investigator ? investigator.factionCode() : 'neutral'].darkBackground,
            },
          },
        },
      },
    });
  }, [componentId, deck, id, colors, setMenuOpen, cards]);

  const onUpgradePressed = useCallback(() => {
    if (!deck) {
      return;
    }
    setMenuOpen(false);
    Navigation.push<UpgradeDeckProps>(componentId, {
      component: {
        name: 'Deck.Upgrade',
        passProps: {
          id: deck.id,
          showNewDeck: true,
          campaignId: campaign ? campaign.id : undefined,
        },
        options: {
          statusBar: {
            style: 'light',
          },
          topBar: {
            title: {
              text: t`Upgrade Deck`,
              color: 'white',
            },
            subtitle: {
              text: parsedDeck ? parsedDeck.investigator.name : '',
              color: 'white',
            },
            background: {
              color: colors.faction[parsedDeck ? parsedDeck.investigator.factionCode() : 'neutral'].darkBackground,
            },
          },
        },
      },
    });
  }, [componentId, deck, campaign, colors, parsedDeck, setMenuOpen]);

  const dismissDeleteError = useCallback(() => {
    setDeleting(false);
    setDeleteError(undefined);
  }, [setDeleting, setDeleteError]);

  const dismissSaveError = useCallback(() => {
    setSaveError(undefined);
    setSaving(false);
  }, [setSaveError, setSaving]);

  const clearEdits = useCallback(() => {
    dispatch({ type: START_DECK_EDIT, id });
  }, [dispatch, id]);

  const copyDialog = useMemo(() => {
    return (
      <CopyDeckDialog
        componentId={componentId}
        deckId={copying ? id : undefined}
        toggleVisible={toggleCopyDialog}
        signedIn={signedIn}
      />
    );
  }, [componentId, id, signedIn, copying, toggleCopyDialog]);

  const showTabooPicker = useCallback(() => {
    setTabooOpen(true);
    setMenuOpen(false);
  }, [setMenuOpen, setTabooOpen]);

  const showEditDetails = useCallback(() => {
    setMenuOpen(false);
    setEditDetailsOpen(true);
  }, [setMenuOpen, setEditDetailsOpen]);

  const updateDeckDetails = useCallback((name: string, xpAdjustment: number) => {
    setEditDetailsOpen(false);
    dispatch({
      type: UPDATE_DECK_EDIT,
      id,
      updates: {
        nameChange: name,
        xpAdjustment,
      },
    });
  }, [dispatch, id, setEditDetailsOpen]);

  const editDetailsDialog = useMemo(() => {
    if (!deck || !parsedDeck || deckEdits?.xpAdjustment === undefined) {
      return null;
    }
    const {
      changes,
    } = parsedDeck;
    return (
      <EditDeckDetailsDialog
        visible={editDetailsOpen}
        xp={deck.xp || 0}
        spentXp={changes ? changes.spentXp : 0}
        xpAdjustment={deckEdits.xpAdjustment}
        xpAdjustmentEnabled={!!deck.previous_deck && !deck.next_deck}
        toggleVisible={toggleEditDetailsOpen}
        name={deckEdits.nameChange || deck.name}
        updateDetails={updateDeckDetails}
      />
    );
  }, [deck, parsedDeck, editDetailsOpen, toggleEditDetailsOpen, updateDeckDetails, deckEdits?.xpAdjustment, deckEdits?.nameChange]);

  const deletingDialog = useMemo(() => {
    if (deleteError) {
      return (
        <Dialog title={t`Error`} visible={deleting}>
          <Text style={[styles.errorMargin, typography.small]}>
            { deleteError }
          </Text>
          <DialogComponent.Button
            label={t`Okay`}
            onPress={dismissDeleteError}
          />
        </Dialog>
      );
    }
    return (
      <Dialog title={t`Deleting`} visible={deleting}>
        <ActivityIndicator
          style={styles.spinner}
          color={colors.lightText}
          size="large"
          animating
        />
      </Dialog>
    );
  }, [colors, typography, deleting, deleteError, dismissDeleteError]);

  const savingDialog = useMemo(() => {
    if (saveError) {
      return (
        <Dialog title={t`Error`} visible={saving}>
          <Text style={[styles.errorMargin, typography.small]}>
            { saveError }
          </Text>
          <DialogComponent.Button
            label={t`Okay`}
            onPress={dismissSaveError}
          />
        </Dialog>
      );
    }
    return (
      <Dialog title={t`Saving`} visible={saving}>
        <ActivityIndicator
          style={styles.spinner}
          color={colors.lightText}
          size="large"
          animating
        />
      </Dialog>
    );
  }, [colors, typography, saving, saveError, dismissSaveError]);

  const buttons = useMemo(() => {
    if (!deck || deck.next_deck || !hasPendingEdits) {
      return null;
    }
    return (
      <>
        <BasicButton
          title={t`Save Changes`}
          onPress={savePressed}
        />
        <BasicButton
          title={t`Discard Changes`}
          color={COLORS.red}
          onPress={clearEdits}
        />
      </>
    );
  }, [deck, hasPendingEdits, savePressed, clearEdits]);

  const showCardUpgradeDialog = useCallback((card: Card) => {
    if (!parsedDeck) {
      return;
    }
    Navigation.push<CardUpgradeDialogProps>(componentId, {
      component: {
        name: 'Dialog.CardUpgrade',
        passProps: {
          componentId,
          id,
          cardsByName: cardsByName[card.real_name] || [],
          investigator: parsedDeck.investigator,
        },
        options: getDeckOptions(colors, { title: card.name }, parsedDeck.investigator),
      },
    });
  }, [componentId, cardsByName, parsedDeck, id, colors]);

  const uploadLocalDeckPressed = useCallback(() => {
    doUploadLocalDeck();
  }, [doUploadLocalDeck]);

  const uploadToArkhamDB = useCallback(() => {
    if (!deck) {
      return;
    }
    setMenuOpen(false);
    if (hasPendingEdits) {
      Alert.alert(
        t`Save Local Changes`,
        t`Please save any local edits to this deck before sharing to ArkhamDB`
      );
    } else if (deck.next_deck || deck.previous_deck) {
      Alert.alert(
        t`Unsupported Operation`,
        t`This deck contains next/previous versions with upgrades, so we cannot upload it to ArkhamDB at this time.\n\nIf you would like to upload it, you can use Clone to upload a clone of the current deck.`
      );
    } else if (!signedIn) {
      Alert.alert(
        t`Sign in to ArkhamDB`,
        t`ArkhamDB is a popular deck building site where you can manage and share decks with others.\n\nSign in to access your decks or share decks you have created with others.`,
        [
          { text: t`Sign In`, onPress: login },
          { text: t`Cancel`, style: 'cancel' },
        ],
      );
    } else {
      Alert.alert(
        t`Upload to ArkhamDB`,
        t`You can upload your deck to ArkhamDB to share with others.\n\nAfter doing this you will need network access to make changes to the deck.`,
        [
          { text: t`Upload`, onPress: uploadLocalDeckPressed },
          { text: t`Cancel`, style: 'cancel' },
        ],
      );
    }
  }, [signedIn, login, deck, hasPendingEdits, setMenuOpen, uploadLocalDeckPressed]);

  const viewDeck = useCallback(() => {
    if (deck) {
      Linking.openURL(`https://arkhamdb.com/deck/view/${deck.id}`);
    }
  }, [deck]);

  const deleteDeckPressed = useCallback(() => {
    if (!deck) {
      return;
    }
    setMenuOpen(false);
    const options: AlertButton[] = [];
    const isLatestUpgrade = deck.previous_deck && !deck.next_deck;
    if (isLatestUpgrade) {
      options.push({
        text: t`Delete this upgrade (${deck.version})`,
        onPress: deleteSingleDeck,
        style: 'destructive',
      });
      options.push({
        text: t`Delete all versions`,
        onPress: deleteAllDecks,
        style: 'destructive',
      });
    } else {
      const isUpgraded = !!deck.next_deck;
      options.push({
        text: isUpgraded ? t`Delete all versions` : t`Delete`,
        onPress: deleteAllDecks,
        style: 'destructive',
      });
    }
    options.push({
      text: t`Cancel`,
      style: 'cancel',
    });

    Alert.alert(
      t`Delete deck`,
      t`Are you sure you want to delete this deck?`,
      options,
    );
  }, [deck, setMenuOpen, deleteSingleDeck, deleteAllDecks]);

  const showCardChartsPressed = useCallback(() => {
    setMenuOpen(false);
    if (parsedDeck) {
      showCardCharts(componentId, parsedDeck, colors);
    }
  }, [componentId, parsedDeck, colors, setMenuOpen]);

  const showUpgradeHistoryPressed = useCallback(() => {
    setMenuOpen(false);
    if (parsedDeck) {
      Navigation.push<DeckHistoryProps>(componentId, {
        component: {
          name: 'Deck.History',
          passProps: {
            id,
          },
          options: getDeckOptions(colors, { title: t`Upgrade History` }, parsedDeck.investigator),
        },
      });
    }
  }, [componentId, id, colors, parsedDeck, setMenuOpen]);

  const showDrawSimulatorPressed = useCallback(() => {
    setMenuOpen(false);
    if (parsedDeck) {
      showDrawSimulator(componentId, parsedDeck, colors);
    }
  }, [componentId, parsedDeck, colors, setMenuOpen]);

  const sideMenu = useMemo(() => {
    if (!deck || !parsedDeck || deckEdits?.xpAdjustment === undefined) {
      return null;
    }
    const {
      normalCardCount,
      totalCardCount,
    } = parsedDeck;
    const editable = isPrivate && deck && !deck.next_deck;
    const xp = (deck.xp || 0) + deckEdits.xpAdjustment;
    const adjustment = deckEdits.xpAdjustment >= 0 ? `+${deckEdits.xpAdjustment}` : `${deckEdits.xpAdjustment}`;
    const xpString = t`${xp} (${adjustment}) XP`;
    return (
      <ScrollView style={[styles.menu, backgroundStyle]}>
        <CardSectionHeader section={{ title: t`Deck` }} />
        { editable && (
          <>
            <SettingsButton
              onPress={showEditDetails}
              title={t`Name`}
              description={deckEdits.nameChange || deck.name}
              descriptionStyle={typography.small}
              titleStyle={typography.text}
              containerStyle={backgroundStyle}
            />
            <SettingsButton
              onPress={showTabooPicker}
              title={t`Taboo List`}
              titleStyle={typography.text}
              containerStyle={backgroundStyle}
              description={tabooSet ? tabooSet.date_start : t`None`}
              descriptionStyle={typography.small}
            />
            { !deck.local && (
              <SettingsButton
                title={t`Deck Id`}
                titleStyle={typography.text}
                containerStyle={backgroundStyle}
                description={`${deck.id}`}
                descriptionStyle={typography.small}
                onPress={showEditDetails}
                disabled
              />
            ) }
          </>
        ) }
        <CardSectionHeader section={{ title: t`Cards` }} />
        { editable && (
          <>
            <SettingsButton
              onPress={onEditPressed}
              title={t`Edit Cards`}
              titleStyle={typography.text}
              containerStyle={backgroundStyle}
              description={ngettext(
                msgid`${normalCardCount} Card (${totalCardCount} Total)`,
                `${normalCardCount} Cards (${totalCardCount} Total)`,
                normalCardCount
              )}
              descriptionStyle={typography.small}
            />
            <SettingsButton
              onPress={onEditSpecialPressed}
              title={t`Story Assets`}
              titleStyle={typography.text}
              containerStyle={backgroundStyle}
            />
            <SettingsButton
              onPress={onEditSpecialPressed}
              title={t`Weaknesses`}
              titleStyle={typography.text}
              containerStyle={backgroundStyle}
            />
          </>
        ) }
        { SHOW_CHECKLIST_EDITOR && (
          <SettingsButton
            onPress={onChecklistPressed}
            title={t`Checklist`}
            titleStyle={typography.text}
            containerStyle={backgroundStyle}
          />
        ) }
        <SettingsButton
          onPress={showCardChartsPressed}
          title={t`Charts`}
          titleStyle={typography.text}
          containerStyle={backgroundStyle}
        />
        <SettingsButton
          onPress={showDrawSimulatorPressed}
          title={t`Draw Simulator`}
          titleStyle={typography.text}
          containerStyle={backgroundStyle}
        />
        { editable && (
          <>
            <CardSectionHeader section={{ title: t`Campaign` }} />
            <SettingsButton
              onPress={onUpgradePressed}
              title={t`Upgrade Deck`}
              titleStyle={typography.text}
              containerStyle={backgroundStyle}
              disabled={!!hasPendingEdits}
              description={hasPendingEdits ? t`Save changes before upgrading` : undefined}
              descriptionStyle={typography.small}
            />
            { !!deck.previous_deck && (
              <SettingsButton
                onPress={showEditDetails}
                title={t`Available XP`}
                titleStyle={typography.text}
                containerStyle={backgroundStyle}
                description={xpString}
                descriptionStyle={typography.small}
              />
            ) }
            { !!deck.previous_deck && (
              <SettingsButton
                onPress={showUpgradeHistoryPressed}
                title={t`Upgrade History`}
                titleStyle={typography.text}
                containerStyle={backgroundStyle}
              />
            ) }
          </>
        ) }
        <CardSectionHeader section={{ title: t`Options` }} />
        <SettingsButton
          onPress={toggleCopyDialog}
          title={t`Clone`}
          titleStyle={typography.text}
          containerStyle={backgroundStyle}
        />
        { deck.local ? (
          <SettingsButton
            onPress={uploadToArkhamDB}
            title={t`Upload to ArkhamDB`}
            titleStyle={typography.text}
            containerStyle={backgroundStyle}
          />
        ) : (
          <SettingsButton
            title={t`View on ArkhamDB`}
            onPress={viewDeck}
            titleStyle={typography.text}
            containerStyle={backgroundStyle}
          />
        ) }
        { !!isPrivate && (
          <SettingsButton
            title={t`Delete`}
            titleStyle={styles.destructive}
            containerStyle={backgroundStyle}
            onPress={deleteDeckPressed}
          />
        ) }
      </ScrollView>
    );
  }, [backgroundStyle, typography, isPrivate, deck, deckEdits?.xpAdjustment, deckEdits?.nameChange, hasPendingEdits, tabooSet, parsedDeck,
    showUpgradeHistoryPressed, toggleCopyDialog, deleteDeckPressed, viewDeck, uploadToArkhamDB,
    onUpgradePressed, showCardChartsPressed, showDrawSimulatorPressed, showEditDetails, showTabooPicker,
    onEditPressed, onEditSpecialPressed, onChecklistPressed,
  ]);

  if (!deck) {
    return (
      <View style={[styles.activityIndicatorContainer, backgroundStyle]}>
        <ActivityIndicator
          style={styles.spinner}
          color={colors.lightText}
          size="small"
          animating
        />
        <BasicButton
          title={t`Delete Deck`}
          onPress={deleteBrokenDeck}
          color={COLORS.red}
        />
      </View>
    );
  }
  if (!parsedDeck || !cards || !deckEdits) {
    return (
      <View style={[styles.activityIndicatorContainer, backgroundStyle]}>
        <ActivityIndicator
          style={styles.spinner}
          color={colors.lightText}
          size="small"
          animating
        />
      </View>
    );
  }
  const menuWidth = Math.min(width * 0.60, 240);
  const editable = !!isPrivate && !!deck && !deck.next_deck;
  const showTaboo: boolean = !!(tabooSetId !== deck.taboo_id && (tabooSetId || deck.taboo_id));
  return (
    <View style={[styles.flex, backgroundStyle]}>
      <SideMenu
        isOpen={menuOpen}
        onChange={setMenuOpen}
        menu={sideMenu}
        openMenuOffset={menuWidth}
        autoClosing
        menuPosition="right"
      >
        <View>
          <View style={[styles.container, backgroundStyle] }>
            <DeckViewTab
              componentId={componentId}
              visible={visible}
              inCollection={inCollection}
              parallelInvestigators={parallelInvestigators}
              investigatorFront={investigatorFront}
              investigatorBack={investigatorBack}
              deck={deck}
              editable={editable}
              tabooSet={tabooSet}
              tabooSetId={tabooSetId}
              showTaboo={showTaboo}
              tabooOpen={tabooOpen}
              singleCardView={singleCardView}
              parsedDeck={parsedDeck}
              problem={problem}
              hasPendingEdits={hasPendingEdits}
              cards={cards}
              cardsByName={cardsByName}
              bondedCardsByName={bondedCardsByName}
              isPrivate={!!isPrivate}
              buttons={buttons}
              showEditCards={onEditPressed}
              showDeckUpgrade={onUpgradePressed}
              showDeckHistory={showUpgradeHistoryPressed}
              showEditNameDialog={showEditDetails}
              showCardUpgradeDialog={showCardUpgradeDialog}
              showEditSpecial={deck.next_deck ? undefined : onEditSpecialPressed}
              signedIn={signedIn}
              login={login}
              campaign={campaign}
              hideCampaign={hideCampaign}
              showTraumaDialog={showTraumaDialog}
              investigatorDataUpdates={investigatorDataUpdates}
              width={width}
            />
            <DeckNavFooter deckId={id} componentId={componentId} />
          </View>
          { editDetailsDialog }
        </View>
      </SideMenu>
      { savingDialog }
      { deletingDialog }
      { copyDialog }
    </View>
  );
}

export default withTraumaDialog(withLoginState(DeckDetailView));

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  spinner: {
    height: 80,
  },
  activityIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  errorMargin: {
    padding: m,
  },
  menu: {
    borderLeftWidth: 2,
    borderColor: COLORS.darkGray,
  },
  destructive: {
    color: COLORS.red,
  },
});

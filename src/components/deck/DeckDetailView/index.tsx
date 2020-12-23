import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { find, forEach } from 'lodash';
import {
  Alert,
  AlertButton,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation, OptionsTopBarButton } from 'react-native-navigation';
import { ngettext, msgid, t } from 'ttag';
import SideMenu from 'react-native-side-menu-updated';
import ActionButton from 'react-native-action-button';

import MenuButton from '@components/core/MenuButton';
import BasicButton from '@components/core/BasicButton';
import withLoginState, { LoginStateProps } from '@components/core/withLoginState';
import CopyDeckDialog from '@components/deck/CopyDeckDialog';
import { iconsMap } from '@app/NavIcons';
import { deleteDeckAction } from '@components/deck/actions';
import { UPDATE_DECK_EDIT } from '@actions/types';
import { DeckChecklistProps } from '@components/deck/DeckChecklistView';
import Card from '@data/Card';
import { EditDeckProps } from '../DeckEditView';
import { UpgradeDeckProps } from '../DeckUpgradeDialog';
import { DeckHistoryProps } from '../DeckHistoryView';
import { EditSpecialCardsProps } from '../EditSpecialDeckCardsView';
import DeckViewTab from './DeckViewTab';
import DeckNavFooter from '@components/deck/NewDeckNavFooter';
import {
  makeCampaignSelector,
  makeCampaignForDeckSelector,
  getPacksInCollection,
  AppState,
} from '@reducers';
import space, { xs, s } from '@styles/space';
import COLORS from '@styles/colors';
import { getDeckOptions, showCardCharts, showDrawSimulator } from '@components/nav/helper';
import StyleContext from '@styles/StyleContext';
import { useParsedDeck } from '@components/deck/hooks';
import { useAdjustXpDialog, useBasicDialog, useSaveDialog, useTextDialog, useUploadLocalDeckDialog } from '@components/deck/dialogs';
import { useBackButton, useFlag, useInvestigatorCards, useNavigationButtonPressed, useTabooSet } from '@components/core/hooks';
import { NavigationProps } from '@components/nav/types';
import DeckBubbleHeader from '../section/DeckBubbleHeader';
import { CUSTOM_INVESTIGATOR } from '@app_constants';
import AppIcon from '@icons/AppIcon';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import DeckButton from '../controls/DeckButton';
import { CardUpgradeDialogProps } from '../CardUpgradeDialog';
import DeckProblemBanner from '../DeckProblemBanner';

export interface DeckDetailProps {
  id: number;
  upgrade?: boolean;
  title?: string;
  subtitle?: string;
  campaignId?: number;
  hideCampaign?: boolean;
  isPrivate?: boolean;
  modal?: boolean;
}

type Props = NavigationProps &
  DeckDetailProps &
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
  upgrade,
}: Props) {
  const { backgroundStyle, colors, darkMode, typography, shadow } = useContext(StyleContext);
  const dispatch = useDispatch();
  const deckDispatch: DeckDispatch = useDispatch();
  const { width } = useWindowDimensions();

  const singleCardView = useSelector((state: AppState) => state.settings.singleCardView || false);
  const parsedDeckObj = useParsedDeck(id, 'DeckDetail', componentId, true, upgrade);
  const campaignSelector = useMemo(makeCampaignSelector, []);
  const campaignForDeckSelector = useMemo(makeCampaignForDeckSelector, []);
  const campaign = useSelector((state: AppState) => campaignId ? campaignSelector(state, campaignId) : campaignForDeckSelector(state, deck?.id || id));
  const { savingDialog, saveEdits, saveEditsAndDismiss, addedBasicWeaknesses, hasPendingEdits, mode } = useSaveDialog(parsedDeckObj, campaign);
  const { showXpAdjustmentDialog, xpAdjustmentDialog } = useAdjustXpDialog(parsedDeckObj);
  const {
    deck,
    cards,
    deckEdits,
    deckEditsRef,
    visible,
    parsedDeck,
    tabooSetId,
  } = parsedDeckObj;
  const [copying, toggleCopying] = useFlag(false);
  const {
    saving: deleting,
    setSaving: setDeleting,
    savingDialog: deletingDialog,
  } = useBasicDialog(t`Deleting`);
  const [menuOpen, toggleMenuOpen, setMenuOpen] = useFlag(false);
  const [tabooOpen, setTabooOpen] = useState(false);
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
  const inCollection = useSelector(getPacksInCollection);

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

  const setMode = useCallback((mode: 'view' | 'edit' | 'upgrade') => {
    dispatch({
      type: UPDATE_DECK_EDIT,
      id,
      updates: {
        mode,
      },
    });
  }, [dispatch, id]);

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
  useBackButton(handleBackPress);

  const factionColor = useMemo(() => colors.faction[parsedDeck?.investigator.factionCode() || 'neutral'].background, [parsedDeck, colors.faction]);
  useEffect(() => {
    const textColors = {
      view: '#FFFFFF',
      edit: COLORS.L30,
      upgrade: COLORS.D30,
    };
    const textColor = textColors[mode];
    const backgroundColors = {
      view: factionColor,
      edit: darkMode ? COLORS.D20 : COLORS.D10,
      upgrade: colors.upgrade,
    };
    const statusBarStyles: { [key: string]: 'light' | 'dark' | undefined } = {
      view: 'light',
      edit: 'light',
      upgrade: 'dark',
    };
    const backgroundColor = backgroundColors[mode];
    const titles = {
      view: title,
      upgrade: t`Upgrading deck`,
      edit: t`Editing deck`,
    };
    const rightButtons: OptionsTopBarButton[] = [{
      id: 'menu',
      icon: iconsMap.menu,
      color: textColor,
      accessibilityLabel: t`Menu`,
    }];
    const leftButtons = modal ? [
      Platform.OS === 'ios' ? {
        text: t`Done`,
        id: 'back',
        color: textColor,
      } : {
        icon: iconsMap['arrow-left'],
        id: 'androidBack',
        color: textColor,
      },
    ] : [];


    Navigation.mergeOptions(componentId, {
      statusBar: {
        style: statusBarStyles[mode],
        backgroundColor,
      },
      topBar: {
        title: {
          text: titles[mode],
          color: textColor,
        },
        subtitle: {
          text: name || subtitle,
          color: textColor,
        },
        background: {
          color: backgroundColor,
        },
        leftButtons,
        rightButtons,
      },
    });
  }, [modal, darkMode, componentId, mode, colors, factionColor, name, subtitle, title]);
  const { uploadLocalDeck, uploadLocalDeckDialog } = useUploadLocalDeckDialog(deck, parsedDeck);

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
    if (!deckEditsRef.current?.mode || deckEditsRef.current.mode === 'view') {
      setMode('edit');
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
              color: colors.faction[investigator ? investigator.factionCode() : 'neutral'].background,
            },
          },
        },
      },
    });
  }, [componentId, setMenuOpen, id, deck, cards, campaign, colors, addedBasicWeaknesses, deckEditsRef, setMode]);


  const onAddCardsPressed = useCallback(() => {
    if (!deck || !cards) {
      return;
    }
    if (!deckEditsRef.current?.mode || deckEditsRef.current.mode === 'view') {
      setMode('edit');
    }
    setMenuOpen(false);
    const investigator = cards[deck.investigator_code];
    Navigation.push<EditDeckProps>(componentId, {
      component: {
        name: 'Deck.EditAddCards',
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
              color: colors.faction[investigator ? investigator.factionCode() : 'neutral'].background,
            },
          },
        },
      },
    });
  }, [componentId, deck, id, colors, setMenuOpen, cards, deckEditsRef, setMode]);

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
              color: colors.faction[parsedDeck ? parsedDeck.investigator.factionCode() : 'neutral'].background,
            },
          },
        },
      },
    });
  }, [componentId, deck, campaign, colors, parsedDeck, setMenuOpen]);

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

  const updateDeckName = useCallback((name: string) => {
    dispatch({
      type: UPDATE_DECK_EDIT,
      id,
      updates: {
        nameChange: name,
      },
    });
  }, [dispatch, id]);
  const { dialog: editNameDialog, showDialog: showEditNameDialog } = useTextDialog({
    title: t`Deck name`,
    onValueChange: updateDeckName,
    value: name || '',
  });
  const editable = !!isPrivate && !!deck && !deck.next_deck;
  const onEditPressed = useCallback(() => setMode('edit'), [setMode]);
  const buttons = useMemo(() => {
    if (!parsedDeck || !deck || deck.next_deck) {
      return null;
    }
    if (!hasPendingEdits && editable) {
      if (!deckEdits?.mode || deckEdits.mode !== 'view') {
        return null;
      }
      const { normalCardCount: normalCards, totalCardCount } = parsedDeck;
      const normalCardCount = ngettext(msgid`${normalCards} card`, `${normalCards} cards`, normalCards);
      const details = ngettext(msgid`${normalCardCount} · ${totalCardCount} total`, `${normalCardCount} · ${totalCardCount} total`, totalCardCount);
      return (
        <View style={[styles.row, space.marginS]}>
          <View style={[space.marginRightXs, styles.flex]}>
            <DeckButton
              title={t`Edit`}
              detail={details}
              icon="edit"
              onPress={onEditPressed}
            />
          </View>
          <View style={[space.marginLeftXs, styles.flex]}>
            <DeckButton
              title={t`Upgrade`}
              detail={t`Add scenario XP`}
              icon="upgrade"
              color="gold"
              onPress={onUpgradePressed}
            />
          </View>
        </View>
      );
    }
    return null;
  }, [deck, hasPendingEdits, editable, parsedDeck, deckEdits, onEditPressed, onUpgradePressed]);

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
          { text: t`Upload`, onPress: uploadLocalDeck },
          { text: t`Cancel`, style: 'cancel' },
        ],
      );
    }
  }, [signedIn, login, deck, hasPendingEdits, setMenuOpen, uploadLocalDeck]);

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
      <ScrollView style={[styles.menu, backgroundStyle, space.paddingS]}>
        <DeckBubbleHeader title={t`Deck`} />
        { editable && (
          <>
            <MenuButton
              onPress={showEditNameDialog}
              title={deckEdits.nameChange || deck.name}
              description={!deck.local ? t`Deck #${deck.id}` : undefined}
            />
            <MenuButton
              title={t`Taboo`}
              onPress={showTabooPicker}
              icon="taboo_thin"
              description={tabooSet ? tabooSet.date_start : t`None`}
              last
            />
          </>
        ) }
        <DeckBubbleHeader title={t`Tools`} />
        <MenuButton
          onPress={showCardChartsPressed}
          title={t`Charts`}
          icon="chart"
          description={t`For balancing and evaluating`}
        />
        <MenuButton
          onPress={showDrawSimulatorPressed}
          title={t`Draw Simulator`}
          icon="draw"
          description={t`Check your deck stability`}
        />
        <MenuButton
          icon="checklist"
          onPress={onChecklistPressed}
          title={t`Checklist`}
          description={t`For easy deck assembly`}
          last
        />
        { editable && (
          <>
            <DeckBubbleHeader title={t`Cards`} />
            <MenuButton
              onPress={onAddCardsPressed}
              icon="card-outline"
              title={t`Deck Cards`}
              description={ngettext(
                msgid`${normalCardCount} Card (${totalCardCount} Total)`,
                `${normalCardCount} Cards (${totalCardCount} Total)`,
                normalCardCount
              )}
            />
            <MenuButton
              onPress={onEditSpecialPressed}
              icon="special_cards"
              title={t`Special Cards`}
              description={t`Story assets and weaknesses`}
              last
            />
          </>
        ) }
        { editable && (
          <>
            <DeckBubbleHeader title={t`Campaign`} />
            { !!deck.previous_deck && (
              <MenuButton
                icon="xp"
                onPress={showXpAdjustmentDialog}
                title={t`Available XP`}
                description={xpString}
              />
            ) }
            <MenuButton
              icon="upgrade"
              onPress={onUpgradePressed}
              title={t`Upgrade Deck`}
              disabled={!!hasPendingEdits}
              description={hasPendingEdits ? t`Save changes before upgrading` : undefined}
              last={!deck.previous_deck}
            />
            { !!deck.previous_deck && (
              <MenuButton
                icon="deck"
                onPress={showUpgradeHistoryPressed}
                title={t`Upgrade History`}
                last
              />
            ) }
          </>
        ) }
        <DeckBubbleHeader title={t`Options`} />
        <MenuButton
          icon="copy"
          onPress={toggleCopyDialog}
          title={t`Clone deck`}
        />
        { deck.investigator_code !== CUSTOM_INVESTIGATOR && (deck.local ? (
          <MenuButton
            icon="world"
            onPress={uploadToArkhamDB}
            title={t`Upload to ArkhamDB`}
            last={!isPrivate}
          />
        ) : (
          <MenuButton
            icon="world"
            title={t`View on ArkhamDB`}
            description={t`Open in browser`}
            onPress={viewDeck}
            last={!isPrivate}
          />
        )) }
        { !!isPrivate && (
          <MenuButton
            icon="delete"
            title={t`Delete deck`}
            onPress={deleteDeckPressed}
            last
          />
        ) }
      </ScrollView>
    );
  }, [backgroundStyle, onAddCardsPressed, isPrivate, deck, deckEdits?.xpAdjustment, deckEdits?.nameChange, hasPendingEdits, tabooSet, parsedDeck,
    showUpgradeHistoryPressed, toggleCopyDialog, deleteDeckPressed, viewDeck, uploadToArkhamDB,
    onUpgradePressed, showCardChartsPressed, showDrawSimulatorPressed, showEditNameDialog, showXpAdjustmentDialog, showTabooPicker,
    onEditSpecialPressed, onChecklistPressed,
  ]);

  const [fabOpen, toggleFabOpen] = useFlag(false);
  const fabIcon = useCallback((active: boolean) => {
    if (active) {
      return <AppIcon name="plus-thin" color={colors.L30} size={32} />;
    }
    if (editable && mode === 'view') {
      return <AppIcon name="edit" color="white" size={24} />;
    }
    return <AppIcon name="plus-thin" color={colors.L30} size={24} />;
  }, [colors, editable, mode]);

  const fab = useMemo(() => {
    const actionLabelStyle = {
      ...typography.small,
      color: colors.L30,
      paddingTop: 5,
      paddingLeft: s,
      paddingRight: s,
    };
    const actionContainerStyle = {
      backgroundColor: colors.D20,
      borderRadius: 16,
      borderWidth: 0,
      minHeight: 32,
      marginTop: -3,
    };
    return (
      <ActionButton
        active={fabOpen}
        buttonColor={(mode !== 'view' || fabOpen) ? colors.D10 : factionColor}
        renderIcon={fabIcon}
        onPress={toggleFabOpen}
        offsetX={s + xs}
        offsetY={NOTCH_BOTTOM_PADDING + s + xs}
        shadowStyle={shadow.large}
        fixNativeFeedbackRadius
      >
        <ActionButton.Item
          buttonColor={factionColor}
          textStyle={actionLabelStyle}
          textContainerStyle={actionContainerStyle}
          title={t`Draw simulator`}
          onPress={showDrawSimulatorPressed}
        >
          <AppIcon name="draw" color={colors.L30} size={34} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor={factionColor}
          textStyle={actionLabelStyle}
          textContainerStyle={actionContainerStyle}
          title={t`Charts`}
          onPress={showCardChartsPressed}
        >
          <AppIcon name="chart" color={colors.L30} size={34} />
        </ActionButton.Item>
        { editable && mode === 'view' && (
          <ActionButton.Item
            buttonColor={factionColor}
            textStyle={actionLabelStyle}
            textContainerStyle={actionContainerStyle}
            title={t`Upgrade with XP`}
            onPress={onUpgradePressed}
          >
            <AppIcon name="upgrade" color={colors.L30} size={32} />
          </ActionButton.Item>
        ) }
        { editable && (mode === 'view' ? (
          <ActionButton.Item
            buttonColor={factionColor}
            textStyle={actionLabelStyle}
            textContainerStyle={actionContainerStyle}
            title={t`Edit`}
            onPress={onEditPressed}
          >
            <AppIcon name="edit" color={colors.L30} size={24} />
          </ActionButton.Item>
        ) : (
          <ActionButton.Item
            buttonColor={factionColor}
            textStyle={actionLabelStyle}
            textContainerStyle={actionContainerStyle}
            title={t`Add cards`}
            onPress={onAddCardsPressed}
          >
            <AppIcon name="plus-thin" color={colors.L30} size={24} />
          </ActionButton.Item>
        )) }
      </ActionButton>
    );
  }, [factionColor, fabOpen, editable, mode, shadow.large, fabIcon, colors, toggleFabOpen, onEditPressed, onAddCardsPressed, onUpgradePressed, showCardChartsPressed, showDrawSimulatorPressed, typography]);

  if (!deck) {
    return (
      <View style={[styles.activityIndicatorContainer, backgroundStyle]}>
        <LoadingSpinner inline />
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
      <LoadingSpinner large />
    );
  }
  const menuWidth = Math.min(width * 0.60, 240);
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
              showEditCards={onAddCardsPressed}
              showDeckUpgrade={onUpgradePressed}
              showDeckHistory={showUpgradeHistoryPressed}
              showXpAdjustmentDialog={showXpAdjustmentDialog}
              showCardUpgradeDialog={showCardUpgradeDialog}
              showEditSpecial={deck.next_deck ? undefined : onEditSpecialPressed}
              signedIn={signedIn}
              login={login}
              campaign={campaign}
              hideCampaign={hideCampaign}
              width={width}
              deckEdits={deckEdits}
              deckEditsRef={deckEditsRef}
              mode={mode}
            />
            { !!parsedDeck.problem && mode !== 'view' && (
              <DeckProblemBanner
                faction={parsedDeck.investigator.factionCode()}
                problem={parsedDeck.problem}
              />
            ) }
            { mode !== 'view' && (
              <DeckNavFooter
                deckId={id}
                componentId={componentId}
                control="fab"
                campaign={campaign}
                onPress={saveEdits}
              />
            ) }
            { fab }
          </View>
        </View>
      </SideMenu>
      { editNameDialog }
      { xpAdjustmentDialog }
      { savingDialog }
      { uploadLocalDeckDialog }
      { deletingDialog }
      { copyDialog }
    </View>
  );
}

export default withLoginState(DeckDetailView);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  activityIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  menu: {
    borderLeftWidth: 2,
    borderColor: COLORS.darkGray,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

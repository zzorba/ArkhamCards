import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { find, forEach } from 'lodash';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
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
import { CampaignId, DeckId, getDeckId, UPDATE_DECK_EDIT } from '@actions/types';
import { DeckChecklistProps } from '@components/deck/DeckChecklistView';
import Card from '@data/types/Card';
import { EditDeckProps } from '../DeckEditView';
import { UpgradeDeckProps } from '../DeckUpgradeDialog';
import { DeckHistoryProps } from '../DeckHistoryView';
import { EditSpecialCardsProps } from '../EditSpecialDeckCardsView';
import DeckViewTab from './DeckViewTab';
import DeckNavFooter from '@components/deck/DeckNavFooter';
import { AppState } from '@reducers';
import space, { xs, s } from '@styles/space';
import COLORS from '@styles/colors';
import { getDeckOptions, showCardCharts, showDrawSimulator } from '@components/nav/helper';
import StyleContext from '@styles/StyleContext';
import { useParsedDeckWithFetch, useShowDrawWeakness } from '@components/deck/hooks';
import { useAdjustXpDialog, AlertButton, useAlertDialog, useBasicDialog, useSaveDialog, useSimpleTextDialog, useUploadLocalDeckDialog } from '@components/deck/dialogs';
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
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useCampaign } from '@data/hooks';
import { useDeckActions } from '@data/remote/decks';
import { format } from 'date-fns';
import LanguageContext from '@lib/i18n/LanguageContext';

export interface DeckDetailProps {
  id: DeckId;
  initialMode?: 'upgrade' | 'edit';
  title?: string;
  subtitle?: string;
  campaignId: CampaignId | undefined;
  modal?: boolean;
}

type Props = NavigationProps &
  DeckDetailProps &
  LoginStateProps;
type DeckDispatch = ThunkDispatch<AppState, unknown, Action<string>>;

function formatTabooStart(date_start: string | undefined, locale: string) {
  if (!date_start) {
    return '';
  }
  const date = new Date(Date.parse(date_start));
  if (locale === 'fr') {
    return format(date, 'dd/MM/yyyy');
  }
  return format(date, 'yyyy/MM/dd');
}

function DeckDetailView({
  componentId,
  id,
  title,
  subtitle,
  campaignId,
  modal,
  signedIn,
  login,
  initialMode,
}: Props) {
  const { lang, arkhamDbDomain } = useContext(LanguageContext);
  const { backgroundStyle, colors, darkMode, typography, shadow, width } = useContext(StyleContext);
  const deckActions = useDeckActions();
  const campaign = useCampaign(campaignId);
  const dispatch = useDispatch();
  const deckDispatch: DeckDispatch = useDispatch();
  const { userId, arkhamDbUser, arkhamDb } = useContext(ArkhamCardsAuthContext);
  const singleCardView = useSelector((state: AppState) => state.settings.singleCardView || false);
  const parsedDeckObj = useParsedDeckWithFetch(id, componentId, deckActions, initialMode);
  const [xpAdjustmentDialog, showXpAdjustmentDialog] = useAdjustXpDialog(parsedDeckObj);
  const {
    deck,
    deckT,
    cards,
    deckEdits,
    deckEditsRef,
    visible,
    parsedDeck,
    tabooSetId,
  } = parsedDeckObj;

  const deckId = useMemo(() => deck ? getDeckId(deck) : id, [deck, id]);
  const { savingDialog, saveEdits, saveEditsAndDismiss, addedBasicWeaknesses, hasPendingEdits, mode } = useSaveDialog(parsedDeckObj);

  const [copying, toggleCopying] = useFlag(false);
  const [
    deletingDialog,
    deleting,
    setDeleting,
  ] = useBasicDialog(t`Deleting`);
  const [menuOpen, toggleMenuOpen, setMenuOpen] = useFlag(false);
  const [fabOpen, toggleFabOpen, setFabOpen] = useFlag(false);
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

  const [cardsByName, bondedCardsByName] = useMemo(() => {
    const cardsByName: {
      [name: string]: Card[];
    } = {};
    const bondedCardsByName: {
      [name: string]: Card[];
    } = {};
    forEach(cards, card => {
      if (card) {
        const real_name = card.real_name.toLowerCase();
        if (cardsByName[real_name]) {
          cardsByName[real_name].push(card);
        } else {
          cardsByName[real_name] = [card];
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
  const [alertDialog, showAlert] = useAlertDialog();

  const handleBackPress = useCallback(() => {
    if (!visible) {
      return false;
    }
    if (hasPendingEdits) {
      showAlert(
        t`Save deck changes?`,
        t`Looks like you have made some changes that have not been saved.`,
        [{
          text: t`Cancel`,
          style: 'cancel',
        }, {
          text: t`Discard Changes`,
          style: 'destructive',
          onPress: () => {
            Navigation.dismissAllModals();
          },
        }, {
          text: t`Save Changes`,
          onPress: () => {
            saveEditsAndDismiss();
          },
        }],
      );
    } else {
      Navigation.dismissAllModals();
    }
    return true;
  }, [visible, hasPendingEdits, saveEditsAndDismiss, showAlert]);

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
  const hasInvestigator = !!parsedDeck?.investigator;
  const factionColor = useMemo(() => colors.faction[parsedDeck?.investigator.factionCode() || 'neutral'].background, [parsedDeck, colors.faction]);
  useEffect(() => {
    if (hasInvestigator) {
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
    }
  }, [modal, hasInvestigator, darkMode, componentId, mode, colors, factionColor, name, subtitle, title]);
  const [uploadLocalDeckDialog, uploadLocalDeck] = useUploadLocalDeckDialog(deckActions, deck, parsedDeck);

  useEffect(() => {
    if (!deck) {
      if (!deleting && !id.local && !id.serverId) {
        showAlert(
          t`Deck has been deleted`,
          t`It looks like you deleted this deck from ArkhamDB.\n\n If it was part of a campaign you can add the same investigator back to restore your campaign data.`,
          [{
            text: t`Okay`,
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

      deckDispatch(deleteDeckAction(userId, deckActions, id, deleteAllVersions)).then(() => {
        Navigation.dismissAllModals();
        setDeleting(false);
      });
    }
  }, [id, deleting, userId, deckActions, setDeleting, deckDispatch]);

  const deleteAllDecks = useCallback(() => {
    deleteDeck(true);
  }, [deleteDeck]);

  const deleteSingleDeck = useCallback(() => {
    deleteDeck(false);
  }, [deleteDeck]);

  const actuallyDeleteBrokenDeck = useCallback(() => {
    if (!deleting) {
      setDeleting(true);

      deckDispatch(deleteDeckAction(userId, deckActions, id, false)).then(() => {
        Navigation.dismissAllModals();
        setDeleting(false);
      });
    }
  }, [id, deckDispatch, deckActions, deleting, userId, setDeleting]);
  const deleteBrokenDeck = useCallback(() => {
    showAlert(
      t`Delete broken deck`,
      t`Looks like we are having trouble loading this deck for some reason`,
      [
        { text: t`Cancel`, style: 'cancel' },
        { text: t`Delete`, style: 'destructive', onPress: actuallyDeleteBrokenDeck },
      ]
    );
  }, [actuallyDeleteBrokenDeck, showAlert]);

  const toggleCopyDialog = useCallback(() => {
    setFabOpen(false);
    setMenuOpen(false);
    toggleCopying();
  }, [toggleCopying, setFabOpen, setMenuOpen]);

  const onChecklistPressed = useCallback(() => {
    if (!deck || !cards || !deckEditsRef.current) {
      return;
    }
    setFabOpen(false);
    setMenuOpen(false);
    const investigator = cards[deck.investigator_code];
    Navigation.push<DeckChecklistProps>(componentId, {
      component: {
        name: 'Deck.Checklist',
        passProps: {
          id: deckId,
          slots: deckEditsRef.current.slots,
          tabooSetOverride: tabooSetId,
        },
        options: getDeckOptions(colors, { title: t`Checklist`, noTitle: true }, investigator),
      },
    });
  }, [componentId, deck, deckId, cards, tabooSetId, deckEditsRef, colors, setFabOpen, setMenuOpen]);

  const showDrawWeakness = useShowDrawWeakness({
    componentId,
    deck: deckT,
    id,
    campaignId,
    showAlert,
    deckEditsRef,
    assignedWeaknesses: addedBasicWeaknesses,
    cards,
  });

  const onEditSpecialPressed = useCallback(() => {
    if (!deck || !cards) {
      return;
    }
    if (!deckEditsRef.current?.mode || deckEditsRef.current.mode === 'view') {
      setMode('edit');
    }
    setFabOpen(false);
    setMenuOpen(false);
    const investigator = cards[deck.investigator_code];
    const backgroundColor = colors.faction[investigator ? investigator.factionCode() : 'neutral'].background;
    Navigation.push<EditSpecialCardsProps>(componentId, {
      component: {
        name: 'Deck.EditSpecial',
        passProps: {
          campaignId: campaign?.id,
          id,
          assignedWeaknesses: addedBasicWeaknesses,
        },
        options: {
          statusBar: {
            style: 'light',
            backgroundColor,
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
              color: backgroundColor,
            },
          },
        },
      },
    });
  }, [componentId, setFabOpen, setMenuOpen, id, deck, cards, campaign, colors, addedBasicWeaknesses, deckEditsRef, setMode]);

  const onEditSidePressed = useCallback(() => {
    if (!deck || !cards) {
      return;
    }
    if (!deckEditsRef.current?.mode || deckEditsRef.current.mode === 'view') {
      setMode('edit');
    }
    setFabOpen(false);
    setMenuOpen(false);
    const investigator = cards[deck.investigator_code];
    const backgroundColor = colors.faction[investigator ? investigator.factionCode() : 'neutral'].background;
    Navigation.push<EditDeckProps>(componentId, {
      component: {
        name: 'Deck.EditAddCards',
        passProps: {
          id,
          side: true,
        },
        options: {
          statusBar: {
            style: 'light',
            backgroundColor,
          },
          topBar: {
            title: {
              text: t`Edit Side Deck`,
              color: 'white',
            },
            backButton: {
              title: t`Back`,
              color: 'white',
            },
            background: {
              color: backgroundColor,
            },
          },
        },
      },
    });
  }, [componentId, deck, id, colors, setFabOpen, setMenuOpen, cards, deckEditsRef, setMode]);

  const onAddCardsPressed = useCallback(() => {
    if (!deck || !cards) {
      return;
    }
    if (!deckEditsRef.current?.mode || deckEditsRef.current.mode === 'view') {
      setMode('edit');
    }
    setFabOpen(false);
    setMenuOpen(false);
    const investigator = cards[deck.investigator_code];
    const backgroundColor = colors.faction[investigator ? investigator.factionCode() : 'neutral'].background;
    Navigation.push<EditDeckProps>(componentId, {
      component: {
        name: 'Deck.EditAddCards',
        passProps: {
          id,
        },
        options: {
          statusBar: {
            style: 'light',
            backgroundColor,
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
              color: backgroundColor,
            },
          },
        },
      },
    });
  }, [componentId, deck, id, colors, setFabOpen, setMenuOpen, cards, deckEditsRef, setMode]);

  const onUpgradePressed = useCallback(() => {
    if (!deck) {
      return;
    }
    setFabOpen(false);
    setMenuOpen(false);
    const backgroundColor = colors.faction[parsedDeck ? parsedDeck.investigator.factionCode() : 'neutral'].background;
    Navigation.push<UpgradeDeckProps>(componentId, {
      component: {
        name: 'Deck.Upgrade',
        passProps: {
          id: deckId,
          showNewDeck: true,
          campaignId: campaign?.id,
        },
        options: {
          statusBar: {
            style: 'light',
            backgroundColor,
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
              color: backgroundColor,
            },
          },
        },
      },
    });
  }, [componentId, deck, deckId, campaign, colors, parsedDeck, setFabOpen, setMenuOpen]);

  const copyDialog = useMemo(() => {
    return (
      <CopyDeckDialog
        campaign={campaign}
        deckId={copying ? id : undefined}
        toggleVisible={toggleCopyDialog}
        signedIn={signedIn}
        actions={deckActions}
      />
    );
  }, [id, signedIn, campaign, copying, deckActions, toggleCopyDialog]);

  const showTabooPicker = useCallback(() => {
    setTabooOpen(true);
    setFabOpen(false);
    setMenuOpen(false);
  }, [setMenuOpen, setFabOpen, setTabooOpen]);

  const updateDeckName = useCallback((name: string) => {
    dispatch({
      type: UPDATE_DECK_EDIT,
      id,
      updates: {
        nameChange: name,
      },
    });
  }, [dispatch, id]);
  const showDescription = useCallback(() => {
    if (parsedDeck) {
      Navigation.push(componentId, {
        component: {
          name: 'Deck.Description',
          passProps: {
            componentId,
            id,
          },
          options: getDeckOptions(colors, { title: t`Notes` }, parsedDeck.investigator),
        },
      });
    }
    setFabOpen(false);
    setMenuOpen(false);
  }, [componentId, parsedDeck, colors, id, setFabOpen, setMenuOpen]);
  const [editNameDialog, showEditNameDialog] = useSimpleTextDialog({
    title: t`Deck name`,
    onValueChange: updateDeckName,
    value: name || '',
  });
  const authedForEdits: boolean = !!deck && (deck.local || (arkhamDb && !arkhamDbUser) || deck.user_id === arkhamDbUser);
  const editable = !!deckEdits?.editable && authedForEdits;
  const suggestArkhamDbLogin = !!deckEdits?.editable && !authedForEdits;
  const onEditPressed = useCallback(() => {
    setFabOpen(false);
    setMode('edit');
  }, [setMode, setFabOpen]);
  const buttons = useMemo(() => {
    if (!parsedDeck || !deck || deck.nextDeckId) {
      return null;
    }
    if (!hasPendingEdits && editable) {
      if (!deckEdits?.mode || deckEdits.mode !== 'view') {
        return null;
      }
      const { normalCardCount: normalCards, totalCardCount } = parsedDeck;
      const normalCardCount = ngettext(msgid`${normalCards} card`, `${normalCards} cards`, normalCards);
      const unspentXp = parsedDeck.availableExperience > 0 && parsedDeck.changes ? (parsedDeck.availableExperience - parsedDeck.changes.spentXp) : 0;
      const details = unspentXp > 0 ?
        ngettext(msgid`${unspentXp} XP unspent`, `${unspentXp} XP unspent`, unspentXp) :
        ngettext(msgid`${normalCardCount} · ${totalCardCount} total`, `${normalCardCount} · ${totalCardCount} total`, totalCardCount);
      const showUpgradeButton = !campaign || !campaign.guided;
      return (
        <View style={[styles.row, space.marginS]}>
          <View style={[showUpgradeButton ? space.marginRightXs : undefined, styles.flex]}>
            <DeckButton
              title={t`Edit`}
              detail={details}
              icon="edit"
              onPress={onEditPressed}
            />
          </View>
          { !!showUpgradeButton && (
            <View style={[space.marginLeftXs, styles.flex]}>
              <DeckButton
                title={t`Upgrade`}
                detail={t`Add scenario XP`}
                icon="upgrade"
                color="gold"
                onPress={onUpgradePressed}
              />
            </View>
          ) }
        </View>
      );
    }
    return null;
  }, [deck, hasPendingEdits, editable, parsedDeck, deckEdits, campaign, onEditPressed, onUpgradePressed]);

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
          cardsByName: cardsByName[card.real_name.toLowerCase()] || [],
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
    setFabOpen(false);
    setMenuOpen(false);
    if (hasPendingEdits) {
      showAlert(
        t`Save Local Changes`,
        t`Please save any local edits to this deck before sharing to ArkhamDB`
      );
    } else if (deck.nextDeckId || deck.previousDeckId) {
      showAlert(
        t`Unsupported Operation`,
        t`This deck contains next/previous versions with upgrades, so we cannot upload it to ArkhamDB at this time.\n\nIf you would like to upload it, you can use Clone to upload a clone of the current deck.`
      );
    } else if (!signedIn) {
      showAlert(
        t`Sign in to ArkhamDB`,
        t`ArkhamDB is a popular deck building site where you can manage and share decks with others.\n\nSign in to access your decks or share decks you have created with others.`,
        [
          { text: t`Cancel`, style: 'cancel' },
          { text: t`Sign In`, onPress: login },
        ],
      );
    } else {
      showAlert(
        t`Upload to ArkhamDB`,
        t`You can upload your deck to ArkhamDB to share with others.\n\nAfter doing this you will need network access to make changes to the deck.`,
        [
          { text: t`Cancel`, style: 'cancel' },
          { text: t`Upload`, onPress: uploadLocalDeck },
        ],
      );
    }
  }, [signedIn, login, deck, hasPendingEdits, showAlert, setFabOpen, setMenuOpen, uploadLocalDeck]);

  const viewDeck = useCallback(() => {
    if (deck && !deck.local) {
      Linking.openURL(`${arkhamDbDomain}/deck/view/${deck.id}`);
    }
  }, [deck, arkhamDbDomain]);

  const deleteDeckPressed = useCallback(() => {
    if (!deck) {
      return;
    }
    setFabOpen(false);
    setMenuOpen(false);
    const options: AlertButton[] = [{
      text: t`Cancel`,
      style: 'cancel',
    }];
    const isLatestUpgrade = deck.previousDeckId && !deck.nextDeckId;
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
      const isUpgraded = !!deck.nextDeckId;
      options.push({
        text: isUpgraded ? t`Delete all versions` : t`Delete`,
        onPress: deleteAllDecks,
        style: 'destructive',
      });
    }
    showAlert(
      t`Delete deck`,
      t`Are you sure you want to delete this deck?`,
      options,
    );
  }, [deck, setFabOpen, setMenuOpen, deleteSingleDeck, deleteAllDecks, showAlert]);

  const showCardChartsPressed = useCallback(() => {
    setFabOpen(false);
    setMenuOpen(false);
    if (parsedDeck) {
      showCardCharts(componentId, parsedDeck, colors);
    }
  }, [componentId, parsedDeck, colors, setFabOpen, setMenuOpen]);

  const showUpgradeHistoryPressed = useCallback(() => {
    setFabOpen(false);
    setMenuOpen(false);
    if (parsedDeck) {
      Navigation.push<DeckHistoryProps>(componentId, {
        component: {
          name: 'Deck.History',
          passProps: {
            id,
            campaign,
            investigator: parsedDeck.investigator.code,
          },
          options: getDeckOptions(colors, { title: t`Upgrade History` }, parsedDeck.investigator),
        },
      });
    }
  }, [componentId, id, campaign, colors, parsedDeck, setFabOpen, setMenuOpen]);

  const showDrawSimulatorPressed = useCallback(() => {
    setFabOpen(false);
    setMenuOpen(false);
    if (parsedDeck) {
      showDrawSimulator(componentId, parsedDeck, colors);
    }
  }, [componentId, parsedDeck, colors, setFabOpen, setMenuOpen]);

  const sideMenu = useMemo(() => {
    if (!deck || !parsedDeck || deckEdits?.xpAdjustment === undefined) {
      return null;
    }
    const {
      normalCardCount,
      totalCardCount,
    } = parsedDeck;
    const xp = (deck.xp || 0) + deckEdits.xpAdjustment;
    const adjustment = deckEdits.xpAdjustment >= 0 ? `+${deckEdits.xpAdjustment}` : `${deckEdits.xpAdjustment}`;
    const xpString = t`${xp} (${adjustment}) XP`;
    return (
      <ScrollView style={[styles.menu, backgroundStyle, space.paddingS]}>
        <DeckBubbleHeader title={t`Deck`} />
        { editable && (
          <>
            <MenuButton
              icon="name"
              onPress={showEditNameDialog}
              numberOfLines={2}
              title={deckEdits.nameChange || deck.name}
              description={!deck.local ? t`Deck #${deck.id}` : undefined}
            />
            <MenuButton
              title={t`Taboo`}
              onPress={showTabooPicker}
              icon="taboo_thin"
              description={tabooSet ? formatTabooStart(tabooSet.date_start, lang) : t`None`}
            />
          </>
        ) }
        <MenuButton
          title={t`Notes`}
          description={t`Free-form text records`}
          onPress={showDescription}
          icon="edit"
          last
        />
        <DeckBubbleHeader title={t`Tools`} />
        <MenuButton
          onPress={showCardChartsPressed}
          title={t`Charts`}
          numberOfLines={2}
          icon="chart"
          description={t`For balancing and evaluating`}
        />
        <MenuButton
          onPress={showDrawSimulatorPressed}
          title={t`Draw Simulator`}
          numberOfLines={2}
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
        { (editable || (!deck.nextDeckId && !!deck.previousDeckId)) && (
          <DeckBubbleHeader title={t`Campaign`} />
        ) }
        { editable && (
          <>
            { !!deck.previousDeckId && (
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
              last={!deck.previousDeckId}
              numberOfLines={2}
            />
          </>
        ) }
        { (!deck.nextDeckId && !!deck.previousDeckId) && (
          <MenuButton
            icon="deck"
            onPress={showUpgradeHistoryPressed}
            title={t`Upgrade History`}
            last
          />
        ) }
        <DeckBubbleHeader title={t`Options`} />
        <MenuButton
          icon="copy"
          onPress={toggleCopyDialog}
          title={t`Clone deck`}
        />
        { deck.local && deck.investigator_code !== CUSTOM_INVESTIGATOR && editable && (
          <MenuButton
            icon="world"
            onPress={uploadToArkhamDB}
            title={t`Upload to ArkhamDB`}
            numberOfLines={2}
            last={!editable}
          />
        ) }
        { !deck.local && (
          <MenuButton
            icon="world"
            title={t`View on ArkhamDB`}
            description={t`Open in browser`}
            onPress={viewDeck}
            last={!editable}
          />
        ) }
        { editable && (
          <MenuButton
            icon="delete"
            title={t`Delete deck`}
            onPress={deleteDeckPressed}
            last
          />
        ) }
      </ScrollView>
    );
  }, [backgroundStyle, lang, onAddCardsPressed, editable, deck, deckEdits?.xpAdjustment, deckEdits?.nameChange, hasPendingEdits, tabooSet, parsedDeck,
    showUpgradeHistoryPressed, toggleCopyDialog, deleteDeckPressed, viewDeck, uploadToArkhamDB, showDescription,
    onUpgradePressed, showCardChartsPressed, showDrawSimulatorPressed, showEditNameDialog, showXpAdjustmentDialog, showTabooPicker,
    onEditSpecialPressed, onChecklistPressed,
  ]);

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
          shadowStyle={shadow.medium}
          useNativeFeedback={false}
        >
          <AppIcon name="draw" color={colors.L30} size={34} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor={factionColor}
          textStyle={actionLabelStyle}
          textContainerStyle={actionContainerStyle}
          title={t`Charts`}
          onPress={showCardChartsPressed}
          shadowStyle={shadow.medium}
          useNativeFeedback={false}
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
            useNativeFeedback={false}
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
            shadowStyle={shadow.medium}
            useNativeFeedback={false}
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
            shadowStyle={shadow.medium}
            useNativeFeedback={false}
          >
            <AppIcon name="plus-thin" color={colors.L30} size={24} />
          </ActionButton.Item>
        )) }
      </ActionButton>
    );
  }, [factionColor, fabOpen, editable, mode, shadow, fabIcon, colors, toggleFabOpen, onEditPressed, onAddCardsPressed, onUpgradePressed, showCardChartsPressed, showDrawSimulatorPressed, typography]);

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
  if (!parsedDeck || !cards) {
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
              deckId={id}
              suggestArkhamDbLogin={suggestArkhamDbLogin}
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
              buttons={buttons}
              showDrawWeakness={showDrawWeakness}
              showEditCards={onAddCardsPressed}
              showEditSpecial={deck.nextDeckId ? undefined : onEditSpecialPressed}
              showEditSide={deck.nextDeckId ? undefined : onEditSidePressed}
              showDeckHistory={showUpgradeHistoryPressed}
              showXpAdjustmentDialog={showXpAdjustmentDialog}
              showCardUpgradeDialog={showCardUpgradeDialog}
              signedIn={signedIn}
              login={login}
              width={width}
              deckEdits={deckEdits}
              deckEditsRef={deckEditsRef}
              mode={mode}
            />
            { !!parsedDeck.problem && mode !== 'view' && (
              <DeckProblemBanner
                problem={parsedDeck.problem}
              />
            ) }
            { mode !== 'view' && (
              <DeckNavFooter
                deckId={id}
                componentId={componentId}
                control="fab"
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
      { alertDialog }
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

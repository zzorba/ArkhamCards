import React, { MutableRefObject, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { find, forEach, flatMap, uniqBy, keys, map, filter, sortBy } from 'lodash';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useDispatch } from 'react-redux';
import { Navigation, OptionsTopBarButton } from 'react-native-navigation';
import { ngettext, msgid, t, c } from 'ttag';
import SideMenu from 'react-native-side-menu-updated';
import ActionButton from 'react-native-action-button';
import { format } from 'date-fns';

import MenuButton from '@components/core/MenuButton';
import BasicButton from '@components/core/BasicButton';
import withLoginState, { LoginStateProps } from '@components/core/withLoginState';
import useCopyDeckDialog from '@components/deck/useCopyDeckDialog';
import { iconsMap } from '@app/NavIcons';
import { deleteDeckAction } from '@components/deck/actions';
import { CampaignId, CardId, DeckId, DEFAULT_SORT, EditDeckState, getDeckId, INVESTIGATOR_PROBLEM, TOO_FEW_CARDS, UPDATE_DECK_EDIT } from '@actions/types';
import { DeckChecklistProps } from '@components/deck/DeckChecklistView';
import Card from '@data/types/Card';
import { EditDeckProps } from '@components/deck/DeckEditView';
import { UpgradeDeckProps } from '@components/deck/DeckUpgradeDialog';
import { DeckHistoryProps } from '@components/deck/DeckHistoryView';
import { EditSpecialCardsProps } from '@components/deck/EditSpecialDeckCardsView';
import DeckViewTab from './DeckViewTab';
import DeckNavFooter from '@components/deck/DeckNavFooter';
import { AppState } from '@reducers';
import space, { xs, s } from '@styles/space';
import COLORS from '@styles/colors';
import { getDeckOptions, showCardCharts, showDrawSimulator } from '@components/nav/helper';
import StyleContext from '@styles/StyleContext';
import { useParsedDeckWithFetch, useShowDrawWeakness } from '@components/deck/hooks';
import { useAdjustXpDialog, AlertButton, useAlertDialog, useBasicDialog, useSaveDialog, useSimpleTextDialog, useUploadLocalDeckDialog, useDialog } from '@components/deck/dialogs';
import { Toggles, useBackButton, useCopyAction, useEffectUpdate, useFlag, useNavigationButtonPressed, useRequiredCards, useSettingValue, useTabooSet, useToggles } from '@components/core/hooks';
import { NavigationProps } from '@components/nav/types';
import DeckBubbleHeader from '@components/deck/section/DeckBubbleHeader';
import { CUSTOM_INVESTIGATOR } from '@app_constants';
import AppIcon from '@icons/AppIcon';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import DeckButton from '@components/deck/controls/DeckButton';
import { CardUpgradeDialogProps } from '@components/deck/CardUpgradeDialog';
import DeckProblemBanner from '@components/deck/DeckProblemBanner';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useCampaign, useMyDecks } from '@data/hooks';
import { DeckActions, useDeckActions } from '@data/remote/decks';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useBondedFromCards } from '@components/card/CardDetailView/BondedCardsComponent';
import FilterBuilder from '@lib/filters';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import ArkhamButton from '@components/core/ArkhamButton';
import { DeckDraftProps } from '@components/deck/DeckDraftView';
import { JOE_DIAMOND_CODE, LOLA_CODE, SUZI_CODE } from '@data/deck/specialCards';
import { localizeTag } from '@components/deck/TagChiclet';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import useTagPile from '@components/deck/useTagPile';
import { PARALLEL_JIM_CODE } from '@data/deck/specialMetaSlots';
import { getExtraDeckSlots } from '@lib/parseDeck';

export interface DeckDetailProps {
  id: DeckId;
  initialMode?: 'upgrade' | 'edit';
  title?: string;
  subtitle?: string;
  campaignId: CampaignId | undefined;
  modal?: boolean;
  fromCampaign?: boolean;
}

const SHOW_DRAFT_CARDS = true;

type Props = NavigationProps &
  DeckDetailProps &
  LoginStateProps;
type DeckDispatch = ThunkDispatch<AppState, unknown, Action<string>>;

function formatTabooStart(date_start: string | undefined, locale: string) {
  if (!date_start) {
    return '';
  }
  const date = new Date(Date.parse(date_start));
  if (locale === 'fr' || locale === 'it') {
    return format(date, 'dd/MM/yyyy');
  }
  return format(date, 'yyyy/MM/dd');
}


function useUpgradeCardsByName(cards: Card[], tabooSetOverride?: number): [Card[], boolean] {
  const cardsByNameQuery = useMemo(() => {
    const filterBuilder = new FilterBuilder('cards_by_name');
    const query = filterBuilder.upgradeCardsByNameFilter(flatMap(cards, card => card.xp !== undefined ? card.real_name : []));
    return query;
  }, [cards]);
  const [upgradeCards, loading] = useCardsFromQuery({ query: cardsByNameQuery, tabooSetOverride });
  return [
    useMemo(() => uniqBy([...upgradeCards, ...cards], c => c.code), [upgradeCards, cards]),
    loading,
  ];
}

function useTagsDialog(
  deck: LatestDeckT | undefined,
  deckEditsRef: MutableRefObject<EditDeckState | undefined>,
  deckActions: DeckActions,
  editable: boolean
): [React.ReactNode, string, () => void] {
  const { listSeperator } = useContext(LanguageContext);
  const [{ myDecks }] = useMyDecks(deckActions);
  const dispatch = useDispatch();
  const allTags = useMemo(() => {
    const r: { [tag: string]: DeckId[] | undefined } = {};
    forEach(myDecks, d => {
      if (d && d.tags?.length) {
        forEach(d.tags, t => {
          if (!r[t]) {
            r[t] = [d.id];
          } else {
            r[t]?.push(d.id);
          }
        });
      }
    });
    return r;
  }, [myDecks]);
  const onTagsUpdate = useCallback((toggles: Toggles) => {
    if (deck && deckEditsRef.current) {
      const hasDiff =
        !!find(deck?.tags, t => !toggles[t]) ||
        !!find(toggles, (value, t) => !!value && !find(deck?.tags, t2 => t === t2));
      if (hasDiff) {
        const tagsChange = flatMap(toggles, (value, t) => value ? t : []).join(' ');
        if (deckEditsRef.current.tagsChange !== tagsChange) {
          dispatch({
            type: UPDATE_DECK_EDIT,
            id: deck?.id,
            updates: {
              tagsChange,
            },
          });
        }
      } else {
        if (deckEditsRef.current.tagsChange !== undefined && deckEditsRef.current.tagsChange !== (deck.tags?.join(',') || '')) {
          dispatch({
            type: UPDATE_DECK_EDIT,
            id: deck?.id,
            updates: {
              tagsChange: deck.tags,
            },
          });
        }
      }
    }
  }, [deck, deckEditsRef, dispatch]);
  const [deckTags, toggleDeckTag, setDeckTag, syncTags] = useToggles(() => {
    if (deck?.tags) {
      const r: Toggles = {};
      forEach(deck.tags, t => {
        r[t] = true;
      });
      return r;
    }
    return {};
  }, onTagsUpdate);
  useEffectUpdate(() => {
    if (deck) {
      const r: Toggles = {};
      forEach(deck.tags, t => {
        r[t] = true;
      });
      syncTags(r);
    }
  }, [deck]);
  const allTagsList = useMemo(() => keys(allTags), [allTags]);
  const [tagPile, setAddVisible] = useTagPile({ deckTags, toggleDeckTag, setDeckTag, allTags: allTagsList, editable });
  const { dialog, showDialog } = useDialog({
    title: editable ? t`Edit deck tags` : t`Deck tags`,
    content: tagPile,
    allowDismiss: true,
  });
  const tagString = useMemo(() => {
    if (!deck?.tags) {
      return c('tags').t`None`;
    }
    return sortBy(map(deck.tags, t => localizeTag(t)), t => t).join(listSeperator);
  }, [deck?.tags, listSeperator]);
  const showTheDialog = useCallback(() => {
    setAddVisible(false);
    showDialog();
  }, [setAddVisible, showDialog]);
  return [dialog, tagString, showTheDialog];
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
  fromCampaign,
}: Props) {
  const { lang, arkhamDbDomain } = useContext(LanguageContext);
  const { backgroundStyle, colors, darkMode, typography, shadow, width } = useContext(StyleContext);
  const deckActions = useDeckActions();
  const campaign = useCampaign(campaignId);
  const dispatch = useDispatch();
  const deckDispatch: DeckDispatch = useDispatch();
  const { userId, arkhamDbUser, arkhamDb } = useContext(ArkhamCardsAuthContext);
  const singleCardView = useSettingValue('single_card');
  const parsedDeckObj = useParsedDeckWithFetch(id, componentId, deckActions, initialMode);
  const [xpAdjustmentDialog, showXpAdjustmentDialog] = useAdjustXpDialog(parsedDeckObj);
  const {
    deck,
    deckT,
    cards: deckCards,
    deckEdits,
    deckEditsRef,
    visible,
    parsedDeck,
    tabooSetId,
    cardsMissing,
  } = parsedDeckObj;
  const tabooSet = useTabooSet(tabooSetId);

  const [cardsMissingMessage, setCardsMissingMessage] = useState(false);
  useEffect(() => {
    if (!cardsMissing) {
      setCardsMissingMessage(false);
    } else {
      let canceled = false;
      setTimeout(() => {
        if (!canceled) {
          setCardsMissingMessage(true);
        }
      }, 3000);
      return () => {
        canceled = true;
      };
    }
  }, [cardsMissing, cardsMissingMessage]);

  const deckId = useMemo(() => deck ? getDeckId(deck) : id, [deck, id]);
  const { savingDialog, saveEdits, handleBackPress, addedBasicWeaknesses, hasPendingEdits, mode } = useSaveDialog(parsedDeckObj);
  const [
    deletingDialog,
    deleting,
    setDeleting,
  ] = useBasicDialog(t`Deleting`);
  const [menuOpen, toggleMenuOpen, setMenuOpen] = useFlag(false);
  const [fabOpen, toggleFabOpen, setFabOpen] = useFlag(false);
  const [tabooOpen, setTabooOpen] = useState(false);
  const problem = parsedDeck?.problem;
  const extraProblem = parsedDeck?.problem;
  const name = deckEdits?.nameChange !== undefined ? deckEdits.nameChange : deck?.name;
  const flatDeckCards = useMemo(() => {
    const extraDeckSlots = parsedDeck?.investigatorBack.code === PARALLEL_JIM_CODE ? getExtraDeckSlots(deckEdits?.meta ?? {}) : {};
    return flatMap(deckCards, c =>
      c && ((deckEdits?.slots[c.code] || 0) > 0 || (deckEdits?.ignoreDeckLimitSlots[c.code] || 0) > 0 || (extraDeckSlots[c.code] || 0) > 0) ? c : []);
  }, [deckCards, deckEdits]);
  const [possibleUpgradeCards] = useUpgradeCardsByName(flatDeckCards, tabooSetId)
  const [bondedCards] = useBondedFromCards(flatDeckCards, DEFAULT_SORT, tabooSetId);
  const [requiredCards] = useRequiredCards(parsedDeck?.investigatorFront, parsedDeck?.investigatorBack, tabooSetId);
  const cards = useMemo(() => {
    const r = {
      ...deckCards,
    };
    forEach(bondedCards, card => {
      r[card.code] = card;
    });
    forEach(possibleUpgradeCards, card => {
      r[card.code] = card;
    });
    forEach(requiredCards, card => {
      r[card.code] = card;
    })
    return r;
  }, [bondedCards, deckCards, possibleUpgradeCards, requiredCards]);
  const bondedCardsByName = useMemo(() => {
    const r: {
      [name: string]: Card[];
    } = {};
    forEach(bondedCards, card => {
      if (card.bonded_name) {
        if (r[card.bonded_name]) {
          r[card.bonded_name].push(card);
        } else {
          r[card.bonded_name] = [card];
        }
      }
    });
    return r;
  }, [bondedCards]);
  const cardsByName = useMemo(() => {
    const cardsByName: {
      [name: string]: Card[];
    } = {};
    forEach(possibleUpgradeCards, card => {
      if (card) {
        const real_name = card.real_name.toLowerCase();
        if (cardsByName[real_name]) {
          cardsByName[real_name].push(card);
        } else {
          cardsByName[real_name] = [card];
        }
      }
    });
    return cardsByName;
  }, [possibleUpgradeCards]);

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
          campaignId,
        },
        options: getDeckOptions(colors, { title: t`Checklist`, noTitle: true }, investigator),
      },
    });
  }, [componentId, campaignId, deck, deckId, cards, tabooSetId, deckEditsRef, colors, setFabOpen, setMenuOpen]);

  const showDrawWeakness = useShowDrawWeakness({
    componentId,
    deck: deckT,
    id,
    campaignId,
    showAlert,
    deckEditsRef,
    assignedWeaknesses: addedBasicWeaknesses,
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

  const onEditExtraPressed = useCallback(() => {
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
          deckType: 'extra',
        },
        options: {
          statusBar: {
            style: 'light',
            backgroundColor,
          },
          topBar: {
            title: {
              text: t`Edit Spirit Deck`,
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
          deckType: 'side',
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
  const onDraftCards = useCallback(() => {
    if (!deck || !cards) {
      return;
    }
    setFabOpen(false);
    setMenuOpen(false);
    if (problem && problem.reason !== TOO_FEW_CARDS && problem.reason !== INVESTIGATOR_PROBLEM) {
      showAlert(
        t`Please correct invalid deck issues`,
        t`This deck currently contains one or more forbidden cards.\n\nPlease address these outstanding deck issues before drafting cards.`
      );
      return;
    }
    if (problem?.reason !== TOO_FEW_CARDS && problem?.reason !== INVESTIGATOR_PROBLEM) {
      showAlert(
        t`Deck is full`,
        t`This deck is full.\n\nRemove some cards or create a new deck if you would like to draft.\n\nAt the moment it is only possible to draft level 0 cards using the app.`,
      );
      return;

    }
    if (!deckEditsRef.current?.mode || deckEditsRef.current.mode === 'view') {
      setMode('edit');
    }
    const investigator = cards[deck.investigator_code];
    const backgroundColor = colors.faction[investigator ? investigator.factionCode() : 'neutral'].background;
    Navigation.push<DeckDraftProps>(componentId, {
      component: {
        name: 'Deck.DraftCards',
        passProps: {
          id,
          campaignId,
        },
        options: {
          statusBar: {
            style: 'light',
            backgroundColor,
          },
          topBar: {
            title: {
              text: t`Draft Cards`,
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
  }, [componentId, campaignId, problem, deck, id, colors, setFabOpen, setMenuOpen, showAlert, cards, deckEditsRef, setMode]);

  const onDraftExtraCards = useCallback(() => {
    if (!deck || !cards) {
      return;
    }
    setFabOpen(false);
    setMenuOpen(false);
    if (extraProblem && extraProblem.reason !== TOO_FEW_CARDS) {
      showAlert(
        t`Please correct invalid deck issues`,
        t`This deck currently contains one or more forbidden cards.\n\nPlease address these outstanding deck issues before drafting cards.`
      );
      return;
    }
    if (extraProblem?.reason !== TOO_FEW_CARDS) {
      showAlert(
        t`Deck is full`,
        t`This deck is full.\n\nRemove some cards or create a new deck if you would like to draft.\n\nAt the moment it is only possible to draft level 0 cards using the app.`,
      );
      return;

    }
    if (!deckEditsRef.current?.mode || deckEditsRef.current.mode === 'view') {
      setMode('edit');
    }
    const investigator = cards[deck.investigator_code];
    const backgroundColor = colors.faction[investigator ? investigator.factionCode() : 'neutral'].background;
    Navigation.push<DeckDraftProps>(componentId, {
      component: {
        name: 'Deck.DraftCards',
        passProps: {
          id,
          campaignId,
          mode: 'extra',
        },
        options: {
          statusBar: {
            style: 'light',
            backgroundColor,
          },
          topBar: {
            title: {
              text: t`Draft Cards`,
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
  }, [componentId, campaignId, extraProblem, deck, id, colors, setFabOpen, setMenuOpen, showAlert, cards, deckEditsRef, setMode]);

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
  const [copyDialog, showCopyDialog] = useCopyDeckDialog({ campaign, deckId: id, signedIn, actions: deckActions })
  const toggleCopyDialog = useCallback(() => {
    setFabOpen(false);
    setMenuOpen(false);
    showCopyDialog();
  }, [showCopyDialog, setFabOpen, setMenuOpen]);

  const showTabooPicker = useCallback(() => {
    setTabooOpen(true);
    setFabOpen(false);
    setMenuOpen(false);
  }, [setMenuOpen, setFabOpen, setTabooOpen]);

  const hideTabooPicker = useCallback(() => {
    setTabooOpen(false);
  }, [setTabooOpen]);

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

  const showCardUpgradeDialog = useCallback((card: Card, mode: 'extra' | undefined) => {
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
          mode,
        },
        options: getDeckOptions(colors, { title: card.name }, parsedDeck.investigator),
      },
    });
  }, [componentId, cardsByName, parsedDeck, id, colors]);

  const customContent = parsedDeck?.customContent;
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
      const hasCustomContent = customContent || find([...keys(deck.slots), ...keys(deck.sideSlots), ...keys(deck.ignoreDeckLimitSlots)], code => code.startsWith('z'));
      if (hasCustomContent) {
        showAlert(
          t`Deck contains custom content`,
          t`Sorry, this deck cannot be uploaded to ArkhamDB because it contains fan-made/preview content that ArkhamDB does not recognize.\n\nPlease remove these cards from the deck list and try again.`
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
    }
  }, [signedIn, login, deck, customContent, hasPendingEdits, showAlert, setFabOpen, setMenuOpen, uploadLocalDeck]);

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
  const copyDeckId = useCopyAction(`${deckId.id}`, t`Deck id copied!`);
  const onCopyDeckId = useCallback(() => {
    setMenuOpen(false);
    copyDeckId();
  }, [setMenuOpen, copyDeckId]);

  const copyDeckUrl = useCopyAction(`${arkhamDbDomain}/deck/view/${deckId.id}`, t`Link to deck copied!`);
  const onCopyUrl = useCallback(() => {
    setMenuOpen(false);
    copyDeckUrl();
  }, [copyDeckUrl, setMenuOpen]);

  const [tagsDialog, tagString, showTagsDialog] = useTagsDialog(
    deckT,
    deckEditsRef,
    deckActions,
    editable
  );

  const onShowTagsDialog = useCallback(() => {
    setMenuOpen(false);
    showTagsDialog();
  }, [setMenuOpen, showTagsDialog]);
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
              onLongPress={!deck.local ? onCopyDeckId : undefined}
              numberOfLines={2}
              title={deckEdits.nameChange || deck.name}
              description={!deck.local ? t`Deck #${deck.id}` : undefined}
            />
            <MenuButton
              title={t`Taboo`}
              onPress={showTabooPicker}
              icon="taboo"
              description={tabooSet ? formatTabooStart(tabooSet.date_start, lang) : t`None`}
            />
          </>
        ) }
        <MenuButton
          title={t`Tags`}
          description={tagString}
          onPress={onShowTagsDialog}
          icon="tag"
        />
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
              last={!SHOW_DRAFT_CARDS}
            />
            { !!SHOW_DRAFT_CARDS && !deck.previousDeckId && (
              <MenuButton
                onPress={onDraftCards}
                icon="draft"
                title={t`Draft Cards`}
                description={t`Build a deck randomly`}
                last
              />
            ) }
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
            numberOfLines={2}
            last
          />
        ) }
        <DeckBubbleHeader title={t`Options`} />
        <MenuButton
          icon="copy"
          onPress={toggleCopyDialog}
          title={t`Clone deck`}
        />
        { deck.local && !(deck.investigator_code === CUSTOM_INVESTIGATOR || deck.investigator_code.startsWith('z') || parsedDeck.investigator?.custom()) && editable && (
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
            onLongPress={onCopyUrl}
            last={!editable}
          />
        ) }
        { editable && (
          <MenuButton
            icon="trash"
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
    onEditSpecialPressed, onChecklistPressed, onDraftCards, onCopyDeckId, onCopyUrl, tagString,
    onShowTagsDialog,
  ]);

  const fabIcon = useCallback(() => {
    return <AppIcon name="plus-button" color={colors.L30} size={32} />;
  }, [colors]);

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
          <AppIcon name="draw" color="#FFF" size={34} />
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
          <AppIcon name="chart" color="#FFF" size={34} />
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
            <AppIcon name="upgrade"color="#FFF" size={32} />
          </ActionButton.Item>
        ) }
        { editable && !!SHOW_DRAFT_CARDS && !deck?.previousDeckId && (
          <ActionButton.Item
            buttonColor={factionColor}
            textStyle={actionLabelStyle}
            textContainerStyle={actionContainerStyle}
            title={t`Draft cards`}
            onPress={onDraftCards}
            shadowStyle={shadow.medium}
            useNativeFeedback={false}
          >
            <AppIcon name="draft" color="#FFF" size={32} />
          </ActionButton.Item>
        ) }
        { editable && (
          <ActionButton.Item
            buttonColor={factionColor}
            textStyle={actionLabelStyle}
            textContainerStyle={actionContainerStyle}
            title={t`Add cards`}
            onPress={onAddCardsPressed}
            shadowStyle={shadow.medium}
            useNativeFeedback={false}
          >
            <AppIcon name="addcard" color="#FFF" size={32} />
          </ActionButton.Item>
        ) }
        { editable && mode === 'view' && (
          <ActionButton.Item
            buttonColor={factionColor}
            textStyle={actionLabelStyle}
            textContainerStyle={actionContainerStyle}
            title={t`Edit`}
            onPress={onEditPressed}
            shadowStyle={shadow.medium}
            useNativeFeedback={false}
          >
            <AppIcon name="edit" color="#FFF" size={32} />
          </ActionButton.Item>
        ) }
      </ActionButton>
    );
  }, [factionColor, fabOpen, editable, mode, shadow, onDraftCards, fabIcon, colors, toggleFabOpen, onEditPressed, onAddCardsPressed, onUpgradePressed, showCardChartsPressed, showDrawSimulatorPressed, typography, deck]);
  const extraRequiredCards = useMemo(() => {
    if (mode === 'view' || !requiredCards) {
      return [];
    }
    const requiredCardIds: CardId[] = map(
      filter(requiredCards, c => !deck?.slots?.[c.code]),
      c => {
        return {
          id: c.code,
          quantity: parsedDeck?.slots[c.code] || 0,
          invalid: false,
          limited: false,
        };
      });
    return requiredCardIds
  }, [requiredCards, mode, parsedDeck?.slots, deck?.slots]);

  const [showDeleteBrokenDeck, setShowDeleteBrokenDeck] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShowDeleteBrokenDeck(true);
    }, 3000);
  }, [setShowDeleteBrokenDeck]);

  if (!deck) {
    return (
      <View style={[styles.activityIndicatorContainer, backgroundStyle]}>
        <LoadingSpinner large inline />
        { !!showDeleteBrokenDeck && (
          <BasicButton
            title={t`Delete Deck`}
            onPress={deleteBrokenDeck}
            color={COLORS.red}
          />
        ) }
      </View>
    );
  }
  /*
  if (parsedDeck?.problem) {
    forEach(keys(parsedDeck.slots), (code) => {
      const count = parsedDeck.slots[code];
      if (!find([
        ...(parsedDeck.normalCards.Assets ?? []),
        ...(parsedDeck.specialCards.Assets ?? []),
      ], (group) => !!find(group.data, cardId => cardId.id == code)) &&
        !find([
          ...parsedDeck.normalCards.Enemy ?? [],
          ...parsedDeck.normalCards.Event ?? [],
          ...parsedDeck.normalCards.Skill ?? [],
          ...parsedDeck.normalCards.Treachery ?? [],
          ...parsedDeck.specialCards.Enemy ?? [],
          ...parsedDeck.specialCards.Event ?? [],
          ...parsedDeck.specialCards.Skill ?? [],
          ...parsedDeck.specialCards.Treachery ?? [],
        ] , (cardId) => cardId.id == code)
      ) {
        console.log(`Couuld not find card ${code}`);
      }
    });
  }*/
  if (!parsedDeck || !cards || cardsMissing) {
    return (
      <View style={[styles.activityIndicatorContainer, backgroundStyle]}>
        <LoadingSpinner large inline />
        { cardsMissingMessage && (
          <View style={space.paddingSideM}>
            <Text style={[typography.text, space.paddingBottomS]}>
              {t`This deck contains new cards that the app hasn't seen before.\n\nPlease go to the 'Settings' tab and choose 'Check ArkhamDB for updates.'\n\nWhen it is finished, you can try to load the deck again.`}
            </Text>
            <View>
              <ArkhamButton
                icon="dismiss"
                title={t`Done`}
                onPress={handleBackPress}
              />
            </View>
          </View>
        ) }
      </View>
    );
  }
  const menuWidth = Math.min(width * 0.60, 240);
  const showTaboo: boolean = !!(tabooSetId !== deck.taboo_id && (tabooSetId || deck.taboo_id));
  const theProblem = problem ?? extraProblem;
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
              campaignId={campaignId}
              fromCampaign={fromCampaign}
              visible={visible}
              deckId={id}
              suggestArkhamDbLogin={suggestArkhamDbLogin}
              investigatorFront={parsedDeck.investigatorFront}
              investigatorBack={parsedDeck.investigatorBack}
              deck={deck}
              editable={editable}
              tabooSet={tabooSet}
              tabooSetId={tabooSetId}
              showTaboo={showTaboo}
              tabooOpen={tabooOpen}
              hideTabooPicker={hideTabooPicker}
              singleCardView={singleCardView}
              parsedDeck={parsedDeck}
              problem={problem ?? extraProblem}
              hasPendingEdits={hasPendingEdits}
              cards={cards}
              cardsByName={cardsByName}
              bondedCardsByName={bondedCardsByName}
              requiredCards={extraRequiredCards}
              buttons={buttons}
              showDrawWeakness={showDrawWeakness}
              showDraftCards={SHOW_DRAFT_CARDS ? onDraftCards : undefined}
              showDraftExtraCards={SHOW_DRAFT_CARDS ? onDraftExtraCards : undefined}
              showEditCards={onAddCardsPressed}
              showEditSpecial={deck.nextDeckId ? undefined : onEditSpecialPressed}
              showEditSide={deck.nextDeckId ? undefined : onEditSidePressed}
              showEditExtra={onEditExtraPressed}
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
            { !!theProblem && mode !== 'view' && (
              <DeckProblemBanner
                problem={theProblem}
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
      { tagsDialog }
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

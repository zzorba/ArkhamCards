import React from 'react';
import {
  find,
  findIndex,
  forEach,
  keys,
  range,
  throttle,
} from 'lodash';
import {
  Alert,
  AlertButton,
  ActivityIndicator,
  BackHandler,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Navigation, EventSubscription, OptionsTopBarButton } from 'react-native-navigation';
import DialogComponent from '@lib/react-native-dialog';
import deepDiff from 'deep-diff';
import { ngettext, msgid, t } from 'ttag';
import SideMenu from 'react-native-side-menu';

import {
  SettingsButton,
  SettingsCategoryHeader,
} from '@lib/react-native-settings-components';
import BasicButton from '@components/core/BasicButton';
import withLoginState, { LoginStateProps } from '@components/core/withLoginState';
import withTraumaDialog, { TraumaProps } from '@components/campaign/withTraumaDialog';
import Dialog from '@components/core/Dialog';
import withDialogs, { InjectedDialogProps } from '@components/core/withDialogs';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import CopyDeckDialog from '@components/deck/CopyDeckDialog';
import { iconsMap } from '@app/NavIcons';
import {
  fetchPrivateDeck,
  fetchPublicDeck,
  deleteDeckAction,
  uploadLocalDeck,
  saveDeckChanges,
  DeckChanges,
} from '@components/deck/actions';
import { Campaign, Deck, DeckMeta, ParsedDeck, Slots } from '@actions/types';
import { updateCampaign } from '@components/campaign/actions';
import withPlayerCards, { TabooSetOverride, PlayerCardProps } from '@components/core/withPlayerCards';
import { DeckChecklistProps } from '@components/deck/DeckChecklistView';
import Card, { CardsMap } from '@data/Card';
import TabooSet from '@data/TabooSet';
import { parseDeck, parseBasicDeck } from '@lib/parseDeck';
import { EditDeckProps } from '../DeckEditView';
import { CardUpgradeDialogProps } from '../CardUpgradeDialog';
import { DeckDescriptionProps } from '../DeckDescriptionView';
import { UpgradeDeckProps } from '../DeckUpgradeDialog';
import { DeckHistoryProps } from '../DeckHistoryView';
import { EditSpecialCardsProps } from '../EditSpecialDeckCardsView';
import EditDeckDetailsDialog from './EditDeckDetailsDialog';
import DeckViewTab from './DeckViewTab';
import withTabooSetOverride, { TabooSetOverrideProps } from './withTabooSetOverride';
import DeckNavFooter from '@components/DeckNavFooter';
import { NavigationProps } from '@components/nav/types';
import {
  getCampaign,
  getDeck,
  getEffectiveDeckId,
  getCampaignForDeck,
  getPacksInCollection,
  AppState,
} from '@reducers';
import { m } from '@styles/space';
import typography from '@styles/typography';
import COLORS from '@styles/colors';
import { getDeckOptions, showCardCharts, showDrawSimulator } from '@components/nav/helper';

const SHOW_DESCRIPTION_EDITOR = false;
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

interface ReduxProps {
  singleCardView: boolean;
  deck?: Deck;
  previousDeck?: Deck;
  campaign?: Campaign;
  inCollection: {
    [pack_code: string]: boolean;
  };
}
interface ReduxActionProps {
  fetchPrivateDeck: (id: number) => void;
  fetchPublicDeck: (id: number, useDeckEndpoint: boolean) => void;
  deleteDeckAction: (id: number, deleteAllVersions?: boolean, local?: boolean) => Promise<boolean>;
  uploadLocalDeck: (deck: Deck) => Promise<Deck>;
  updateCampaign: (id: number, campaign: Partial<Campaign>) => void;
  saveDeckChanges: (deck: Deck, changes: DeckChanges) => Promise<Deck>;
}

type Props = NavigationProps &
  DeckDetailProps &
  TabooSetOverrideProps &
  ReduxProps &
  ReduxActionProps &
  PlayerCardProps &
  TraumaProps &
  LoginStateProps &
  InjectedDialogProps &
  DimensionsProps;

interface State {
  parsedDeck?: ParsedDeck;
  slots: Slots;
  meta: DeckMeta;
  ignoreDeckLimitSlots: Slots;
  xpAdjustment: number;
  loaded: boolean;
  saving: boolean;
  saveError?: string;
  copying: boolean;
  deleting: boolean;
  deleteError?: string;
  nameChange?: string;
  descriptionChange?: string;
  tabooSetId?: number;
  hasPendingEdits: boolean;
  visible: boolean;
  editDetailsVisible: boolean;
  upgradeCard?: Card;
  menuOpen: boolean;
  tabooOpen: boolean;

  // Derived State
  calculatedCards: CardsMap;
  cardsByName: {
    [name: string]: Card[];
  };
  bondedCardsByName: {
    [name: string]: Card[];
  };
  calculatedInvestigators: CardsMap;
  calculatedDeckInvestigator?: string;
  parallelInvestigators: Card[];
}

class DeckDetailView extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    const result: Partial<State> = {};
    if (props.cards !== state.calculatedCards) {
      const cardsByName: {
        [name: string]: Card[];
      } = {};
      const bondedCardsByName: {
        [name: string]: Card[];
      } = {};
      forEach(props.cards, card => {
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
      result.calculatedCards = props.cards;
      result.bondedCardsByName = bondedCardsByName;
      result.cardsByName = cardsByName;
    }

    if (props.investigators !== state.calculatedInvestigators ||
      props.deck?.investigator_code !== state.calculatedDeckInvestigator
    ) {
      const investigator = props.deck && props.deck.investigator_code;
      const parallelInvestigators: Card[] = [];
      forEach(props.investigators, card => {
        if (card && investigator && card.alternate_of_code === investigator) {
          parallelInvestigators.push(card);
        }
      });
      result.calculatedDeckInvestigator = props.deck?.investigator_code;
      result.parallelInvestigators = parallelInvestigators;
      result.calculatedInvestigators = props.investigators;
    }
    return result;
  }

  _navEventListener?: EventSubscription;
  _uploadLocalDeck!: (isRetry?: boolean) => void;
  _saveEditsAndDismiss!: (isRetry?: boolean) => void;
  _saveEdits!: (isRetry?: boolean) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      meta: {},
      slots: {},
      ignoreDeckLimitSlots: {},
      xpAdjustment: 0,
      loaded: false,
      saving: false,
      copying: false,
      deleting: false,
      hasPendingEdits: false,
      visible: true,
      editDetailsVisible: false,
      menuOpen: false,
      tabooOpen: false,
      // Derived state.
      parallelInvestigators: [],
      calculatedInvestigators: {},
      calculatedCards: {},
      bondedCardsByName: {},
      cardsByName: {},
    };

    this._uploadLocalDeck = throttle(this.uploadLocalDeck.bind(this), 200);
    this._saveEditsAndDismiss = throttle(this.saveEdits.bind(this, true), 200);
    this._saveEdits = throttle(this.saveEdits.bind(this, false), 200);

    const leftButtons = props.modal ? [
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

    if (props.modal) {
      Navigation.mergeOptions(props.componentId, {
        topBar: {
          title: {
            text: props.title,
            color: '#FFFFFF',
          },
          subtitle: {
            text: props.subtitle,
            color: '#FFFFFF',
          },
          leftButtons,
          rightButtons: this.getRightButtons(),
        },
      });
    }
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentDidAppear() {
    this.setState({
      visible: true,
    });
  }

  componentDidDisappear() {
    this.setState({
      visible: false,
    });
  }

  componentDidMount() {
    const {
      id,
      isPrivate,
      fetchPublicDeck,
      fetchPrivateDeck,
      deck,
      previousDeck,
      modal,
    } = this.props;
    if (modal) {
      BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }
    if (id >= 0 && (!deck || !deck.local)) {
      if (isPrivate) {
        fetchPrivateDeck(id);
      } else {
        fetchPublicDeck(id, false);
      }
    }
    if (deck && deck.investigator_code) {
      if (deck && deck.previous_deck && !previousDeck) {
        if (deck.local) {
          // Something broken with the previous deck so
          // just load it anyway for now?
          this.loadCards(deck);
        } else {
          if (isPrivate) {
            fetchPrivateDeck(deck.previous_deck);
          } else {
            fetchPublicDeck(deck.previous_deck, false);
          }
        }
      } else {
        this.loadCards(deck, previousDeck);
      }
    }
  }

  componentWillUnmount() {
    if (this.props.modal) {
      BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    }
    this._navEventListener && this._navEventListener.remove();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      deck,
      id,
      isPrivate,
      previousDeck,
      fetchPrivateDeck,
      fetchPublicDeck,
      tabooSetOverride,
      cards,
    } = this.props;
    if (deck !== prevProps.deck) {
      if (!deck) {
        if (!this.state.deleting && id > 0) {
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
      } else if (deck.previous_deck && !previousDeck) {
        if (isPrivate) {
          fetchPrivateDeck(deck.previous_deck);
        } else {
          fetchPublicDeck(deck.previous_deck, false);
        }
      }
    }
    if (deck && (!deck.previous_deck || previousDeck)) {
      if (deck !== prevProps.deck ||
        previousDeck !== prevProps.previousDeck ||
        cards !== prevProps.cards
      ) {
        this.loadCards(deck, previousDeck);
      } else if (tabooSetOverride !== prevProps.tabooSetOverride) {
        const {
          cards,
        } = this.props;
        const {
          slots,
          meta,
          ignoreDeckLimitSlots,
        } = this.state;
        const parsedDeck = parseDeck(deck, meta, slots, ignoreDeckLimitSlots || {}, cards, previousDeck);
        /* eslint-disable react/no-did-update-set-state */
        this.setState({
          parsedDeck,
        });
      }
    }
  }

  _syncNav = (name: string) => {
    const { componentId } = this.props;
    Navigation.mergeOptions(componentId, {
      topBar: {
        subtitle: {
          text: name,
          color: '#FFFFFF',
        },
      },
    });
  };

  _deleteAllDecks = () => {
    this.deleteDeck(true);
  };

  _deleteSingleDeck = () => {
    this.deleteDeck(false);
  };

  deleteDeck(deleteAllVersions: boolean) {
    const {
      id,
      deck,
      deleteDeckAction,
    } = this.props;
    const {
      deleting,
    } = this.state;
    if (!deck) {
      return;
    }
    if (!deleting) {
      this.setState({
        deleting: true,
      });

      deleteDeckAction(id, deleteAllVersions, deck.local).then(() => {
        Navigation.dismissAllModals();
        this.setState({
          deleting: false,
        });
      });
    }
  }

  _deleteBrokenDeck = () => {
    Alert.alert(
      t`Delete broken deck`,
      t`Looks like we are having trouble loading this deck for some reason`,
      [
        { text: t`Delete`, style: 'destructive', onPress: this._actuallyDeleteBrokenDeck },
        { text: t`Cancel`, style: 'cancel' },
      ]
    );
  };

  _actuallyDeleteBrokenDeck = () => {
    const {
      id,
      deleteDeckAction,
    } = this.props;
    const {
      deleting,
    } = this.state;

    if (!deleting) {
      this.setState({
        deleting: true,
      });

      deleteDeckAction(id, false, id < 0).then(() => {
        Navigation.dismissAllModals();
        this.setState({
          deleting: false,
        });
      });
    }
  }

  _toggleCopyDialog = () => {
    this.setState({
      menuOpen: false,
      copying: !this.state.copying,
    });
  };

  _savePressed = () => {
    this._saveEdits();
  };

  getRightButtons() {
    const {
      hasPendingEdits,
    } = this.state;
    const rightButtons: OptionsTopBarButton[] = [{
      id: 'menu',
      icon: iconsMap.menu,
      color: 'white',
    }];
    if (hasPendingEdits) {
      rightButtons.push({
        text: t`Save`,
        id: 'save',
        color: 'white',
        testID: t`Save`,
      });
    }
    return rightButtons;
  }

  _handleBackPress = () => {
    if (!this.state.visible) {
      return false;
    }
    if (this.state.hasPendingEdits) {
      Alert.alert(
        t`Save deck changes?`,
        t`Looks like you have made some changes that have not been saved.`,
        [{
          text: t`Save Changes`,
          onPress: () => {
            this._saveEditsAndDismiss();
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
  };

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'back' || buttonId === 'androidBack') {
      this._handleBackPress();
    } else if (buttonId === 'save') {
      this._saveEdits();
    } else if (buttonId === 'menu') {
      this.setState({
        menuOpen: !this.state.menuOpen,
      });
    }
  }

  _onChecklistPressed = () => {
    const {
      componentId,
      deck,
      cards,
      tabooSetOverride,
    } = this.props;
    const {
      slots,
    } = this.state;
    if (!deck) {
      return;
    }
    this.setState({
      menuOpen: false,
    });
    const investigator = cards[deck.investigator_code];
    Navigation.push<DeckChecklistProps>(componentId, {
      component: {
        name: 'Deck.Checklist',
        passProps: {
          id: deck.id,
          investigator: deck.investigator_code,
          slots,
          tabooSetOverride,
        },
        options: {
          ...getDeckOptions(investigator, false, t`Checklist`, true),
        },
      },
    });
  };

  _onEditSpecialPressed = () => {
    const {
      componentId,
      deck,
      previousDeck,
      cards,
      campaign,
    } = this.props;
    const {
      meta,
      slots,
      ignoreDeckLimitSlots,
      xpAdjustment,
    } = this.state;
    if (!deck) {
      return;
    }
    this.setState({
      menuOpen: false,
    });
    const investigator = cards[deck.investigator_code];
    const addedWeaknesses = this.addedBasicWeaknesses(
      deck,
      slots,
      ignoreDeckLimitSlots);

    Navigation.push<EditSpecialCardsProps>(componentId, {
      component: {
        name: 'Deck.EditSpecial',
        passProps: {
          campaignId: campaign ? campaign.id : undefined,
          deck,
          meta,
          previousDeck,
          slots,
          ignoreDeckLimitSlots,
          updateSlots: this._updateSlots,
          updateIgnoreDeckLimitSlots: this._updateIgnoreDeckLimitSlots,
          assignedWeaknesses: addedWeaknesses,
          xpAdjustment,
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
              color: COLORS.faction[investigator ? investigator.factionCode() : 'neutral'].darkBackground,
            },
          },
        },
      },
    });
  };

  _onEditPressed = () => {
    const {
      componentId,
      deck,
      previousDeck,
      cards,
    } = this.props;
    if (!deck) {
      return;
    }
    this.setState({
      menuOpen: false,
    });
    const investigator = cards[deck.investigator_code];
    const {
      slots,
      meta,
      ignoreDeckLimitSlots,
      xpAdjustment,
      tabooSetId,
    } = this.state;
    Navigation.push<EditDeckProps>(componentId, {
      component: {
        name: 'Deck.Edit',
        passProps: {
          deck,
          meta,
          previousDeck,
          slots: slots,
          ignoreDeckLimitSlots: ignoreDeckLimitSlots,
          updateSlots: this._updateSlots,
          xpAdjustment: xpAdjustment,
          tabooSetId: tabooSetId !== undefined ? tabooSetId : deck.taboo_id,
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
              color: COLORS.faction[investigator ? investigator.factionCode() : 'neutral'].darkBackground,
            },
          },
        },
      },
    });
  };

  _onUpgradePressed = () => {
    const {
      componentId,
      deck,
      campaign,
    } = this.props;
    const {
      parsedDeck,
    } = this.state;
    if (!deck) {
      return;
    }
    this.setState({
      menuOpen: false,
    });
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
              color: COLORS.faction[parsedDeck ? parsedDeck.investigator.factionCode() : 'neutral'].darkBackground,
            },
          },
        },
      },
    });
  };

  uploadLocalDeck(isRetry?: boolean) {
    const {
      deck,
      uploadLocalDeck,
    } = this.props;
    const {
      parsedDeck,
      saving,
    } = this.state;
    if (!parsedDeck || !deck) {
      return;
    }
    if (!saving || isRetry) {
      this.setState({
        saving: true,
      });
      uploadLocalDeck(deck).then(newDeck => {
        this.setState({
          saving: false,
          tabooSetId: newDeck.taboo_id,
          hasPendingEdits: false,
        });
      }, () => {
        this.setState({
          saving: false,
        });
      });
    }
  }

  _dismissDeleteError = () => {
    this.setState({
      deleteError: undefined,
      deleting: false,
    });
  };

  _dismissSaveError = () => {
    this.setState({
      saveError: undefined,
      saving: false,
    });
  };

  _handleSaveError = (err: Error) => {
    this.setState({
      saving: false,
      saveError: err.message || 'Unknown Error',
    });
  };

  updateCampaignWeaknessSet(newAssignedCards: string[]) {
    const {
      campaign,
      updateCampaign,
    } = this.props;
    if (campaign) {
      const assignedCards = Object.assign(
        {},
        (campaign.weaknessSet && campaign.weaknessSet.assignedCards) || {});
      forEach(newAssignedCards, code => {
        assignedCards[code] = (assignedCards[code] || 0) + 1;
      });
      updateCampaign(
        campaign.id,
        {
          weaknessSet: {
            ...(campaign.weaknessSet || {}),
            assignedCards,
          },
        },
      );
    }
  }

  saveEdits(dismissAfterSave: boolean, isRetry?: boolean) {
    const {
      deck,
    } = this.props;
    if (!this.state.saving || isRetry) {
      const {
        parsedDeck,
        nameChange,
        tabooSetId,
        xpAdjustment,
        meta,
      } = this.state;
      if (!deck || !parsedDeck) {
        return;
      }
      const {
        slots,
        ignoreDeckLimitSlots,
      } = parsedDeck;

      const problemObj = this.getProblem();
      const problem = problemObj ? problemObj.reason : '';

      const addedBasicWeaknesses = this.addedBasicWeaknesses(
        deck,
        slots,
        ignoreDeckLimitSlots
      );

      this.setState({
        saving: true,
      });
      this.props.saveDeckChanges(
        deck,
        {
          name: nameChange,
          slots,
          ignoreDeckLimitSlots,
          problem,
          spentXp: parsedDeck.changes ? parsedDeck.changes.spentXp : 0,
          xpAdjustment,
          tabooSetId,
          meta,
        }
      ).then(() => {
        this.updateCampaignWeaknessSet(addedBasicWeaknesses);
        if (dismissAfterSave) {
          Navigation.dismissAllModals();
        } else {
          this.setState({
            saving: false,
            nameChange: undefined,
            hasPendingEdits: false,
          });
        }
      }, this._handleSaveError);
    }
  }

  _clearEdits = () => {
    const {
      deck,
    } = this.props;
    if (!deck) {
      return;
    }
    this.props.setTabooSet(deck.taboo_id || undefined);
    this.setState({
      meta: deck.meta || {},
      nameChange: undefined,
      tabooSetId: deck.taboo_id || undefined,
      xpAdjustment: deck.xp_adjustment || 0,
    }, () => {
      this._syncNav(deck.name);
      this._updateSlots(deck.slots, true);
    });
  };

  slotDeltas(
    deck: Deck,
    slots: Slots,
    ignoreDeckLimitSlots: Slots
  ) {
    const result: {
      removals: Slots;
      additions: Slots;
      ignoreDeckLimitChanged: boolean;
    } = {
      removals: {},
      additions: {},
      ignoreDeckLimitChanged: false,
    };
    forEach(deck.slots, (deckCount, code) => {
      const currentDeckCount = slots[code] || 0;
      if (deckCount > currentDeckCount) {
        result.removals[code] = deckCount - currentDeckCount;
      }
    });
    forEach(slots, (currentCount, code) => {
      const ogDeckCount = deck.slots[code] || 0;
      if (ogDeckCount < currentCount) {
        result.additions[code] = currentCount - ogDeckCount;
      }
      const ogIgnoreCount = ((deck.ignoreDeckLimitSlots || {})[code] || 0);
      if (ogIgnoreCount !== (ignoreDeckLimitSlots[code] || 0)) {
        result.ignoreDeckLimitChanged = true;
      }
    });
    return result;
  }

  addedBasicWeaknesses(
    deck: Deck,
    slots: Slots,
    ignoreDeckLimitSlots: Slots
  ): string[] {
    const {
      cards,
    } = this.props;
    const deltas = this.slotDeltas(deck, slots, ignoreDeckLimitSlots);
    const addedWeaknesses: string[] = [];
    forEach(deltas.additions, (addition, code) => {
      const card = cards[code];
      if (card && card.subtype_code === 'basicweakness') {
        forEach(range(0, addition), () => addedWeaknesses.push(code));
      }
    });
    return addedWeaknesses;
  }

  hasPendingEdits(
    slots: Slots,
    ignoreDeckLimitSlots: Slots,
    meta: DeckMeta,
    xpAdjustment: number,
    nameChange?: string,
    tabooSetId?: number,
  ): boolean {
    const {
      deck,
    } = this.props;
    if (!deck) {
      return false;
    }
    const originalTabooSet: number = (deck.taboo_id || 0);
    const newTabooSet: number = (tabooSetId || 0);
    const metaChanges = deepDiff(meta, deck.meta || {});
    const deltas = this.slotDeltas(deck, slots, ignoreDeckLimitSlots);
    return (nameChange && deck.name !== nameChange) ||
      (tabooSetId !== undefined && originalTabooSet !== newTabooSet) ||
      (deck.previous_deck && (deck.xp_adjustment || 0) !== xpAdjustment) ||
      keys(deltas.removals).length > 0 ||
      keys(deltas.additions).length > 0 ||
      deltas.ignoreDeckLimitChanged ||
      (!!metaChanges && metaChanges.length > 0);
  }

  _setMeta = (key: keyof DeckMeta, value?: string) => {
    let { slots } = this.state;
    const {
      meta,
      ignoreDeckLimitSlots,
      xpAdjustment,
      nameChange,
      tabooSetId,
    } = this.state;
    const {
      deck,
      cards,
      previousDeck,
    } = this.props;
    if (!deck) {
      return;
    }

    const updatedMeta: DeckMeta = {
      ...meta,
      [key]: value,
    };

    if (value === undefined) {
      delete updatedMeta[key];
    } else {
      if (deck.investigator_code === '06002' && key === 'deck_size_selected') {
        slots = {
          ...slots,
          '06008': (parseInt(value, 10) - 20) / 10,
        };
      }
    }
    const parsedDeck = parseDeck(
      deck,
      updatedMeta,
      slots,
      ignoreDeckLimitSlots,
      cards,
      previousDeck);

    this.setState({
      meta: updatedMeta,
      parsedDeck,
      hasPendingEdits: this.hasPendingEdits(
        slots,
        ignoreDeckLimitSlots,
        updatedMeta,
        xpAdjustment,
        nameChange,
        tabooSetId),
    });
  };

  _updateIgnoreDeckLimitSlots = (newIgnoreDeckLimitSlots: Slots) => {
    const {
      deck,
      previousDeck,
      cards,
    } = this.props;
    const {
      slots,
      meta,
    } = this.state;
    if (!deck) {
      return;
    }
    const parsedDeck = parseDeck(deck, meta, slots, newIgnoreDeckLimitSlots, cards, previousDeck);
    this.setState({
      ignoreDeckLimitSlots: newIgnoreDeckLimitSlots,
      parsedDeck,
      hasPendingEdits: this.hasPendingEdits(
        slots,
        newIgnoreDeckLimitSlots,
        this.state.meta,
        this.state.xpAdjustment,
        this.state.nameChange,
        this.state.tabooSetId),
    });
  };

  _onDeckCountChange = (code: string, count: number) => {
    const {
      slots,
    } = this.state;
    const newSlots = {
      ...slots,
      [code]: count,
    };
    if (count === 0) {
      delete newSlots[code];
    }
    this._updateSlots(newSlots);
  };

  _updateSlots = (newSlots: Slots, resetIgnoreDeckLimitSlots?: boolean) => {
    const {
      deck,
      previousDeck,
      cards,
    } = this.props;
    const { meta } = this.state;
    if (!deck) {
      return;
    }
    const ignoreDeckLimitSlots = resetIgnoreDeckLimitSlots ?
      (deck.ignoreDeckLimitSlots || {}) :
      this.state.ignoreDeckLimitSlots;
    const parsedDeck = parseDeck(deck, meta, newSlots, ignoreDeckLimitSlots, cards, previousDeck);
    this.setState({
      slots: newSlots,
      ignoreDeckLimitSlots: ignoreDeckLimitSlots,
      parsedDeck,
      hasPendingEdits: this.hasPendingEdits(
        newSlots,
        ignoreDeckLimitSlots,
        this.state.meta,
        this.state.xpAdjustment,
        this.state.nameChange,
        this.state.tabooSetId),
    });
  };

  loadCards(deck: Deck, previousDeck?: Deck) {
    const {
      cards,
    } = this.props;
    const {
      slots,
      loaded,
      parsedDeck,
    } = this.state;
    if (!keys(cards).length) {
      return;
    }
    const addedCard = findIndex(keys(slots), code => deck.slots[code] !== slots[code]) !== -1;
    const removedCard = findIndex(keys(deck.slots), code => deck.slots[code] !== slots[code]) !== -1;
    if (addedCard || removedCard || !loaded || !parsedDeck) {
      const parsedDeck = parseBasicDeck(deck, cards, previousDeck);
      this.setState({
        slots: deck.slots,
        meta: deck.meta || {},
        ignoreDeckLimitSlots: deck.ignoreDeckLimitSlots || {},
        xpAdjustment: deck.xp_adjustment || 0,
        parsedDeck,
        hasPendingEdits: false,
        loaded: true,
      });
    }
  }

  renderCopyDialog() {
    const {
      componentId,
      viewRef,
      id,
      signedIn,
    } = this.props;
    const {
      copying,
    } = this.state;
    return (
      <CopyDeckDialog
        componentId={componentId}
        deckId={copying ? id : undefined}
        toggleVisible={this._toggleCopyDialog}
        viewRef={viewRef}
        signedIn={signedIn}
      />
    );
  }

  _showTabooPicker = () => {
    this.setState({
      tabooOpen: true,
      menuOpen: false,
    });
  }

  _showEditDetailsVisible = () => {
    this.setState({
      editDetailsVisible: true,
      menuOpen: false,
    });
  };

  _updateDescription = (description: string) => {
    const { deck } = this.props;
    if (!deck) {
      return;
    }
    const descriptionChange = deck.description_md !== description ?
      description :
      undefined;
    this.setState({
      descriptionChange,
    });
  };

  _showEditDescription = () => {
    this.setState({
      menuOpen: false,
    });
    const {
      componentId,
    } = this.props;
    const { parsedDeck } = this.state;
    if (!parsedDeck) {
      return;
    }
    const options = getDeckOptions(parsedDeck.investigator, false);

    Navigation.push<DeckDescriptionProps>(componentId, {
      component: {
        name: 'Deck.Description',
        passProps: {
          description: '',
          update: this._updateDescription,
        },
        options: options,
      },
    });
  };

  _toggleEditDetailsVisible = () => {
    this.setState({
      editDetailsVisible: !this.state.editDetailsVisible,
    });
  };

  _setTabooSetId = (tabooSetId?: number) => {
    const {
      slots,
      ignoreDeckLimitSlots,
      meta,
      nameChange,
      xpAdjustment,
    } = this.state;
    const pendingEdits = this.hasPendingEdits(
      slots,
      ignoreDeckLimitSlots,
      meta,
      xpAdjustment,
      nameChange,
      tabooSetId || 0,
    );
    this.props.setTabooSet(tabooSetId);
    this.setState({
      tabooSetId: tabooSetId || 0,
      hasPendingEdits: pendingEdits,
      editDetailsVisible: false,
      tabooOpen: false,
    });
  };

  _updateDeckDetails = (name: string, xpAdjustment: number) => {
    const {
      slots,
      ignoreDeckLimitSlots,
      meta,
      tabooSetId,
    } = this.state;
    const pendingEdits = this.hasPendingEdits(
      slots,
      ignoreDeckLimitSlots,
      meta,
      xpAdjustment,
      name,
      tabooSetId,
    );
    this._syncNav(name);
    this.setState({
      nameChange: name,
      xpAdjustment,
      hasPendingEdits: pendingEdits,
      editDetailsVisible: false,
    });
  };

  renderEditDetailsDialog(deck: Deck, parsedDeck: ParsedDeck) {
    const {
      viewRef,
    } = this.props;
    const {
      editDetailsVisible,
      nameChange,
      xpAdjustment,
    } = this.state;
    const {
      changes,
    } = parsedDeck;
    return (
      <EditDeckDetailsDialog
        viewRef={viewRef}
        visible={editDetailsVisible}
        xp={deck.xp || 0}
        spentXp={changes ? changes.spentXp : 0}
        xpAdjustment={xpAdjustment}
        xpAdjustmentEnabled={!!deck.previous_deck && !deck.next_deck}
        toggleVisible={this._toggleEditDetailsVisible}
        name={nameChange || deck.name}
        updateDetails={this._updateDeckDetails}
      />
    );
  }

  renderDeletingDialog() {
    const {
      viewRef,
    } = this.props;
    const {
      deleting,
      deleteError,
    } = this.state;
    if (deleteError) {
      return (
        <Dialog title={t`Error`} visible={deleting} viewRef={viewRef}>
          <Text style={[styles.errorMargin, typography.small]}>
            { deleteError }
          </Text>
          <DialogComponent.Button
            label={t`Okay`}
            onPress={this._dismissDeleteError}
          />
        </Dialog>
      );

    }
    return (
      <Dialog title={t`Deleting`} visible={deleting} viewRef={viewRef}>
        <ActivityIndicator
          style={styles.spinner}
          color={COLORS.lightText}
          size="large"
          animating
        />
      </Dialog>
    );
  }

  renderSavingDialog() {
    const {
      viewRef,
    } = this.props;
    const {
      saving,
      saveError,
    } = this.state;
    if (saveError) {
      return (
        <Dialog title={t`Error`} visible={saving} viewRef={viewRef}>
          <Text style={[styles.errorMargin, typography.small]}>
            { saveError }
          </Text>
          <DialogComponent.Button
            label={t`Okay`}
            onPress={this._dismissSaveError}
          />
        </Dialog>
      );

    }
    return (
      <Dialog title={t`Saving`} visible={saving} viewRef={viewRef}>
        <ActivityIndicator
          style={styles.spinner}
          color={COLORS.lightText}
          size="large"
          animating
        />
      </Dialog>
    );
  }

  renderButtons() {
    const {
      deck,
    } = this.props;
    const {
      hasPendingEdits,
    } = this.state;
    if (!deck || deck.next_deck || !hasPendingEdits) {
      return null;
    }
    return (
      <>
        <BasicButton
          title={t`Save Changes`}
          onPress={this._savePressed}
        />
        <BasicButton
          title={t`Discard Changes`}
          color={COLORS.red}
          onPress={this._clearEdits}
        />
      </>
    );
  }

  getProblem() {
    const {
      parsedDeck,
      loaded,
    } = this.state;
    if (!loaded || !parsedDeck) {
      return undefined;
    }
    return parsedDeck.problem;
  }

  _showCardUpgradeDialog = (card: Card) => {
    const {
      componentId,
      cards,
      previousDeck,
    } = this.props;
    const {
      tabooSetId,
      parsedDeck,
      meta,
      xpAdjustment,
      ignoreDeckLimitSlots,
      cardsByName,
    } = this.state;

    if (!parsedDeck) {
      return null;
    }

    const passProps: CardUpgradeDialogProps = {
      componentId,
      card,
      parsedDeck: parsedDeck,
      meta,
      cards,
      cardsByName,
      investigator: parsedDeck.investigator,
      tabooSetId,
      previousDeck,
      ignoreDeckLimitSlots,
      slots: parsedDeck.slots,
      xpAdjustment: xpAdjustment,
      updateSlots: this._updateSlots,
    };

    const options = getDeckOptions(parsedDeck.investigator, false, card.name);

    Navigation.push<CardUpgradeDialogProps>(componentId, {
      component: {
        name: 'Dialog.CardUpgrade',
        passProps,
        options,
      },
    });
  }

  _renderFooter = (
    slots?: Slots,
    controls?: React.ReactNode
  ) => {
    const {
      componentId,
      cards,
      fontScale,
    } = this.props;
    const {
      parsedDeck,
      xpAdjustment,
      meta,
    } = this.state;
    if (!parsedDeck) {
      return null;
    }
    return (
      <DeckNavFooter
        componentId={componentId}
        fontScale={fontScale}
        parsedDeck={parsedDeck}
        meta={meta}
        cards={cards}
        xpAdjustment={xpAdjustment}
        controls={controls}
      />
    );
  };

  _menuOpenChange = (menuOpen: boolean) => {
    this.setState({
      menuOpen,
    });
  };

  _doLocalDeckUpload = () => {
    this._uploadLocalDeck();
  };

  _uploadToArkhamDB = () => {
    const {
      signedIn,
      login,
      deck,
    } = this.props;
    const { hasPendingEdits } = this.state;
    if (!deck) {
      return;
    }
    this.setState({
      menuOpen: false,
    });
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
          { text: t`Upload`, onPress: this._doLocalDeckUpload },
          { text: t`Cancel`, style: 'cancel' },
        ],
      );
    }
  };

  _viewDeck = () => {
    const { deck } = this.props;
    if (deck) {
      Linking.openURL(`https://arkhamdb.com/deck/view/${deck.id}`);
    }
  };

  _deleteDeckPrompt = () => {
    const {
      deck,
    } = this.props;
    if (!deck) {
      return;
    }
    this.setState({
      menuOpen: false,
    });
    const options: AlertButton[] = [];
    const isLatestUpgrade = deck.previous_deck && !deck.next_deck;
    if (isLatestUpgrade) {
      options.push({
        text: t`Delete this upgrade (${deck.version})`,
        onPress: this._deleteSingleDeck,
        style: 'destructive',
      });
      options.push({
        text: t`Delete all versions`,
        onPress: this._deleteAllDecks,
        style: 'destructive',
      });
    } else {
      const isUpgraded = !!deck.next_deck;
      options.push({
        text: isUpgraded ? t`Delete all versions` : t`Delete`,
        onPress: this._deleteAllDecks,
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
  };

  _showCardCharts = () => {
    const { componentId } = this.props;
    const { parsedDeck } = this.state;
    this.setState({
      menuOpen: false,
    });
    if (parsedDeck) {
      showCardCharts(componentId, parsedDeck);
    }
  };

  _showUpgradeHistory = () => {
    const { componentId } = this.props;
    const {
      parsedDeck,
      slots,
      ignoreDeckLimitSlots,
      xpAdjustment,
      meta,
    } = this.state;
    this.setState({
      menuOpen: false,
    });
    if (parsedDeck) {
      const options = getDeckOptions(parsedDeck.investigator, false, t`Upgrade History`);

      Navigation.push<DeckHistoryProps>(componentId, {
        component: {
          name: 'Deck.History',
          passProps: {
            id: parsedDeck.deck.id,
            meta,
            slots,
            ignoreDeckLimitSlots,
            xpAdjustment,
          },
          options: options,
        },
      });
    }
  };

  _showDrawSimulator = () => {
    const { componentId } = this.props;
    const { parsedDeck } = this.state;
    this.setState({
      menuOpen: false,
    });
    if (parsedDeck) {
      showDrawSimulator(componentId, parsedDeck);
    }
  };

  renderSideMenu(
    deck: Deck,
    parsedDeck: ParsedDeck,
    tabooSet?: TabooSet
  ) {
    const {
      isPrivate,
    } = this.props;
    const {
      nameChange,
      hasPendingEdits,
      xpAdjustment,
    } = this.state;
    const {
      normalCardCount,
      totalCardCount,
    } = parsedDeck;

    const editable = isPrivate && deck && !deck.next_deck;
    const xp = (deck.xp || 0) + xpAdjustment;
    const adjustment = xpAdjustment >= 0 ? `+${xpAdjustment}` : `${xpAdjustment}`;
    const xpString = t`${xp} (${adjustment}) XP`;
    return (
      <ScrollView style={styles.menu}>
        <SettingsCategoryHeader
          title={t`Deck`}
          titleStyle={styles.categoryText}
          containerStyle={styles.categoryContainer}
        />
        { editable && (
          <>
            <SettingsButton
              onPress={this._showEditDetailsVisible}
              title={t`Name`}
              description={nameChange || deck.name}
              descriptionStyle={styles.text}
              titleStyle={styles.text}
              containerStyle={styles.button}
            />
            { SHOW_DESCRIPTION_EDITOR && (
              <SettingsButton
                onPress={this._showEditDescription}
                title={t`Description`}
                titleStyle={styles.text}
                containerStyle={styles.button}
              />
            ) }
            <SettingsButton
              onPress={this._showTabooPicker}
              title={t`Taboo List`}
              titleStyle={styles.text}
              containerStyle={styles.button}
              description={tabooSet ? tabooSet.date_start : t`None`}
              descriptionStyle={styles.text}
            />
            { !deck.local && (
              <SettingsButton
                title={t`Deck Id`}
                titleStyle={styles.text}
                containerStyle={styles.button}
                description={`${deck.id}`}
                descriptionStyle={styles.text}
                onPress={this._showEditDetailsVisible}
                disabled
              />
            ) }
          </>
        ) }
        <SettingsCategoryHeader
          title={t`Cards`}
          titleStyle={styles.categoryText}
          containerStyle={styles.categoryContainer}
        />
        { editable && (
          <>
            <SettingsButton
              onPress={this._onEditPressed}
              title={t`Edit Cards`}
              titleStyle={styles.text}
              containerStyle={styles.button}
              description={ngettext(
                msgid`${normalCardCount} Card (${totalCardCount} Total)`,
                `${normalCardCount} Cards (${totalCardCount} Total)`,
                normalCardCount
              )}
              descriptionStyle={styles.text}
            />
            <SettingsButton
              onPress={this._onEditSpecialPressed}
              title={t`Story Assets`}
              titleStyle={styles.text}
              containerStyle={styles.button}
            />
            <SettingsButton
              onPress={this._onEditSpecialPressed}
              title={t`Weaknesses`}
              titleStyle={styles.text}
              containerStyle={styles.button}
            />
          </>
        ) }
        { SHOW_CHECKLIST_EDITOR && (
          <SettingsButton
            onPress={this._onChecklistPressed}
            title={t`Checklist`}
            titleStyle={styles.text}
            containerStyle={styles.button}
          />
        ) }
        <SettingsButton
          onPress={this._showCardCharts}
          title={t`Charts`}
          titleStyle={styles.text}
          containerStyle={styles.button}
        />
        <SettingsButton
          onPress={this._showDrawSimulator}
          title={t`Draw Simulator`}
          titleStyle={styles.text}
          containerStyle={styles.button}
        />
        { editable && (
          <>
            <SettingsCategoryHeader
              title={t`Campaign`}
              titleStyle={styles.categoryText}
              containerStyle={styles.categoryContainer}
            />
            <SettingsButton
              onPress={this._onUpgradePressed}
              title={t`Upgrade Deck`}
              titleStyle={styles.text}
              containerStyle={styles.button}
              disabled={!!hasPendingEdits}
              description={hasPendingEdits ? t`Save changes before upgrading` : undefined}
              descriptionStyle={styles.text}
            />
            { !!deck.previous_deck && (
              <SettingsButton
                onPress={this._showEditDetailsVisible}
                title={t`Available XP`}
                titleStyle={styles.text}
                containerStyle={styles.button}
                description={xpString}
                descriptionStyle={styles.text}
              />
            ) }
            { !!deck.previous_deck && (
              <SettingsButton
                onPress={this._showUpgradeHistory}
                title={t`Upgrade History`}
                titleStyle={styles.text}
                containerStyle={styles.button}
              />
            ) }
          </>
        ) }
        <SettingsCategoryHeader
          title={t`Options`}
          titleStyle={styles.categoryText}
          containerStyle={styles.categoryContainer}
        />
        <SettingsButton
          onPress={this._toggleCopyDialog}
          title={t`Clone`}
          titleStyle={styles.text}
          containerStyle={styles.button}
        />
        { deck.local ? (
          <SettingsButton
            onPress={this._uploadToArkhamDB}
            title={t`Upload to ArkhamDB`}
            titleStyle={styles.text}
            containerStyle={styles.button}
          />
        ) : (
          <SettingsButton
            title={t`View on ArkhamDB`}
            onPress={this._viewDeck}
            titleStyle={styles.text}
            containerStyle={styles.button}
          />
        ) }
        { !!isPrivate && (
          <SettingsButton
            title={t`Delete`}
            titleStyle={styles.destructive}
            containerStyle={styles.button}
            onPress={this._deleteDeckPrompt}
          />
        ) }
      </ScrollView>
    );
  }

  renderDeck(
    deck: Deck,
    parsedDeck: ParsedDeck,
    selectedTabooSetId?: number,
    tabooSet?: TabooSet
  ) {
    const {
      componentId,
      fontScale,
      isPrivate,
      captureViewRef,
      cards,
      campaign,
      signedIn,
      login,
      showTraumaDialog,
      investigatorDataUpdates,
      singleCardView,
      width,
      inCollection,
      hideCampaign,
    } = this.props;
    const {
      cardsByName,
      bondedCardsByName,
      parallelInvestigators,
      nameChange,
      hasPendingEdits,
      xpAdjustment,
      meta,
      tabooOpen,
    } = this.state;

    const editable = !!isPrivate && !!deck && !deck.next_deck;
    const showTaboo: boolean = !!(
      selectedTabooSetId !== deck.taboo_id && (
        selectedTabooSetId || deck.taboo_id
      ));
    return (
      <View>
        <View style={styles.container} ref={captureViewRef}>
          <DeckViewTab
            componentId={componentId}
            fontScale={fontScale}
            inCollection={inCollection}
            parallelInvestigators={parallelInvestigators}
            deck={deck}
            editable={editable}
            meta={meta}
            setMeta={this._setMeta}
            deckName={nameChange || deck.name}
            tabooSet={tabooSet}
            tabooSetId={selectedTabooSetId}
            showTaboo={showTaboo}
            tabooOpen={tabooOpen}
            setTabooSet={this._setTabooSetId}
            singleCardView={singleCardView}
            xpAdjustment={xpAdjustment}
            parsedDeck={parsedDeck}
            problem={this.getProblem() || undefined}
            hasPendingEdits={hasPendingEdits}
            cards={cards}
            cardsByName={cardsByName}
            bondedCardsByName={bondedCardsByName}
            isPrivate={!!isPrivate}
            buttons={this.renderButtons()}
            showEditCards={this._onEditPressed}
            showDeckUpgrade={this._onUpgradePressed}
            showDeckHistory={this._showUpgradeHistory}
            showEditNameDialog={this._showEditDetailsVisible}
            showCardUpgradeDialog={this._showCardUpgradeDialog}
            showEditSpecial={deck.next_deck ? undefined : this._onEditSpecialPressed}
            signedIn={signedIn}
            login={login}
            campaign={campaign}
            hideCampaign={hideCampaign}
            showTraumaDialog={showTraumaDialog}
            investigatorDataUpdates={investigatorDataUpdates}
            renderFooter={this._renderFooter}
            onDeckCountChange={this._onDeckCountChange}
            width={width}
          />
          { this._renderFooter() }
        </View>
        { this.renderEditDetailsDialog(deck, parsedDeck) }
      </View>
    );
  }

  render() {
    const {
      width,
      captureViewRef,
      deck,
      tabooSets,
    } = this.props;
    const {
      loaded,
      parsedDeck,
      tabooSetId,
    } = this.state;
    if (!deck) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator
            style={styles.spinner}
            color={COLORS.lightText}
            size="small"
            animating
          />
          <BasicButton
            title={t`Delete Deck`}
            onPress={this._deleteBrokenDeck}
            color={COLORS.red}
          />
        </View>
      );
    }
    if (!loaded || !parsedDeck) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator
            style={styles.spinner}
            color={COLORS.lightText}
            size="small"
            animating
          />
        </View>
      );
    }
    const selectedTabooSetId = tabooSetId !== undefined ? tabooSetId : (deck.taboo_id || 0);
    const tabooSet = selectedTabooSetId ? find(
      tabooSets,
      tabooSet => tabooSet.id === selectedTabooSetId
    ) : undefined;
    const menuWidth = Math.min(width * 0.60, 240);
    return (
      <View style={styles.flex} ref={captureViewRef}>
        <SideMenu
          isOpen={this.state.menuOpen}
          onChange={this._menuOpenChange}
          menu={this.renderSideMenu(deck, parsedDeck, tabooSet)}
          openMenuOffset={menuWidth}
          autoClosing
          menuPosition="right"
        >
          { this.renderDeck(deck, parsedDeck, selectedTabooSetId, tabooSet) }
        </SideMenu>
        { this.renderSavingDialog() }
        { this.renderDeletingDialog() }
        { this.renderCopyDialog() }
      </View>
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: NavigationProps & DeckDetailProps & TabooSetOverrideProps
): ReduxProps & TabooSetOverride {
  const id = getEffectiveDeckId(state, props.id);
  const deck = getDeck(state, id) || undefined;
  const previousDeck = (
    deck && deck.previous_deck && getDeck(state, deck.previous_deck)
  ) || undefined;
  const tabooSetOverride = props.tabooSetOverride !== undefined ?
    props.tabooSetOverride :
    ((deck && deck.taboo_id) || 0);
  return {
    singleCardView: state.settings.singleCardView || false,
    deck,
    previousDeck,
    tabooSetOverride,
    inCollection: getPacksInCollection(state),
    campaign: (props.campaignId ?
      getCampaign(state, props.campaignId) :
      getCampaignForDeck(state, id)) || undefined,
  };
}

function mapDispatchToProps(dispatch: Dispatch): ReduxActionProps {
  return bindActionCreators({
    fetchPrivateDeck,
    fetchPublicDeck,
    deleteDeckAction,
    uploadLocalDeck,
    updateCampaign,
    saveDeckChanges,
  } as any, dispatch) as ReduxActionProps;
}

export default withTabooSetOverride<NavigationProps & DeckDetailProps>(
  connect<ReduxProps & TabooSetOverride, ReduxActionProps, NavigationProps & DeckDetailProps & TabooSetOverrideProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(
    withPlayerCards<ReduxProps & TabooSetOverride & ReduxActionProps & NavigationProps & DeckDetailProps & TabooSetOverrideProps>(
      withTraumaDialog(
        withDialogs(
          withLoginState(
            withDimensions(DeckDetailView)
          )
        )
      )
    )
  )
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    position: 'relative',
    height: '100%',
    width: '100%',
    backgroundColor: COLORS.background,
  },
  spinner: {
    height: 80,
  },
  activityIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorMargin: {
    padding: m,
  },
  menu: {
    borderLeftWidth: 2,
    borderColor: COLORS.darkGray,
    backgroundColor: COLORS.background,
  },
  destructive: {
    color: COLORS.red,
  },
  categoryContainer: {
    backgroundColor: COLORS.veryLightBackground,
  },
  categoryText: {
    color: COLORS.lightText,
  },
  text: {
    color: COLORS.darkText,
  },
  button: {
    backgroundColor: COLORS.background,
  },
});

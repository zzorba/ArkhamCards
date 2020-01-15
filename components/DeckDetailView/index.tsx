import React from 'react';
import {
  find,
  findIndex,
  flatMap,
  forEach,
  keys,
  map,
  range,
  throttle,
} from 'lodash';
import {
  Alert,
  AlertButton,
  ActivityIndicator,
  BackHandler,
  Button,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Results } from 'realm';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Navigation, EventSubscription, OptionsTopBarButton } from 'react-native-navigation';
import DialogComponent from 'react-native-dialog';
import deepDiff from 'deep-diff';
import { ngettext, msgid, t } from 'ttag';
import SideMenu from 'react-native-side-menu';
import {
  SettingsButton,
  SettingsCategoryHeader,
} from 'react-native-settings-components';

import withLoginState, { LoginStateProps } from '../withLoginState';
import CopyDeckDialog from '../CopyDeckDialog';
import withTraumaDialog, { TraumaProps } from '../campaign/withTraumaDialog';
import Dialog from '../core/Dialog';
import withDialogs, { InjectedDialogProps } from '../core/withDialogs';
import withDimensions, { DimensionsProps } from '../core/withDimensions';
import { iconsMap } from '../../app/NavIcons';
import {
  fetchPrivateDeck,
  fetchPublicDeck,
  deleteDeckAction,
  uploadLocalDeck,
  saveDeckChanges,
  DeckChanges,
} from '../decks/actions';
import { Campaign, Deck, DeckMeta, ParsedDeck, Slots } from '../../actions/types';
import { updateCampaign } from '../campaign/actions';
import withPlayerCards, { TabooSetOverride, PlayerCardProps } from '../withPlayerCards';
import DeckValidation from '../../lib/DeckValidation';
import { FACTION_DARK_GRADIENTS } from '../../constants';
import Card from '../../data/Card';
import TabooSet from '../../data/TabooSet';
import { parseDeck } from '../../lib/parseDeck';
import { EditDeckProps } from '../DeckEditView';
import { EditSpecialCardsProps } from '../EditSpecialDeckCards';
import { UpgradeDeckProps } from '../DeckUpgradeDialog';
import EditDeckDetailsDialog from './EditDeckDetailsDialog';
import DeckViewTab from './DeckViewTab';
import { CardUpgradeDialogProps } from './CardUpgradeDialog';
import DeckNavFooter from '../DeckNavFooter';
import withTabooSetOverride, { TabooSetOverrideProps } from '../withTabooSetOverride';
import { NavigationProps } from '../types';
import {
  getCampaign,
  getDeck,
  getEffectiveDeckId,
  getCampaignForDeck,
  getPacksInCollection,
  AppState,
} from '../../reducers';
import { m } from '../../styles/space';
import typography from '../../styles/typography';
import { COLORS } from '../../styles/colors';
import { getDeckOptions, showCardCharts, showDrawSimulator } from '../navHelper';

export interface DeckDetailProps {
  id: number;
  title?: string;
  campaignId?: number;
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

interface UpgradeCardProps {
  cardsByName: {
    [name: string]: Card[];
  };
  bondedCardsByName: {
    [name: string]: Card[];
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
  UpgradeCardProps &
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
  tabooSetId?: number;
  hasPendingEdits: boolean;
  visible: boolean;
  editDetailsVisible: boolean;
  upgradeCard?: Card;
  menuOpen: boolean;
  tabooOpen: boolean;
}

class DeckDetailView extends React.Component<Props, State> {
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
        if (isPrivate) {
          fetchPrivateDeck(deck.previous_deck);
        } else {
          fetchPublicDeck(deck.previous_deck, false);
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
        previousDeck !== prevProps.previousDeck
      ) {
        this.loadCards(deck, previousDeck);
      } else if (tabooSetOverride !== prevProps.tabooSetOverride) {
        const {
          cards,
        } = this.props;
        const {
          slots,
          ignoreDeckLimitSlots,
        } = this.state;
        const parsedDeck = parseDeck(deck, slots, ignoreDeckLimitSlots || {}, cards, previousDeck);
        /* eslint-disable react/no-did-update-set-state */
        this.setState({
          parsedDeck,
        });
      }
    }
  }

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
              color: FACTION_DARK_GRADIENTS[investigator ? investigator.factionCode() : 'neutral'][0],
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
              color: FACTION_DARK_GRADIENTS[investigator ? investigator.factionCode() : 'neutral'][0],
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
              color: FACTION_DARK_GRADIENTS[parsedDeck ? parsedDeck.investigator.factionCode() : 'neutral'][0],
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
      if (cards[code] && cards[code].subtype_code === 'basicweakness') {
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

  _setMeta = (key: string, value: string) => {
    const {
      meta,
    } = this.state;
    const updatedMeta = {
      ...meta,
      [key]: value,
    };
    this.setState({
      meta: updatedMeta,
      hasPendingEdits: this.hasPendingEdits(
        this.state.slots,
        this.state.ignoreDeckLimitSlots,
        updatedMeta,
        this.state.xpAdjustment,
        this.state.nameChange,
        this.state.tabooSetId),
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
    } = this.state;
    if (!deck) {
      return;
    }
    const parsedDeck = parseDeck(deck, slots, newIgnoreDeckLimitSlots, cards, previousDeck);
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
    if (!deck) {
      return;
    }
    const ignoreDeckLimitSlots = resetIgnoreDeckLimitSlots ?
      (deck.ignoreDeckLimitSlots || {}) :
      this.state.ignoreDeckLimitSlots;
    const parsedDeck = parseDeck(deck, newSlots, ignoreDeckLimitSlots, cards, previousDeck);
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
    } = this.state;
    if (findIndex(keys(slots), code => deck.slots[code] !== slots[code]) !== -1 ||
      findIndex(keys(deck.slots), code => deck.slots[code] !== slots[code]) !== -1) {
      const parsedDeck = parseDeck(deck, deck.slots, deck.ignoreDeckLimitSlots || {}, cards, previousDeck);
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
        <View style={styles.button}>
          <Button
            title={t`Save Changes`}
            onPress={this._savePressed}
          />
        </View>
        <View style={styles.button}>
          <Button
            title={t`Discard Changes`}
            color={COLORS.red}
            onPress={this._clearEdits}
          />
        </View>
      </>
    );
  }

  getProblem() {
    const {
      cards,
      deck,
    } = this.props;
    const {
      parsedDeck,
      loaded,
      meta,
    } = this.state;
    if (!deck || !loaded || !parsedDeck) {
      return null;
    }

    const {
      slots,
      ignoreDeckLimitSlots,
      investigator,
    } = parsedDeck;

    const validator = new DeckValidation(investigator, meta);
    return validator.getProblem(flatMap(keys(slots), code => {
      const card = cards[code];
      if (!card) {
        return [];
      }
      return map(
        range(0, Math.max(0, slots[code] - (ignoreDeckLimitSlots[code] || 0))),
        () => card
      );
    }));
  }

  _showCardUpgradeDialog = (card: Card) => {
    const {
      componentId,
      cards,
      cardsByName,
      previousDeck,
    } = this.props;
    const {
      tabooSetId,
      parsedDeck,
      meta,
      xpAdjustment,
      ignoreDeckLimitSlots,
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
        options: options,
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
          { text: 'Sign In', onPress: login },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    } else {
      Alert.alert(
        t`Upload to ArkhamDB`,
        t`You can upload your deck to ArkhamDB to share with others.\n\nAfter doing this you will need network access to make changes to the deck.`,
        [
          { text: 'Upload', onPress: this._doLocalDeckUpload },
          { text: 'Cancel', style: 'cancel' },
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
        <SettingsCategoryHeader title={t`Deck`} />
        { editable && (
          <>
            <SettingsButton
              onPress={this._showEditDetailsVisible}
              title={t`Name`}
              description={nameChange || deck.name}
            />
            <SettingsButton
              onPress={this._showTabooPicker}
              title={t`Taboo List`}
              description={tabooSet ? tabooSet.date_start : t`None`}
            />
          </>
        ) }
        <SettingsCategoryHeader title={t`Cards`} />
        <SettingsButton
          onPress={this._onEditPressed}
          title={t`Edit Cards`}
          description={ngettext(
            msgid`${normalCardCount} Card (${totalCardCount} Total)`,
            `${normalCardCount} Cards (${totalCardCount} Total)`,
            normalCardCount
          )}
        />
        <SettingsButton
          onPress={this._onEditSpecialPressed}
          title={t`Story Assets`}
        />
        <SettingsButton
          onPress={this._onEditSpecialPressed}
          title={t`Weaknesses`}
        />
        <SettingsButton
          onPress={this._showCardCharts}
          title={t`Charts`}
        />
        <SettingsButton
          onPress={this._showDrawSimulator}
          title={t`Draw Simulator`}
        />
        { editable && (
          <>
            <SettingsCategoryHeader title={t`Campaign`} />
            <SettingsButton
              onPress={this._onUpgradePressed}
              title={t`Upgrade Deck`}
              disabled={!!hasPendingEdits}
              description={hasPendingEdits ? t`Save changes before upgrading` : undefined}
            />
            { !!deck.previous_deck && (
              <SettingsButton
                onPress={this._showEditDetailsVisible}
                title={t`Available XP`}
                description={xpString}
              />
            ) }
          </>
        ) }
        <SettingsCategoryHeader title={t`Options`} />
        <SettingsButton
          onPress={this._toggleCopyDialog}
          title={t`Clone`}
        />
        { deck.local ? (
          <SettingsButton
            onPress={this._uploadToArkhamDB}
            title={t`Upload to ArkhamDB`}
          />
        ) : (
          <SettingsButton
            title={t`View on ArkhamDB`}
            onPress={this._viewDeck}
          />
        ) }
        { !!isPrivate && (
          <SettingsButton
            title={t`Delete`}
            titleStyle={styles.destructive}
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
      cardsByName,
      singleCardView,
      bondedCardsByName,
      width,
      inCollection,
    } = this.props;
    const {
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
            showEditNameDialog={this._showEditDetailsVisible}
            showCardUpgradeDialog={this._showCardUpgradeDialog}
            showEditSpecial={deck.next_deck ? undefined : this._onEditSpecialPressed}
            signedIn={signedIn}
            login={login}
            campaign={campaign}
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
    if (!deck || !loaded || !parsedDeck) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator
            style={styles.spinner}
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
    withPlayerCards<ReduxProps & TabooSetOverride & ReduxActionProps & NavigationProps & DeckDetailProps & TabooSetOverrideProps, UpgradeCardProps>(
      withTraumaDialog(
        withDialogs(
          withLoginState(
            withDimensions(DeckDetailView)
          )
        )
      ),
      (cards: Results<Card>) => {
        const cardsByName: {
          [name: string]: Card[];
        } = {};
        const bondedCardsByName: {
          [name: string]: Card[];
        } = {};
        forEach(cards, card => {
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
        });
        return {
          cardsByName,
          bondedCardsByName,
        };
      }
    )
  )
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    position: 'relative',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  spinner: {
    height: 80,
  },
  activityIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'white',
  },
  errorMargin: {
    padding: m,
  },
  button: {
    margin: 8,
  },
  menu: {
    borderLeftWidth: 2,
    borderColor: COLORS.darkGray,
    backgroundColor: COLORS.white,
  },
  destructive: {
    color: COLORS.red,
  },
});

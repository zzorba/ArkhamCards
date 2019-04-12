import React from 'react';
import {
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
  ActivityIndicator,
  BackHandler,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { Navigation, EventSubscription } from 'react-native-navigation';
import DialogComponent from 'react-native-dialog';
import DeviceInfo from 'react-native-device-info';

import { t } from 'ttag';
import withLoginState, { LoginStateProps } from '../withLoginState';
import CopyDeckDialog from '../CopyDeckDialog';
import { handleAuthErrors } from '../authHelper';
import withTraumaDialog, { TraumaProps } from '../campaign/withTraumaDialog';
import { updateLocalDeck } from '../decks/localHelper';
import Dialog from '../core/Dialog';
import withDialogs, { InjectedDialogProps } from '../core/withDialogs';
import Button from '../core/Button';
import { iconsMap } from '../../app/NavIcons';
import {
  fetchPrivateDeck,
  fetchPublicDeck,
  updateDeck,
  removeDeck,
  replaceLocalDeck,
} from '../../actions';
import { Campaign, Deck, Slots } from '../../actions/types'
import { updateCampaign } from '../campaign/actions';
import { saveDeck, newCustomDeck } from '../../lib/authApi';
import withPlayerCards, { PlayerCardProps } from '../withPlayerCards';
import DeckValidation from '../../lib/DeckValidation';
import { FACTION_DARK_GRADIENTS } from '../../constants';
import { parseDeck, ParsedDeck } from '../parseDeck';
import { EditDeckProps } from '../DeckEditView';
import { EditSpecialCardsProps } from '../EditSpecialDeckCards';
import { UpgradeDeckProps } from '../DeckUpgradeDialog';
import DeckViewTab from './DeckViewTab';
import DeckNavFooter from '../DeckNavFooter';
import { NavigationProps } from '../types';
import {
  getCampaign,
  getDeck,
  getEffectiveDeckId,
  getCampaignForDeck,
  AppState,
} from '../../reducers';
import typography from '../../styles/typography';

export interface DeckDetailProps {
  id: number;
  title?: string;
  campaignId?: number;
  isPrivate?: boolean;
  modal?: boolean;
}

interface ReduxProps {
  deck?: Deck;
  previousDeck?: Deck;
  campaign?: Campaign;
}

interface ReduxActionProps {
  fetchPrivateDeck: (id: number) => void;
  fetchPublicDeck: (id: number, useDeckEndpoint: boolean) => void;
  updateDeck: (id: number, deck: Deck, isWrite: boolean) => void;
  removeDeck: (id: number, deleteAllVersions?: boolean) => void;
  replaceLocalDeck: (localId: number, deck: Deck) => void;
  updateCampaign: (id: number, sparseCampaign: Campaign) => void;
}

type Props = NavigationProps & DeckDetailProps &
  ReduxProps & ReduxActionProps & PlayerCardProps &
  TraumaProps & LoginStateProps & InjectedDialogProps;

interface State {
  parsedDeck?: ParsedDeck;
  slots: Slots;
  ignoreDeckLimitSlots: Slots;
  xpAdjustment: number;
  loaded: boolean;
  saving: boolean;
  saveError?: string;
  copying: boolean;
  deleting: boolean;
  nameChange?: string;
  hasPendingEdits: boolean;
  visible: boolean;
}
class DeckDetailView extends React.Component<Props, State> {
  _navEventListener?: EventSubscription;
  _uploadLocalDeck!: (isRetry?: boolean) => void;
  _saveEditsAndDismiss!: (isRetry?: boolean) => void;
  _saveEdits!: (isRetry?: boolean) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      slots: {},
      ignoreDeckLimitSlots: {},
      xpAdjustment: 0,
      loaded: false,
      saving: false,
      copying: false,
      deleting: false,
      hasPendingEdits: false,
      visible: true,
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
    if (deck !== prevProps.deck || previousDeck !== prevProps.previousDeck) {
      if (deck && (!deck.previous_deck || previousDeck)) {
        this.loadCards(deck, previousDeck);
      }
    }
  }

  _deleteDeck = (deleteAllVersions: boolean) => {
    const {
      id,
      removeDeck,
    } = this.props;

    this.setState({
      deleting: true,
    }, () => {
      Navigation.dismissAllModals();
      removeDeck(id, deleteAllVersions);
    });
  };

  _toggleCopyDialog = () => {
    this.setState({
      copying: !this.state.copying,
    });
  };

  getRightButtons() {
    const {
      isPrivate,
      deck,
    } = this.props;
    const {
      hasPendingEdits,
    } = this.state;
    const rightButtons = [];
    const editable = isPrivate && deck && !deck.next_deck;
    if (hasPendingEdits) {
      rightButtons.push({
        text: t`Save`,
        id: 'save',
        color: 'white',
      });
    } else {
      rightButtons.push({
        id: 'copy',
        icon: iconsMap['content-copy'],
        color: 'white',
      });
      if (editable) {
        rightButtons.push({
          id: 'upgrade',
          icon: iconsMap['arrow-up-bold'],
          color: 'white',
        });
      }
    }
    if (editable) {
      rightButtons.push({
        id: 'edit',
        icon: iconsMap.edit,
        color: 'white',
      });
    }
    return rightButtons;
  }

  _syncNavigationButtons = () => {
    const {
      componentId,
    } = this.props;

    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: this.getRightButtons(),
      },
    });
  };

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
    if (buttonId === 'edit') {
      this._onEditPressed();
    } else if (buttonId === 'back' || buttonId === 'androidBack') {
      this._handleBackPress();
    } else if (buttonId === 'save') {
      this._saveEdits();
    } else if (buttonId === 'upgrade') {
      this._onUpgradePressed();
    } else if (buttonId === 'copy') {
      this._toggleCopyDialog();
    }
  }

  _saveName = (name: string) => {
    const {
      slots,
      ignoreDeckLimitSlots,
      xpAdjustment,
    } = this.state;
    const pendingEdits = this.hasPendingEdits(
      slots,
      ignoreDeckLimitSlots,
      xpAdjustment,
      name
    );
    this.setState({
      nameChange: name,
      hasPendingEdits: pendingEdits,
    }, this._syncNavigationButtons);
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
      slots,
      ignoreDeckLimitSlots,
      xpAdjustment,
    } = this.state;
    if (!deck) {
      return;
    }
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
    const investigator = cards[deck.investigator_code];
    Navigation.push<EditDeckProps>(componentId, {
      component: {
        name: 'Deck.Edit',
        passProps: {
          deck,
          previousDeck,
          slots: this.state.slots,
          ignoreDeckLimitSlots: this.state.ignoreDeckLimitSlots,
          updateSlots: this._updateSlots,
          xpAdjustment: this.state.xpAdjustment,
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
      login,
      id,
      replaceLocalDeck,
    } = this.props;
    const {
      parsedDeck,
      saving,
    } = this.state;
    if (!parsedDeck || !deck) {
      return;
    }
    const {
      slots,
      ignoreDeckLimitSlots,
    } = parsedDeck;
    if (!saving || isRetry) {
      const problemObj = this.getProblem();
      const problem = problemObj ? problemObj.reason : '';
      this.setState({
        saving: true,
      });

      const promise = newCustomDeck(
        deck.investigator_code,
        deck.name,
        slots,
        ignoreDeckLimitSlots,
        problem,
      );
      handleAuthErrors(
        promise,
        // onSuccess
        deck => {
          // Replace the local deck with the new one.
          replaceLocalDeck(id, deck);
          this.setState({
            saving: false,
            nameChange: undefined,
            hasPendingEdits: false,
          }, this._syncNavigationButtons);
        },
        // onFailure
        this._handleSaveError,
        // retry
        () => {
          this.uploadLocalDeck(true);
        },
        login
      );
    }
  }

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
        Object.assign(
          {},
          campaign,
          { weaknessSet: Object.assign({}, campaign.weaknessSet || {}, { assignedCards }) }
        )
      );
    }
  }

  saveEdits(dismissAfterSave: boolean, isRetry?: boolean) {
    const {
      deck,
      updateDeck,
    } = this.props;
    if (!this.state.saving || isRetry) {
      const {
        parsedDeck,
        nameChange,
        xpAdjustment,
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

      if (deck.local) {
        const newDeck = updateLocalDeck(
          deck,
          nameChange || deck.name,
          slots,
          problem,
          parsedDeck.spentXp,
          xpAdjustment
        );
        updateDeck(newDeck.id, newDeck, true);
        this.updateCampaignWeaknessSet(addedBasicWeaknesses);
        if (dismissAfterSave) {
          Navigation.dismissAllModals();
        } else {
          this.setState({
            nameChange: undefined,
            hasPendingEdits: false,
          }, this._syncNavigationButtons);
        }
      } else {
        // ArkhamDB deck.
        this.setState({
          saving: true,
        });

        const savePromise = saveDeck(
          deck.id,
          nameChange || deck.name,
          slots,
          ignoreDeckLimitSlots,
          problem,
          parsedDeck.spentXp,
          xpAdjustment,
        );
        handleAuthErrors(
          savePromise,
          // onSuccess
          deck => {
            updateDeck(deck.id, deck, true);
            this.updateCampaignWeaknessSet(addedBasicWeaknesses);
            if (dismissAfterSave) {
              Navigation.dismissAllModals();
            } else {
              this.setState({
                saving: false,
                nameChange: undefined,
                hasPendingEdits: false,
              }, this._syncNavigationButtons);
            }
          },
          this._handleSaveError,
          // retry
          () => {
            this.saveEdits(dismissAfterSave, true);
          },
          // login
          this.props.login
        );
      }
    }
  }

  _clearEdits = () => {
    const {
      deck,
    } = this.props;
    if (!deck) {
      return;
    }
    this.setState({
      nameChange: undefined,
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
    xpAdjustment: number,
    nameChange?: string
  ) {
    const {
      deck,
    } = this.props;
    if (!deck) {
      return false;
    }
    const deltas = this.slotDeltas(deck, slots, ignoreDeckLimitSlots);
    return (nameChange && deck.name !== nameChange) ||
      (deck.previous_deck && deck.xp_adjustment !== xpAdjustment) ||
      keys(deltas.removals).length > 0 ||
      keys(deltas.additions).length > 0 ||
      deltas.ignoreDeckLimitChanged;
  }

  _showXpEditDialog = () => {
    const {
      deck,
      showCountEditDialog,
    } = this.props;
    if (!deck) {
      return;
    }
    const {
      xpAdjustment,
    } = this.state;

    showCountEditDialog(
      'Available XP',
      (deck.xp || 0) + (xpAdjustment || 0),
      this._updateXp
    );
  };

  _updateXp = (newXp: number) => {
    const {
      deck,
    } = this.props;
    if (!deck) {
      return;
    }
    const xpAdjustment = newXp - (deck.xp || 0);
    this.setState({
      xpAdjustment,
      hasPendingEdits: this.hasPendingEdits(
        this.state.slots,
        this.state.ignoreDeckLimitSlots,
        xpAdjustment,
        this.state.nameChange),
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
        this.state.xpAdjustment,
        this.state.nameChange),
    }, this._syncNavigationButtons);
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
        this.state.xpAdjustment,
        this.state.nameChange),
    }, this._syncNavigationButtons);
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
        ignoreDeckLimitSlots: deck.ignoreDeckLimitSlots || {},
        xpAdjustment: deck.xp_adjustment || 0,
        parsedDeck,
        hasPendingEdits: false,
        loaded: true,
      }, this._syncNavigationButtons);
    }
  }

  _showEditNameDialog = () => {
    const {
      deck,
      showTextEditDialog,
    } = this.props;
    if (!deck) {
      return;
    }
    showTextEditDialog(
      t`Edit Deck Name`,
      this.state.nameChange || deck.name,
      this._saveName
    );
  };

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
    if (!deck || deck.next_deck) {
      return null;
    }
    return (
      <View>
        <View style={styles.buttonRow}>
          <Button
            style={styles.button}
            text={t`Edit`}
            color="purple"
            icon={<MaterialIcons size={20 * DeviceInfo.getFontScale()} color="#FFFFFF" name="edit" />}
            onPress={this._onEditPressed}
          />
          { !hasPendingEdits && (
            <Button
              text={t`Upgrade Deck`}
              color="yellow"
              icon={<MaterialCommunityIcons size={20 * DeviceInfo.getFontScale()} color="#FFFFFF" name="arrow-up-bold" />}
              onPress={this._onUpgradePressed}
            />
          ) }
        </View>
        { hasPendingEdits && (
          <View style={styles.buttonRow}>
            <Button
              style={styles.button}
              text={t`Save`}
              color="green"
              onPress={this._saveEdits}
            />
            <Button
              text={t`Cancel Edits`}
              color="red"
              onPress={this._clearEdits}
            />
          </View>
        ) }
      </View>
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
    } = this.state;
    if (!deck || !loaded || !parsedDeck) {
      return null;
    }

    const {
      slots,
      ignoreDeckLimitSlots,
      investigator,
    } = parsedDeck;

    const validator = new DeckValidation(investigator);
    return validator.getProblem(flatMap(keys(slots), code => {
      const card = cards[code];
      return map(
        range(0, Math.max(0, slots[code] - (ignoreDeckLimitSlots[code] || 0))),
        () => card
      );
    }));
  }

  render() {
    const {
      deck,
      componentId,
      isPrivate,
      captureViewRef,
      cards,
      campaign,
      signedIn,
      login,
      showTraumaDialog,
      investigatorDataUpdates,
    } = this.props;
    const {
      loaded,
      parsedDeck,
      nameChange,
      hasPendingEdits,
      xpAdjustment,
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
    return (
      <View>
        <View style={styles.container} ref={captureViewRef}>
          <DeckViewTab
            componentId={componentId}
            deck={deck}
            deckName={nameChange || deck.name}
            parsedDeck={parsedDeck}
            problem={this.getProblem() || undefined}
            hasPendingEdits={hasPendingEdits}
            cards={cards}
            isPrivate={!!isPrivate}
            buttons={this.renderButtons()}
            showEditNameDialog={this._showEditNameDialog}
            showEditSpecial={deck.next_deck ? undefined : this._onEditSpecialPressed}
            signedIn={signedIn}
            login={login}
            deleteDeck={this._deleteDeck}
            uploadLocalDeck={this._uploadLocalDeck}
            campaign={campaign}
            showTraumaDialog={showTraumaDialog}
            investigatorDataUpdates={investigatorDataUpdates}
          />
          <DeckNavFooter
            componentId={componentId}
            parsedDeck={parsedDeck}
            cards={cards}
            xpAdjustment={xpAdjustment}
            showXpEditDialog={deck.previous_deck ? this._showXpEditDialog : undefined}
          />
        </View>
        { this.renderSavingDialog() }
        { this.renderCopyDialog() }
      </View>
    );
  }
}

function mapStateToProps(state: AppState, props: NavigationProps & DeckDetailProps): ReduxProps {
  const id = getEffectiveDeckId(state, props.id);
  const deck = getDeck(state, id) || undefined;
  const previousDeck = (
    deck && deck.previous_deck && getDeck(state, deck.previous_deck)
  ) || undefined;
  return {
    deck,
    previousDeck,
    campaign: (props.campaignId ?
      getCampaign(state, props.campaignId) :
      getCampaignForDeck(state, id)) || undefined,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    fetchPrivateDeck,
    fetchPublicDeck,
    updateDeck,
    removeDeck,
    replaceLocalDeck,
    updateCampaign,
  }, dispatch);
}

export default withPlayerCards(
  connect<ReduxProps, ReduxActionProps, NavigationProps & DeckDetailProps & PlayerCardProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(
    withTraumaDialog(
      withDialogs(
        withLoginState(DeckDetailView)
      )
    )
  )
);

const styles = StyleSheet.create({
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
  buttonRow: {
    paddingTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    marginRight: 8,
  },
  errorMargin: {
    padding: 16,
  },
});

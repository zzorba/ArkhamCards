import React from 'react';
import PropTypes from 'prop-types';
import { findIndex, flatMap, forEach, keys, map, range, throttle } from 'lodash';
import {
  Alert,
  ActivityIndicator,
  BackHandler,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { Navigation } from 'react-native-navigation';
import DialogComponent from 'react-native-dialog';
import DeviceInfo from 'react-native-device-info';

import L from '../../app/i18n';
import withLoginState from '../withLoginState';
import CopyDeckDialog from '../CopyDeckDialog';
import { handleAuthErrors } from '../authHelper';
import withTraumaDialog from '../campaign/withTraumaDialog';
import { updateLocalDeck } from '../decks/localHelper';
import Dialog from '../core/Dialog';
import withDialogs from '../core/withDialogs';
import Button from '../core/Button';
import { iconsMap } from '../../app/NavIcons';
import {
  fetchPrivateDeck,
  fetchPublicDeck,
  login,
  updateDeck,
  removeDeck,
  replaceLocalDeck,
} from '../../actions';
import { updateCampaign } from '../campaign/actions';
import { saveDeck, newCustomDeck } from '../../lib/authApi';
import withPlayerCards from '../withPlayerCards';
import DeckValidation from '../../lib/DeckValidation';
import { FACTION_DARK_GRADIENTS } from '../../constants';
import { parseDeck } from '../parseDeck';
import DeckViewTab from './DeckViewTab';
import DeckNavFooter from '../DeckNavFooter';
import { getCampaign, getDeck, getEffectiveDeckId, getCampaignForDeck } from '../../reducers';
import typography from '../../styles/typography';

class DeckDetailView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isPrivate: PropTypes.bool,
    modal: PropTypes.bool,
    /* eslint-disable react/no-unused-prop-types */
    campaignId: PropTypes.number,
    // passed props
    title: PropTypes.string,
    // From realm.
    cards: PropTypes.object,
    // From redux.
    campaign: PropTypes.object,
    deck: PropTypes.object,
    previousDeck: PropTypes.object,
    login: PropTypes.func.isRequired,
    signedIn: PropTypes.bool,
    updateDeck: PropTypes.func.isRequired,
    removeDeck: PropTypes.func.isRequired,
    fetchPublicDeck: PropTypes.func.isRequired,
    fetchPrivateDeck: PropTypes.func.isRequired,
    replaceLocalDeck: PropTypes.func.isRequired,
    updateCampaign: PropTypes.func.isRequired,
    // From HOC
    showTextEditDialog: PropTypes.func.isRequired,
    showCountEditDialog: PropTypes.func.isRequired,
    captureViewRef: PropTypes.func.isRequired,
    viewRef: PropTypes.object,
    showTraumaDialog: PropTypes.func.isRequired,
    investigatorDataUpdates: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      parsedDeck: null,
      slots: {},
      ignoreDeckLimitSlots: {},
      xpAdjustment: 0,
      loaded: false,
      saving: false,
      saveError: null,
      copying: false,
      deleting: false,
      nameChange: null,
      hasPendingEdits: false,
      visible: true,
    };
    this._dismissSaveError = this.dismissSaveError.bind(this);
    this._handleSaveError = this.handleSaveError.bind(this);
    this._uploadLocalDeck = throttle(this.uploadLocalDeck.bind(this), 200);
    this._toggleCopyDialog = this.toggleCopyDialog.bind(this);
    this._saveName = this.saveName.bind(this);
    this._onEditPressed = this.onEditPressed.bind(this);
    this._onEditSpecialPressed = this.onEditSpecialPressed.bind(this);
    this._onUpgradePressed = this.onUpgradePressed.bind(this);
    this._clearEdits = this.clearEdits.bind(this);
    this._syncNavigationButtons = this.syncNavigationButtons.bind(this);
    this._updateSlots = this.updateSlots.bind(this);
    this._updateIgnoreDeckLimitSlots = this.updateIgnoreDeckLimitSlots.bind(this);
    this._showXpEditDialog = this.showXpEditDialog.bind(this);
    this._updateXp = this.updateXp.bind(this);
    this._saveEditsAndDismiss = throttle(this.saveEdits.bind(this, true), 200);
    this._saveEdits = throttle(this.saveEdits.bind(this, false), 200);
    this._showEditNameDialog = this.showEditNameDialog.bind(this);
    this._clearEdits = this.clearEdits.bind(this);
    this._handleBackPress = this.handleBackPress.bind(this);
    this._deleteDeck = this.deleteDeck.bind(this);

    const leftButtons = props.modal ? [
      Platform.OS === 'ios' ? {
        text: L('Done'),
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
    this._navEventListener.remove();
  }

  componentDidUpdate(prevProps) {
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
            L('Deck has been deleted'),
            L('It looks like you deleted this deck from ArkhamDB.\n\n If it was part of a campaign you can add the same investigator back to restore your campaign data.'),
            [{
              text: L('OK'),
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

  deleteDeck(deleteAllVersions) {
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
  }

  toggleCopyDialog() {
    this.setState({
      copying: !this.state.copying,
    });
  }

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
        text: L('Save'),
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

  syncNavigationButtons() {
    const {
      componentId,
    } = this.props;

    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: this.getRightButtons(),
      },
    });
  }

  handleBackPress() {
    if (!this.state.visible) {
      return false;
    }
    if (this.state.hasPendingEdits) {
      Alert.alert(
        L('Save deck changes?'),
        L('Looks like you have made some changes that have not been saved.'),
        [{
          text: L('Save Changes'),
          onPress: () => {
            this._saveEditsAndDismiss();
          },
        }, {
          text: L('Discard Changes'),
          style: 'destructive',
          onPress: () => {
            Navigation.dismissAllModals();
          },
        }, {
          text: L('Cancel'),
          style: 'cancel',
        }],
      );
    } else {
      Navigation.dismissAllModals();
    }
    return true;
  }

  navigationButtonPressed({ buttonId }) {
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

  saveName(name) {
    const {
      slots,
      ignoreDeckLimitSlots,
      xpAdjustment,
    } = this.state;
    const pendingEdits = this.hasPendingEdits(
      name,
      slots,
      ignoreDeckLimitSlots,
      xpAdjustment
    );
    this.setState({
      nameChange: name,
      hasPendingEdits: pendingEdits,
      editNameDialogVisible: false,
    }, this._syncNavigationButtons);
  }

  onEditSpecialPressed() {
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
    const investigator = cards[deck.investigator_code];
    const addedWeaknesses = this.addedBasicWeaknesses(
      slots,
      ignoreDeckLimitSlots);

    Navigation.push(componentId, {
      component: {
        name: 'Deck.EditSpecial',
        passProps: {
          campaignId: campaign ? campaign.id : null,
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
              text: L('Edit Special Cards'),
              color: 'white',
            },
            backButton: {
              title: L('Back'),
              color: 'white',
            },
            background: {
              color: FACTION_DARK_GRADIENTS[investigator ? investigator.faction_code : 'neutral'][0],
            },
          },
        },
      },
    });
  }

  onEditPressed() {
    const {
      componentId,
      deck,
      previousDeck,
      cards,
    } = this.props;
    const investigator = cards[deck.investigator_code];
    Navigation.push(componentId, {
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
              text: L('Edit Deck'),
              color: 'white',
            },
            backButton: {
              title: L('Back'),
              color: 'white',
            },
            background: {
              color: FACTION_DARK_GRADIENTS[investigator ? investigator.faction_code : 'neutral'][0],
            },
          },
        },
      },
    });
  }

  onUpgradePressed() {
    const {
      componentId,
      deck,
      campaign,
    } = this.props;
    const {
      parsedDeck,
    } = this.state;
    Navigation.push(componentId, {
      component: {
        name: 'Deck.Upgrade',
        passProps: {
          id: deck.id,
          showNewDeck: true,
          campaignId: campaign ? campaign.id : null,
        },
        options: {
          statusBar: {
            style: 'light',
          },
          topBar: {
            title: {
              text: L('Upgrade Deck'),
              color: 'white',
            },
            subtitle: {
              text: parsedDeck ? parsedDeck.investigator.name : '',
              color: 'white',
            },
            background: {
              color: FACTION_DARK_GRADIENTS[parsedDeck ? parsedDeck.investigator.faction_code : 'neutral'][0],
            },
          },
        },
      },
    });
  }

  uploadLocalDeck(isRetry) {
    const {
      deck,
      login,
      id,
      replaceLocalDeck,
    } = this.props;
    const {
      parsedDeck: {
        slots,
        ignoreDeckLimitSlots,
      },
      saving,
    } = this.state;
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
            nameChange: null,
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

  dismissSaveError() {
    this.setState({
      saveError: null,
      saving: false,
    });
  }

  handleSaveError(err) {
    this.setState({
      saving: false,
      saveError: err.message || 'Unknown Error',
    });
  }

  updateCampaignWeaknessSet(newAssignedCards) {
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

  saveEdits(dismissAfterSave, isRetry) {
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
      const {
        slots,
        ignoreDeckLimitSlots,
      } = parsedDeck;

      const problemObj = this.getProblem();
      const problem = problemObj ? problemObj.reason : '';

      const addedBasicWeaknesses = this.addedBasicWeaknesses(
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
            nameChange: null,
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
                nameChange: null,
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

  clearEdits() {
    const {
      deck,
    } = this.props;
    this.setState({
      nameChange: null,
      xpAdjustment: deck.xp_adjustment || 0,
    }, () => {
      this.updateSlots(deck.slots, true);
    });
  }

  slotDeltas(slots, ignoreDeckLimitSlots) {
    const {
      deck,
    } = this.props;
    const result = {
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

  addedBasicWeaknesses(slots, ignoreDeckLimitSlots) {
    const {
      cards,
    } = this.props;
    const deltas = this.slotDeltas(slots, ignoreDeckLimitSlots);
    const addedWeaknesses = [];
    forEach(deltas.additions, (addition, code) => {
      if (cards[code] && cards[code].subtype_code === 'basicweakness') {
        forEach(range(0, addition), () => addedWeaknesses.push(code));
      }
    });
    return addedWeaknesses;
  }

  hasPendingEdits(nameChange, slots, ignoreDeckLimitSlots, xpAdjustment) {
    const {
      deck,
    } = this.props;
    const deltas = this.slotDeltas(slots, ignoreDeckLimitSlots);
    return (nameChange && deck.name !== nameChange) ||
      (deck.previous_deck && deck.xp_adjustment !== xpAdjustment) ||
      keys(deltas.removals).length > 0 ||
      keys(deltas.additions).length > 0 ||
      deltas.ignoreDeckLimitChanged;
  }

  showXpEditDialog() {
    const {
      deck: {
        xp,
      },
      showCountEditDialog,
    } = this.props;
    const {
      xpAdjustment,
    } = this.state;

    showCountEditDialog(
      'Available XP',
      (xp || 0) + (xpAdjustment || 0),
      this._updateXp
    );
  }

  updateXp(newXp) {
    const {
      deck: {
        xp,
      },
    } = this.props;

    const xpAdjustment = newXp - xp;
    this.setState({
      xpAdjustment,
      hasPendingEdits: this.hasPendingEdits(
        this.state.nameChange,
        this.state.slots,
        this.state.ignoreDeckLimitSlots,
        xpAdjustment),
    });
  }

  updateIgnoreDeckLimitSlots(newIgnoreDeckLimitSlots) {
    const {
      deck,
      previousDeck,
      cards,
    } = this.props;
    const {
      slots,
    } = this.state;
    const parsedDeck = parseDeck(deck, slots, newIgnoreDeckLimitSlots, cards, previousDeck);
    this.setState({
      ignoreDeckLimitSlots: newIgnoreDeckLimitSlots,
      parsedDeck,
      hasPendingEdits: this.hasPendingEdits(
        this.state.nameChange,
        slots,
        newIgnoreDeckLimitSlots,
        this.state.xpAdjustment),
    }, this._syncNavigationButtons);
  }

  updateSlots(newSlots, resetIgnoreDeckLimitSlots) {
    const {
      deck,
      previousDeck,
      cards,
    } = this.props;
    const ignoreDeckLimitSlots = resetIgnoreDeckLimitSlots ?
      (deck.ignoreDeckLimitSlots || {}) :
      this.state.ignoreDeckLimitSlots;
    const parsedDeck = parseDeck(deck, newSlots, ignoreDeckLimitSlots, cards, previousDeck);
    this.setState({
      slots: newSlots,
      ignoreDeckLimitSlots: ignoreDeckLimitSlots,
      parsedDeck,
      hasPendingEdits: this.hasPendingEdits(
        this.state.nameChange,
        newSlots,
        ignoreDeckLimitSlots,
        this.state.xpAdjustment),
    }, this._syncNavigationButtons);
  }

  loadCards(deck, previousDeck) {
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

  showEditNameDialog() {
    const {
      deck,
      showTextEditDialog,
    } = this.props;
    showTextEditDialog(
      L('Edit Deck Name'),
      this.state.nameChange || deck.name,
      this._saveName
    );
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
        deckId={copying ? id : null}
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
        <Dialog title={L('Error')} visible={saving} viewRef={viewRef}>
          <Text style={[styles.errorMargin, typography.small]}>
            { saveError }
          </Text>
          <DialogComponent.Button
            label={L('Okay')}
            onPress={this._dismissSaveError}
          />
        </Dialog>
      );

    }
    return (
      <Dialog title={L('Saving')} visible={saving} viewRef={viewRef}>
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
            text={L('Edit')}
            color="purple"
            icon={<MaterialIcons size={20 * DeviceInfo.getFontScale()} color="#FFFFFF" name="edit" />}
            onPress={this._onEditPressed}
          />
          { !hasPendingEdits && (
            <Button
              text={L('Upgrade Deck')}
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
              text={L('Save')}
              color="green"
              onPress={this._saveEdits}
            />
            <Button
              text={L('Cancel Edits')}
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
            problem={this.getProblem()}
            hasPendingEdits={hasPendingEdits}
            cards={cards}
            isPrivate={isPrivate}
            buttons={this.renderButtons()}
            showEditNameDialog={this._showEditNameDialog}
            showEditSpecial={deck.next_deck ? null : this._onEditSpecialPressed}
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
            showXpEditDialog={deck.previous_deck ? this._showXpEditDialog : null}
          />
        </View>
        { this.renderSavingDialog() }
        { this.renderCopyDialog() }
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  const id = getEffectiveDeckId(state, props.id);
  const deck = getDeck(state, id);
  return {
    id,
    deck,
    previousDeck: deck && deck.previous_deck && getDeck(state, deck.previous_deck),
    campaign: props.campaignId ?
      getCampaign(state, props.campaignId) :
      getCampaignForDeck(state, id),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    login,
    fetchPrivateDeck,
    fetchPublicDeck,
    updateDeck,
    removeDeck,
    replaceLocalDeck,
    updateCampaign,
  }, dispatch);
}

export default withPlayerCards(
  connect(mapStateToProps, mapDispatchToProps)(
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

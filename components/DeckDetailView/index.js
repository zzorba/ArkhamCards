import React from 'react';
import PropTypes from 'prop-types';
import { findIndex, flatMap, forEach, keys, map, range, throttle } from 'lodash';
import {
  Alert,
  ActivityIndicator,
  BackHandler,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { Navigation } from 'react-native-navigation';

import L from '../../app/i18n';
import CopyDeckDialog from '../CopyDeckDialog';
import { handleAuthErrors } from '../authHelper';
import Dialog from '../core/Dialog';
import withTextEditDialog from '../core/withTextEditDialog';
import Button from '../core/Button';
import { iconsMap } from '../../app/NavIcons';
import * as Actions from '../../actions';
import { saveDeck } from '../../lib/authApi';
import withPlayerCards from '../withPlayerCards';
import DeckValidation from '../../lib/DeckValidation';
import { FACTION_DARK_GRADIENTS } from '../../constants';
import { parseDeck } from '../parseDeck';
import DeckViewTab from './DeckViewTab';
import DeckNavFooter from '../DeckNavFooter';
import { getDeck } from '../../reducers';

class DeckDetailView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isPrivate: PropTypes.bool,
    modal: PropTypes.bool,
    campaignId: PropTypes.number,
    // passed props
    title: PropTypes.string,
    // From realm.
    cards: PropTypes.object,
    // From redux.
    login: PropTypes.func.isRequired,
    deck: PropTypes.object,
    previousDeck: PropTypes.object,
    updateDeck: PropTypes.func.isRequired,
    fetchPublicDeck: PropTypes.func.isRequired,
    fetchPrivateDeck: PropTypes.func.isRequired,
    showTextEditDialog: PropTypes.func.isRequired,
    captureViewRef: PropTypes.func.isRequired,
    viewRef: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      parsedDeck: null,
      slots: {},
      loaded: false,
      saving: false,
      copying: false,
      nameChange: null,
      hasPendingEdits: false,
    };
    this._toggleCopyDialog = throttle(this.toggleCopyDialog.bind(this), 200);
    this._saveName = this.saveName.bind(this);
    this._onEditPressed = throttle(this.onEditPressed.bind(this), 200);
    this._onUpgradePressed = throttle(this.onUpgradePressed.bind(this), 200);
    this._clearEdits = this.clearEdits.bind(this);
    this._syncNavigationButtons = this.syncNavigationButtons.bind(this);
    this._updateSlots = this.updateSlots.bind(this);
    this._saveEdits = throttle(this.saveEdits.bind(this, false), 200);
    this._showEditNameDialog = throttle(this.showEditNameDialog.bind(this), 200);
    this._clearEdits = this.clearEdits.bind(this);
    this._handleBackPress = throttle(this.handleBackPress.bind(this), 200);

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
    if (isPrivate) {
      fetchPrivateDeck(id);
    } else {
      fetchPublicDeck(id, false);
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
      isPrivate,
      previousDeck,
      fetchPrivateDeck,
      fetchPublicDeck,
    } = this.props;
    if (deck !== prevProps.deck) {
      if (!deck) {
        Alert.alert(
          'Deck has been deleted',
          'It looks like you deleted this deck from ArkhamDB.\n\n' +
          'If it was part of a campaign you can add the same investigator back to restore your campaign data.',
          [{
            text: 'OK',
            onPress: () => {
              Navigation.dismissAllModals();
            },
          }],
        );
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
    const editable = isPrivate && !deck.next_deck;
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
    if (this.state.hasPendingEdits) {
      Alert.alert(
        'Save deck changes?',
        'Looks like you have made some changes that have not been saved.',
        [{
          text: 'Save Changes',
          onPress: () => {
            this._saveEdits(true);
          },
        }, {
          text: 'Discard Changes',
          style: 'destructive',
          onPress: () => {
            Navigation.dismissAllModals();
          },
        }, {
          text: 'Cancel',
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
    } = this.state;
    const pendingEdits = this.hasPendingEdits(name, slots);
    this.setState({
      nameChange: name,
      hasPendingEdits: pendingEdits,
      editNameDialogVisible: false,
    }, this._syncNavigationButtons);
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
          updateSlots: this._updateSlots,
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
      campaignId,
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
          campaignId,
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

  saveEdits(dismissAfterSave) {
    const {
      deck,
      updateDeck,
      cards,
    } = this.props;
    if (!this.state.saving) {
      this.setState({
        saving: true,
      });
      const {
        parsedDeck,
        nameChange,
      } = this.state;
      const {
        slots,
        investigator,
      } = parsedDeck;

      const validator = new DeckValidation(investigator);
      const problemObj = validator.getProblem(flatMap(keys(slots), code => {
        const card = cards[code];
        return map(range(0, slots[code]), () => card);
      }));
      const problem = problemObj ? problemObj.reason : '';

      const savePromise = saveDeck(
        deck.id,
        nameChange || deck.name,
        slots,
        problem,
        parsedDeck.spentXp
      );
      handleAuthErrors(
        savePromise,
        // onSuccess
        deck => {
          updateDeck(deck.id, deck, true);
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
        // onFailure
        () => {
          this.setState({
            saving: false,
          });
        },
        // retry
        () => {
          this.saveEdits(dismissAfterSave);
        },
        // login
        this.props.login
      );
    }
  }

  clearEdits() {
    const {
      deck,
      componentId,
    } = this.props;
    this.setState({
      nameChange: null,
    }, () => {
      Navigation.mergeOptions(componentId, {
        topBar: {
          title: {
            text: deck.name,
          },
        },
      });
      this.updateSlots(deck.slots);
    });
  }

  hasPendingEdits(nameChange, slots) {
    const {
      deck,
    } = this.props;

    const removals = {};
    forEach(keys(deck.slots), code => {
      const currentDeckCount = slots[code] || 0;
      if (deck.slots[code] > currentDeckCount) {
        removals[code] = deck.slots[code] - currentDeckCount;
      }
    });
    const additions = {};
    forEach(keys(slots), code => {
      const ogDeckCount = deck.slots[code] || 0;
      if (ogDeckCount < slots[code]) {
        removals[code] = slots[code] - ogDeckCount;
      }
    });

    return (nameChange && deck.name !== nameChange) ||
      keys(removals).length > 0 ||
      keys(additions).length > 0;
  }

  updateSlots(newSlots) {
    const {
      deck,
      previousDeck,
      cards,
    } = this.props;
    const parsedDeck = parseDeck(deck, newSlots, cards, previousDeck);
    this.setState({
      slots: newSlots,
      parsedDeck,
      hasPendingEdits: this.hasPendingEdits(this.state.nameChange, newSlots),
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
      const parsedDeck = parseDeck(deck, deck.slots, cards, previousDeck);
      this.setState({
        slots: deck.slots,
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
      />
    );
  }

  renderSavingDialog() {
    const {
      viewRef,
    } = this.props;
    const {
      saving,
    } = this.state;
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
            icon={<MaterialIcons size={20} color="#FFFFFF" name="edit" />}
            onPress={this._onEditPressed}
          />
          { !hasPendingEdits && (
            <Button
              text={L('Upgrade Deck')}
              color="yellow"
              icon={<MaterialCommunityIcons size={20} color="#FFFFFF" name="arrow-up-bold" />}
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

  render() {
    const {
      deck,
      componentId,
      isPrivate,
      captureViewRef,
      cards,
    } = this.props;
    const {
      loaded,
      parsedDeck,
      nameChange,
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
            cards={cards}
            isPrivate={isPrivate}
            buttons={this.renderButtons()}
            showEditNameDialog={this._showEditNameDialog}
          />
          <DeckNavFooter
            componentId={componentId}
            parsedDeck={parsedDeck}
            cards={cards}
          />
        </View>
        { this.renderSavingDialog() }
        { this.renderCopyDialog() }
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  const deck = getDeck(state, props.id);
  return {
    deck,
    previousDeck: deck && deck.previous_deck && getDeck(state, deck.previous_deck),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default withPlayerCards(
  connect(mapStateToProps, mapDispatchToProps)(withTextEditDialog(DeckDetailView))
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
  },
  button: {
    marginRight: 8,
  },
});

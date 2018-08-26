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

import L from '../../app/i18n';
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
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    isPrivate: PropTypes.bool,
    modal: PropTypes.bool,
    campaignId: PropTypes.number,
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

    const leftButtons = props.modal ? [
      Platform.OS === 'ios' ? {
        systemItem: 'done',
        id: 'back',
      } : {
        icon: iconsMap['arrow-left'],
        id: 'androidBack',
      },
    ] : [];
    const rightButtons = props.isPrivate && props.modal && !props.deck.next_deck ? [
      {
        id: 'editName',
        icon: iconsMap.edit,
      },
    ] : [];

    this.state = {
      parsedDeck: null,
      slots: {},
      loaded: false,
      saving: false,
      leftButtons,
      nameChange: null,
      hasPendingEdits: false,
    };
    this._saveName = this.saveName.bind(this);
    this._onEditPressed = this.onEditPressed.bind(this);
    this._onUpgradePressed = this.onUpgradePressed.bind(this);
    this._clearEdits = this.clearEdits.bind(this);
    this._syncNavigatorButtons = this.syncNavigatorButtons.bind(this);
    this._updateSlots = this.updateSlots.bind(this);
    this._saveEdits = throttle(this.saveEdits.bind(this, false), 200);
    this._clearEdits = this.clearEdits.bind(this);
    this._handleBackPress = this.handleBackPress.bind(this);

    if (props.modal) {
      props.navigator.setButtons({
        leftButtons,
        rightButtons,
      });
    }
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
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
  }

  componentDidUpdate(prevProps) {
    const {
      navigator,
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
              navigator.dismissAllModals();
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

  syncNavigatorButtons() {
    /* const {
      navigator,
    } = this.props;
    const {
      leftButtons,
      hasPendingEdits,
    } = this.state;

    if (hasPendingEdits) {
      navigator.setButtons({
        rightButtons: [
          {
            systemItem: 'save',
            id: 'save',
          },
        ],
      });
    } else {
      navigator.setButtons({
        rightButtons: [],
      });
    } */
  }

  handleBackPress() {
    const {
      navigator,
    } = this.props;
    console.log('Hardware Back Press');
    if (this.state.hasPendingEdits) {
      Alert.alert(
        'Save deck changes?',
        'Looks like you have made some changes that have not been saved.',
        [{
          text: 'Save Changes',
          onPress: () => {
            this.saveEdits(true);
          },
        }, {
          text: 'Discard Changes',
          style: 'destructive',
          onPress: () => {
            navigator.dismissAllModals();
          },
        }, {
          text: 'Cancel',
          style: 'cancel',
        }],
      );
    } else {
      navigator.dismissAllModals();
    }
    return true;
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'editName') {
        this.showEditNameDialog();
      } else if (event.id === 'edit') {
        this.onEditPressed();
      } else if (event.id === 'back' || event.id === 'androidBack') {
        this.handleBackPress();
      }
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
    });
    this.props.navigator.setTitle({ title: name });
  }

  onEditPressed() {
    const {
      navigator,
      deck,
      previousDeck,
      cards,
    } = this.props;
    const investigator = cards[deck.investigator_code];
    navigator.push({
      screen: 'Deck.Edit',
      backButtonTitle: L('Back'),
      passProps: {
        deck,
        previousDeck,
        slots: this.state.slots,
        updateSlots: this._updateSlots,
      },
      navigatorStyle: {
        navBarBackgroundColor: FACTION_DARK_GRADIENTS[investigator ? investigator.faction_code : 'neutral'][0],
        navBarTextColor: '#FFFFFF',
        navBarSubtitleColor: '#FFFFFF',
        navBarButtonColor: '#FFFFFF',
        statusBarTextColorScheme: 'light',
      },
    });
  }

  onUpgradePressed() {
    const {
      navigator,
      deck,
      campaignId,
    } = this.props;
    const {
      parsedDeck,
    } = this.state;
    navigator.push({
      screen: 'Deck.Upgrade',
      title: L('Upgrade'),
      subtitle: parsedDeck ? parsedDeck.investigator.name : '',
      backButtonTitle: L('Cancel'),
      passProps: {
        id: deck.id,
        showNewDeck: true,
        campaignId,
      },
    });
  }

  saveEdits(dismissAfterSave) {
    const {
      navigator,
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
            navigator.dismissAllModals();
          } else {
            this.setState({
              saving: false,
              nameChange: null,
              hasPendingEdits: false,
            });
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
      navigator,
    } = this.props;
    this.setState({
      nameChange: null,
    }, () => {
      navigator.setTitle({ title: deck.name });
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
    }, this._syncNavigatorButtons);
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
      }, this._syncNavigatorButtons);
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
      navigator,
      isPrivate,
      captureViewRef,
      cards,
    } = this.props;
    const {
      loaded,
      parsedDeck,
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
            navigator={navigator}
            deck={deck}
            parsedDeck={parsedDeck}
            cards={cards}
            isPrivate={isPrivate}
            buttons={this.renderButtons()}
          />
          <DeckNavFooter
            navigator={navigator}
            parsedDeck={parsedDeck}
            cards={cards}
          />
        </View>
        { this.renderSavingDialog() }
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

import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { throttle } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DialogComponent from 'react-native-dialog';

import SelectDeckSwitch from './SelectDeckSwitch';
import { parseDeck } from '../parseDeck';
import withPlayerCards from '../withPlayerCards';
import { handleAuthErrors } from '../authHelper';
import { showDeckModal } from '../navHelper';
import Dialog from '../core/Dialog';
import * as Actions from '../../actions';
import { newDeck, saveDeck } from '../../lib/authApi';
import L from '../../app/i18n';
import typography from '../../styles/typography';
import space from '../../styles/space';
import { getDeck, getBaseDeck, getLatestDeck } from '../../reducers';
import { COLORS } from '../../styles/colors';

class CopyDeckDialog extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    //
    toggleVisible: PropTypes.func.isRequired,
    deckId: PropTypes.number,
    viewRef: PropTypes.object,

    // from realm
    investigators: PropTypes.object,
    cards: PropTypes.object,
    // from redux
    deck: PropTypes.object,
    baseDeck: PropTypes.object,
    latestDeck: PropTypes.object,
    login: PropTypes.func.isRequired,
    setNewDeck: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      deckName: null,
      selectedDeckId: props.deckId,
    };

    this._updateNewDeck = this.updateNewDeck.bind(this);
    this._selectedDeckIdChanged = this.selectedDeckIdChanged.bind(this);
    this._onDeckNameChange = this.onDeckNameChange.bind(this);
    this._onOkayPress = throttle(this.onOkayPress.bind(this), 200);
    this._captureTextInputRef = this.captureTextInputRef.bind(this);
    this._textInputRef = null;
  }

  componentDidUpdate(prevProps) {
    const {
      deckId,
    } = this.props;
    if (deckId && deckId !== prevProps.deckId) {
      this.resetForm();
    }
  }

  onDeckNameChange(value) {
    this.setState({
      deckName: value,
    });
  }

  selectedDeckIdChanged(deckId, value) {
    if (value) {
      this.setState({
        selectedDeckId: deckId,
      });
    } else {
      this.setState({
        selectedDeckId: null,
      });
    }
  }

  captureTextInputRef(ref) {
    this._textInputRef = ref;
  }

  resetForm() {
    const {
      deckId,
      deck,
    } = this.props;
    this.setState({
      saving: false,
      selectedDeckId: deckId,
      deckName: deck ? deck.name : null,
    });
  }

  showNewDeck(deck) {
    const {
      componentId,
      setNewDeck,
      toggleVisible,
    } = this.props;
    const investigator = this.investigator();
    setNewDeck(deck.id, deck);
    this.setState({
      saving: false,
    });
    if (Platform.OS === 'android') {
      toggleVisible();
    }
    // Change the deck options for required cards, if present.
    showDeckModal(componentId, deck, investigator);
  }

  selectedDeck() {
    const {
      baseDeck,
      deck,
      latestDeck,
    } = this.props;
    const {
      selectedDeckId,
    } = this.state;

    if (baseDeck && baseDeck.id === selectedDeckId) {
      return baseDeck;
    }
    if (latestDeck && latestDeck.id === selectedDeckId) {
      return latestDeck;
    }
    return deck;
  }

  updateNewDeck(deck) {
    const cloneDeck = this.selectedDeck();
    const savePromise = saveDeck(
      deck.id,
      deck.name,
      cloneDeck.slots,
      cloneDeck.problem || '',
      0
    );
    handleAuthErrors(
      savePromise,
      // onSuccess
      deck => this.showNewDeck(deck),
      // onFailure
      () => {
        this.setState({
          saving: false,
        });
      },
      // retry
      () => {
        this.updateNewDeck(deck);
      },
      // login
      this.props.login
    );
  }

  onOkayPress() {
    const {
      login,
    } = this.props;
    const {
      deckName,
    } = this.state;
    const investigator = this.investigator();
    if (investigator && !this.state.saving) {
      this.setState({
        saving: true,
      });
      handleAuthErrors(
        newDeck(investigator.code, deckName),
        this._updateNewDeck,
        () => {
          this.setState({
            saving: false,
          });
        },
        () => this.onOkayPress(),
        login
      );
    }
  }

  investigator() {
    const {
      deck,
      investigators,
    } = this.props;
    return deck ? investigators[deck.investigator_code] : null;
  }

  renderDeckSelector() {
    const {
      deck,
      baseDeck,
      latestDeck,
      cards,
    } = this.props;
    const {
      selectedDeckId,
    } = this.state;
    const parsedCurrentDeck = deck && parseDeck(deck, deck.slots, cards);
    const parsedBaseDeck = baseDeck && parseDeck(baseDeck, baseDeck.slots, cards);
    const parsedLatestDeck = latestDeck && parseDeck(latestDeck, latestDeck.slots, cards);
    if (parsedCurrentDeck && !parsedBaseDeck && !parsedLatestDeck) {
      // Only one deck, no need to clone it.
      return null;
    }
    return (
      <React.Fragment>
        <DialogComponent.Description style={[typography.smallLabel, space.marginBottomS]}>
          { L('SELECT DECK VERSION TO COPY') }
        </DialogComponent.Description>
        { !!parsedBaseDeck && (
          <SelectDeckSwitch
            deckId={parsedBaseDeck.deck.id}
            label={L('Base Version\n{{xpCount}} XP', { xpCount: parsedBaseDeck.experience })}
            value={selectedDeckId === parsedBaseDeck.deck.id}
            onValueChange={this._selectedDeckIdChanged}
          />
        ) }
        { !!parsedCurrentDeck && (
          <SelectDeckSwitch
            deckId={parsedCurrentDeck.deck.id}
            label={L('Current Version {{version}}\n{{xpCount}} XP', {
              version: parsedCurrentDeck.deck.version,
              xpCount: parsedCurrentDeck.experience,
            })}
            value={selectedDeckId === parsedCurrentDeck.deck.id}
            onValueChange={this._selectedDeckIdChanged}
          />
        ) }
        { !!parsedLatestDeck && (
          <SelectDeckSwitch
            deckId={parsedLatestDeck.deck.id}
            label={L('Latest Version {{version}}\n{{xpCount}} XP', {
              version: parsedLatestDeck.deck.version,
              xpCount: parsedLatestDeck.experience,
            })}
            value={selectedDeckId === parsedLatestDeck.deck.id}
            onValueChange={this._selectedDeckIdChanged}
          />
        ) }
      </React.Fragment>
    );
  }

  renderFormContent() {
    const {
      saving,
      deckName,
    } = this.state;
    if (saving) {
      return (
        <ActivityIndicator
          style={styles.spinner}
          size="large"
          animating
        />
      );
    }
    return (
      <React.Fragment>
        <DialogComponent.Description style={[typography.smallLabel, space.marginBottomS]}>
          { L('NEW NAME') }
        </DialogComponent.Description>
        <DialogComponent.Input
          textInputRef={this._captureTextInputRef}
          value={deckName}
          placeholder={L('Required')}
          onChangeText={this._onDeckNameChange}
          returnKeyType="done"
        />
        { this.renderDeckSelector() }
      </React.Fragment>
    );
  }

  render() {
    const {
      toggleVisible,
      viewRef,
      deckId,
    } = this.props;
    const {
      saving,
      selectedDeckId,
    } = this.state;
    const investigator = this.investigator();
    if (!investigator) {
      return null;
    }
    const okDisabled = saving || selectedDeckId === null;
    return (
      <Dialog
        title={L('Copy Deck')}
        visible={!!deckId}
        viewRef={viewRef}
      >
        <DialogComponent.Description
          style={[styles.descriptionMargin, saving ? typography.center : typography.left]}
        >
          { saving ?
            L('Saving') :
            L('Make a copy of a deck so that you can use it in a different campaign or choose different upgrades.')
          }
        </DialogComponent.Description>
        { this.renderFormContent() }
        <DialogComponent.Button
          label={L('Cancel')}
          onPress={toggleVisible}
        />
        <DialogComponent.Button
          label={L('Okay')}
          color={okDisabled ? COLORS.darkGray : COLORS.lightBlue}
          disabled={okDisabled}
          onPress={this._onOkayPress}
        />
      </Dialog>
    );
  }
}

function mapStateToProps(state, props) {
  if (!props.deckId) {
    return {};
  }
  const deck = getDeck(state, props.deckId);
  let baseDeck = getBaseDeck(state, props.deckId);
  if (baseDeck && baseDeck.id === props.deckId) {
    baseDeck = null;
  }
  let latestDeck = getLatestDeck(state, props.deckId);
  if (latestDeck && latestDeck.id === props.deckId) {
    latestDeck = null;
  }
  return {
    deck,
    baseDeck,
    latestDeck,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default withPlayerCards(
  connect(mapStateToProps, mapDispatchToProps)(CopyDeckDialog)
);

const styles = StyleSheet.create({
  spinner: {
    height: 80,
  },
  descriptionMargin: {
    marginLeft: 8,
    marginRight: 8,
  },
});

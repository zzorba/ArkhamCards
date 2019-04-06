import React from 'react';
import { ActivityIndicator, Platform, TouchableOpacity, StyleSheet, View } from 'react-native';
import { throttle } from 'lodash';
import { bindActionCreators, Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import DialogComponent from 'react-native-dialog';

import SelectDeckSwitch from './SelectDeckSwitch';
import { parseDeck } from '../parseDeck';
import withPlayerCards, { PlayerCardProps } from '../withPlayerCards';
import { handleAuthErrors } from '../authHelper';
import { showDeckModal } from '../navHelper';
import Dialog from '../core/Dialog';
import withNetworkStatus, { InjectedNetworkStatusProps } from '../core/withNetworkStatus';
import { cloneLocalDeck } from '../decks/localHelper';
import { login, setNewDeck } from '../../actions';
import { Deck } from '../../actions/types';
import { newDeck, saveDeck } from '../../lib/authApi';
import L from '../../app/i18n';
import typography from '../../styles/typography';
import space from '../../styles/space';
import { getDeck, getBaseDeck, getLatestDeck, getNextLocalDeckId, AppState } from '../../reducers';
import { COLORS } from '../../styles/colors';

interface OwnProps {
  componentId: string;
  toggleVisible: () => void;
  deckId?: number;
  viewRef?: View;
  signedIn?: boolean;
}

interface ReduxProps {
  deck?: Deck;
  baseDeck?: Deck;
  latestDeck?: Deck;
  nextLocalDeckId: number;
}

interface ReduxActionProps {
  login: () => void;
  setNewDeck: (id: number, deck: Deck) => void;
}

type Props = OwnProps & ReduxProps & ReduxActionProps & PlayerCardProps & InjectedNetworkStatusProps;

interface State {
  saving: boolean;
  deckName: string | null;
  offlineDeck: boolean;
  selectedDeckId?: number;
}

class CopyDeckDialog extends React.Component<Props, State> {
  _textInputRef: View | null = null;
  _onOkayPress!: () => void;
  constructor(props: Props) {
    super(props);

    this.state = {
      saving: false,
      deckName: null,
      offlineDeck: !!(props.deck && props.deck.local),
      selectedDeckId: props.deckId,
    };

    this._onOkayPress = throttle(this.onOkayPress.bind(this, false), 200);
  }

  componentDidUpdate(prevProps: Props) {
    const {
      deckId,
    } = this.props;
    if (deckId && deckId !== prevProps.deckId) {
      this.resetForm();
    }
  }

  _onDeckTypeChange = (value: boolean) => {
    const {
      signedIn,
      login,
    } = this.props;
    if (value && !signedIn) {
      login();
    }
    this.setState({
      offlineDeck: !value,
    });
  };

  _onDeckNameChange = (value: string) => {
    this.setState({
      deckName: value,
    });
  };

  _selectedDeckIdChanged = (deckId: number, value: boolean) => {
    if (value) {
      this.setState({
        selectedDeckId: deckId,
      });
    } else {
      this.setState({
        selectedDeckId: undefined,
      });
    }
  };

  _captureTextInputRef = (ref: View) => {
    this._textInputRef = ref;
  };

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

  showNewDeck(deck: Deck) {
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

  selectedDeck(): Deck | undefined {
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

  _updateNewDeck = (deck: Deck) => {
    const cloneDeck = this.selectedDeck();
    if (!cloneDeck) {
      return;
    }
    const savePromise = saveDeck(
      deck.id,
      deck.name,
      cloneDeck.slots,
      cloneDeck.ignoreDeckLimitSlots,
      cloneDeck.problem || '',
      0,
      0
    );
    handleAuthErrors(
      savePromise,
      // onSuccess
      (deck: Deck) => this.showNewDeck(deck),
      // onFailure
      () => {
        this.setState({
          saving: false,
        });
      },
      // retry
      () => {
        this._updateNewDeck(deck);
      },
      // login
      this.props.login
    );
  };

  onOkayPress(isRetry: boolean) {
    const {
      login,
      signedIn,
      nextLocalDeckId,
      networkType,
    } = this.props;
    const {
      deckName,
      offlineDeck,
    } = this.state;
    const investigator = this.investigator();
    if (investigator && (!this.state.saving || isRetry)) {
      if (offlineDeck || !signedIn || networkType === 'none') {
        const cloneDeck = this.selectedDeck();
        if (!cloneDeck) {
          return;
        }
        const newDeck = cloneLocalDeck(nextLocalDeckId, cloneDeck, deckName || 'New Deck');
        this.showNewDeck(newDeck);
      } else {
        this.setState({
          saving: true,
        });
        handleAuthErrors(
          newDeck(investigator.code, deckName || 'New Deck'),
          this._updateNewDeck,
          () => {
            this.setState({
              saving: false,
            });
          },
          () => this.onOkayPress(true),
          login
        );
      }
    }
  }

  investigator() {
    const {
      deck,
      investigators,
    } = this.props;
    return deck && investigators[deck.investigator_code];
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
    const parsedCurrentDeck = deck && parseDeck(deck, deck.slots, deck.ignoreDeckLimitSlots || {}, cards);
    const parsedBaseDeck = baseDeck && parseDeck(baseDeck, baseDeck.slots, baseDeck.ignoreDeckLimitSlots || {}, cards);
    const parsedLatestDeck = latestDeck && parseDeck(latestDeck, latestDeck.slots, latestDeck.ignoreDeckLimitSlots || {}, cards);
    if (parsedCurrentDeck && !parsedBaseDeck && !parsedLatestDeck) {
      // Only one deck, no need to show a selector.
      return null;
    }
    return (
      <React.Fragment>
        <DialogComponent.Description style={[typography.smallLabel, space.marginBottomS]}>
          { L('SELECT DECK VERSION TO COPY') }
        </DialogComponent.Description>
        { parsedBaseDeck ? (
          <SelectDeckSwitch
            deckId={parsedBaseDeck.deck.id}
            label={L('Base Version\n{{xpCount}} XP', { xpCount: parsedBaseDeck.experience })}
            value={selectedDeckId === parsedBaseDeck.deck.id}
            onValueChange={this._selectedDeckIdChanged}
          />
        ) : null }
        { parsedCurrentDeck ? (
          <SelectDeckSwitch
            deckId={parsedCurrentDeck.deck.id}
            label={L('Current Version {{version}}\n{{xpCount}} XP', {
              version: parsedCurrentDeck.deck.version,
              xpCount: parsedCurrentDeck.experience,
            })}
            value={selectedDeckId === parsedCurrentDeck.deck.id}
            onValueChange={this._selectedDeckIdChanged}
          />
        ) : null}
        { parsedLatestDeck ? (
          <SelectDeckSwitch
            deckId={parsedLatestDeck.deck.id}
            label={L('Latest Version {{version}}\n{{xpCount}} XP', {
              version: parsedLatestDeck.deck.version,
              xpCount: parsedLatestDeck.experience,
            })}
            value={selectedDeckId === parsedLatestDeck.deck.id}
            onValueChange={this._selectedDeckIdChanged}
          />
        ) : null }
      </React.Fragment>
    );
  }

  renderFormContent() {
    const {
      signedIn,
      networkType,
      refreshNetworkStatus,
    } = this.props;
    const {
      saving,
      deckName,
      offlineDeck,
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
          value={deckName || ''}
          placeholder={L('Required')}
          onChangeText={this._onDeckNameChange}
          returnKeyType="done"
        />
        { this.renderDeckSelector() }
        <DialogComponent.Description style={[typography.smallLabel, space.marginBottomS]}>
          { L('DECK TYPE') }
        </DialogComponent.Description>
        <DialogComponent.Switch
          label={L('Create on ArkhamDB')}
          value={!offlineDeck && signedIn && networkType !== 'none'}
          disabled={networkType === 'none'}
          onValueChange={this._onDeckTypeChange}
          trackColor={COLORS.switchTrackColor}
        />
        { networkType === 'none' && (
          <TouchableOpacity onPress={refreshNetworkStatus}>
            <DialogComponent.Description style={[typography.small, { color: COLORS.red }, space.marginBottomS]}>
              { L('You seem to be offline. Refresh Network?') }
            </DialogComponent.Description>
          </TouchableOpacity>
        ) }
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

function mapStateToProps(state: AppState, props: OwnProps & PlayerCardProps): ReduxProps {
  if (!props.deckId) {
    return {
      nextLocalDeckId: getNextLocalDeckId(state),
    };
  }
  const deck = getDeck(state, props.deckId);
  let baseDeck: Deck | undefined = getBaseDeck(state, props.deckId);
  if (baseDeck && baseDeck.id === props.deckId) {
    baseDeck = undefined;
  }
  let latestDeck: Deck | undefined = getLatestDeck(state, props.deckId);
  if (latestDeck && latestDeck.id === props.deckId) {
    latestDeck = undefined;
  }
  return {
    deck: deck || undefined,
    baseDeck,
    latestDeck,
    nextLocalDeckId: getNextLocalDeckId(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({ login, setNewDeck }, dispatch);
}

export default withPlayerCards<OwnProps>(
  connect<ReduxProps, ReduxActionProps, OwnProps & PlayerCardProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(
    withNetworkStatus(CopyDeckDialog)
  )
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

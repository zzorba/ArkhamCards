import React from 'react';
import { head, flatMap, forEach, keys, map, range, throttle } from 'lodash';
import { StyleSheet, View } from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Navigation, EventSubscription } from 'react-native-navigation';

import { t } from 'ttag';
import { Campaign, Deck, DecksMap, Slots, WeaknessSet } from '../../actions/types';
import { updateCampaign } from './actions';
import { NavigationProps } from '../types';
import Button from '../core/Button';
import NavButton from '../core/NavButton';
import ToggleFilter from '../core/ToggleFilter';
import { parseDeck } from '../parseDeck';
import { updateLocalDeck } from '../decks/localHelper';
import { updateDeck } from '../../actions';
import { RANDOM_BASIC_WEAKNESS } from '../../constants';
import { iconsMap } from '../../app/NavIcons';
import { saveDeck } from '../../lib/authApi';
import DeckValidation from '../../lib/DeckValidation';
import { getCampaign, getAllDecks, getLatestDeckIds, AppState } from '../../reducers';
import { COLORS } from '../../styles/colors';
import { MyDecksSelectorProps } from '../campaign/MyDecksSelectorDialog';
import WeaknessDrawComponent from '../weakness/WeaknessDrawComponent';
import withPlayerCards, { PlayerCardProps } from '../withPlayerCards';
import { CampaignEditWeaknessProps } from './CampaignEditWeaknessDialog';

export interface CampaignDrawWeaknessProps {
  campaignId: number;
  deckSlots?: Slots;
  unsavedAssignedCards?: string[];
  saveWeakness?: (code: string, replaceRandomBasicWeakness: boolean) => void;
}

interface ReduxProps {
  weaknessSet: WeaknessSet;
  latestDeckIds: number[];
  decks: DecksMap;
}

interface ReduxActionProps {
  updateCampaign: (id: number, campaign: Campaign) => void;
  updateDeck: (id: number, deck: Deck, isWrite: boolean) => void;
}

type Props = NavigationProps & CampaignDrawWeaknessProps & ReduxProps & ReduxActionProps & PlayerCardProps;

interface State {
  selectedDeckId?: number;
  replaceRandomBasicWeakness: boolean;
  saving: boolean;
  pendingNextCard?: string;
  pendingAssignedCards: Slots;
  unsavedAssignedCards: string[];
  deckSlots?: Slots;
}

class CampaignDrawWeaknessDialog extends React.Component<Props, State> {
  _navEventListener: EventSubscription;
  _showEditWeaknessDialog!: () => void;
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedDeckId: props.deckSlots ? undefined : head(props.latestDeckIds),
      replaceRandomBasicWeakness: true,
      saving: false,
      pendingAssignedCards: {},
      unsavedAssignedCards: props.unsavedAssignedCards || [],
      deckSlots: props.deckSlots,
    };

    this._showEditWeaknessDialog = throttle(this.showEditWeaknessDialog.bind(this), 200);
    this._navEventListener = Navigation.events().bindComponent(this);

    if (!props.deckSlots) {
      Navigation.mergeOptions(props.componentId, {
        topBar: {
          rightButtons: [{
            icon: iconsMap.edit,
            id: 'edit',
            color: COLORS.navButton,
          }],
        },
      });
    }
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  showEditWeaknessDialog() {
    const {
      componentId,
      campaignId,
    } = this.props;
    Navigation.push<CampaignEditWeaknessProps>(componentId, {
      component: {
        name: 'Dialog.CampaignEditWeakness',
        passProps: {
          campaignId: campaignId,
        },
      },
    });

  }
  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'edit') {
      this._showEditWeaknessDialog();
    }
  }

  _toggleReplaceRandomBasicWeakness = () => {
    this.setState({
      replaceRandomBasicWeakness: !this.state.replaceRandomBasicWeakness,
    });
  };

  _selectDeck = (deck: Deck) => {
    this.setState({
      selectedDeckId: deck.id,
    });
  };

  _onPressInvestigator = () => {
    const {
      latestDeckIds,
      campaignId,
    } = this.props;
    const passProps: MyDecksSelectorProps = {
      campaignId: campaignId,
      onDeckSelect: this._selectDeck,
      selectedDeckIds: latestDeckIds,
      showOnlySelectedDeckIds: true,
    };
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'Dialog.DeckSelector',
            passProps,
          },
        }],
      },
    });
  };

  _updateDrawnCard = (nextCard: string, assignedCards: Slots) => {
    this.setState({
      pendingNextCard: nextCard,
      pendingAssignedCards: assignedCards,
    });
  };

  static updateSlots(slots: Slots, pendingNextCard: string, replaceRandomBasicWeakness: boolean) {
    const newSlots = Object.assign({}, slots);
    if (!newSlots[pendingNextCard]) {
      newSlots[pendingNextCard] = 0;
    }
    newSlots[pendingNextCard]++;
    if (replaceRandomBasicWeakness && newSlots[RANDOM_BASIC_WEAKNESS] > 0) {
      newSlots[RANDOM_BASIC_WEAKNESS]--;
      if (!newSlots[RANDOM_BASIC_WEAKNESS]) {
        delete newSlots[RANDOM_BASIC_WEAKNESS];
      }
    }
    return newSlots;
  }

  _saveDrawnCard = () => {
    const {
      pendingNextCard,
      pendingAssignedCards,
    } = this.state;
    const {
      campaignId,
      weaknessSet,
      updateCampaign,
      updateDeck,
      decks,
      cards,
      investigators,
      saveWeakness,
    } = this.props;
    const {
      selectedDeckId,
      replaceRandomBasicWeakness,
    } = this.state;
    if (!pendingNextCard) {
      return;
    }
    if (saveWeakness) {
      // We are in 'pending' mode to don't save it immediately.
      saveWeakness(pendingNextCard, replaceRandomBasicWeakness);
      const newSlots = this.state.deckSlots && CampaignDrawWeaknessDialog.updateSlots(
        this.state.deckSlots,
        pendingNextCard,
        replaceRandomBasicWeakness
      );
      this.setState({
        pendingAssignedCards: {},
        pendingNextCard: undefined,
        unsavedAssignedCards: [...this.state.unsavedAssignedCards, pendingNextCard],
        deckSlots: newSlots,
      });
      return;
    }
    const deck = selectedDeckId && decks[selectedDeckId];
    if (deck) {
      const previousDeck = deck.previous_deck ? decks[deck.previous_deck] : undefined;
      const investigator = investigators[deck.investigator_code];
      const ignoreDeckLimitSlots = deck.ignoreDeckLimitSlots || {};
      const newSlots = CampaignDrawWeaknessDialog.updateSlots(
        deck.slots,
        pendingNextCard,
        replaceRandomBasicWeakness
      );
      const parsedDeck = parseDeck(deck, newSlots, deck.ignoreDeckLimitSlots || {}, cards, previousDeck);
      const validator = new DeckValidation(investigator);
      const problemObj = validator.getProblem(flatMap(keys(newSlots), code => {
        const card = cards[code];
        return map(
          range(0, Math.max(0, newSlots[code] - (ignoreDeckLimitSlots[code] || 0))),
          () => card
        );
      }));
      const problem = problemObj ? problemObj.reason : '';

      if (deck.local) {
        const newDeck = updateLocalDeck(
          deck,
          deck.name,
          newSlots,
          problem,
          parsedDeck.spentXp,
          deck.xp_adjustment
        );
        updateDeck(newDeck.id, newDeck, true);
        this.setState({
          pendingAssignedCards: {},
          pendingNextCard: undefined,
        });
      } else {
        // ArkhamDB deck
        this.setState({
          saving: true,
        });
        saveDeck(
          deck.id,
          deck.name,
          newSlots,
          parsedDeck.ignoreDeckLimitSlots,
          problem,
          parsedDeck.spentXp,
          deck.xp_adjustment
        ).then(deck => {
          updateDeck(deck.id, deck, true);
          this.setState({
            saving: false,
            pendingAssignedCards: {},
            pendingNextCard: undefined,
          });
        });
      }
    }
    const newWeaknessSet = {
      ...weaknessSet,
      assignedCards: pendingAssignedCards,
    };
    updateCampaign(campaignId, { weaknessSet: newWeaknessSet } as any as Campaign);
  };

  renderInvestigatorChooser() {
    const {
      decks,
      investigators,
    } = this.props;
    const {
      selectedDeckId,
      replaceRandomBasicWeakness,
      deckSlots,
    } = this.state;
    const deck = selectedDeckId && decks[selectedDeckId];
    const investigator = deck && investigators[deck.investigator_code];
    const investigatorName = investigator ? investigator.name : '';
    const message = t`Investigator: ${investigatorName}`;
    const slots = (deckSlots || (deck && deck.slots)) || {};
    const hasRandomBasicWeakness = slots[RANDOM_BASIC_WEAKNESS] > 0;
    return (
      <View>
        { !!selectedDeckId && (
          <NavButton
            text={message}
            onPress={this._onPressInvestigator}
          />
        ) }
        { hasRandomBasicWeakness && (
          <ToggleFilter
            style={styles.toggleRow}
            label={t`Replace Random Weakness`}
            setting="replaceRandomBasicWeakness"
            value={replaceRandomBasicWeakness}
            onChange={this._toggleReplaceRandomBasicWeakness}
          />
        ) }
      </View>
    );
  }

  renderFlippedHeader() {
    const {
      decks,
      investigators,
    } = this.props;
    const {
      pendingNextCard,
      selectedDeckId,
    } = this.state;
    if (!pendingNextCard) {
      return null;
    }
    const deck = selectedDeckId && decks[selectedDeckId];
    const investigator = deck && investigators[deck.investigator_code];
    const buttonText = investigator ?
      t`Save to ${investigator.name}’s Deck` :
      t`Save to Deck`;
    return (
      <View style={styles.button}>
        <Button
          color="green"
          onPress={this._saveDrawnCard}
          text={buttonText}
        />
      </View>
    );
  }

  render() {
    const {
      componentId,
      weaknessSet,
    } = this.props;

    if (!weaknessSet) {
      return null;
    }

    const {
      unsavedAssignedCards,
    } = this.state;
    const assignedCards = Object.assign({}, weaknessSet.assignedCards);
    forEach(unsavedAssignedCards, code => {
      assignedCards[code] = (assignedCards[code] || 0) + 1;
    });

    const dynamicWeaknessSet = Object.assign({},
      weaknessSet,
      { assignedCards }
    );

    return (
      <WeaknessDrawComponent
        componentId={componentId}
        customHeader={this.renderInvestigatorChooser()}
        customFlippedHeader={this.renderFlippedHeader()}
        weaknessSet={dynamicWeaknessSet}
        updateDrawnCard={this._updateDrawnCard}
        saving={this.state.saving}
      />
    );
  }
}

function mapStateToProps(state: AppState, props: NavigationProps & CampaignDrawWeaknessProps): ReduxProps {
  const campaign: Campaign = getCampaign(state, props.campaignId) as Campaign;
  return {
    weaknessSet: campaign.weaknessSet,
    latestDeckIds: campaign ? getLatestDeckIds(state, campaign) : [],
    decks: getAllDecks(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    updateDeck,
    updateCampaign,
  }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, NavigationProps & CampaignDrawWeaknessProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(withPlayerCards<NavigationProps & CampaignDrawWeaknessProps & ReduxProps & ReduxActionProps>(CampaignDrawWeaknessDialog));

const styles = StyleSheet.create({
  toggleRow: {
    paddingTop: 4,
    width: '100%',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  button: {
    marginTop: 8,
  },
});

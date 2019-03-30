import React from 'react';
import PropTypes from 'prop-types';
import { head, flatMap, forEach, keys, map, range, throttle } from 'lodash';
import { StyleSheet, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import L from '../../app/i18n';
import { updateCampaign } from './actions';
import Button from '../core/Button';
import NavButton from '../core/NavButton';
import ToggleFilter from '../core/ToggleFilter';
import { parseDeck } from '../parseDeck';
import { updateLocalDeck } from '../decks/localHelper';
import * as Actions from '../../actions';
import { RANDOM_BASIC_WEAKNESS } from '../../constants';
import { iconsMap } from '../../app/NavIcons';
import { saveDeck } from '../../lib/authApi';
import DeckValidation from '../../lib/DeckValidation';
import { getCampaign, getAllDecks, getLatestDeckIds } from '../../reducers';
import { COLORS } from '../../styles/colors';
import WeaknessDrawComponent from '../weakness/WeaknessDrawComponent';
import withPlayerCards from '../withPlayerCards';

class CampaignDrawWeaknessDialog extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    campaignId: PropTypes.number.isRequired,
    deckSlots: PropTypes.object,
    saveWeakness: PropTypes.func,
    unsavedAssignedCards: PropTypes.array,

    // From redux
    weaknessSet: PropTypes.object.isRequired,
    latestDeckIds: PropTypes.array,
    decks: PropTypes.object,
    updateCampaign: PropTypes.func.isRequired,
    updateDeck: PropTypes.func.isRequired,
    // From realm
    investigators: PropTypes.object,
    cards: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedDeckId: props.deckSlots ? null : head(props.latestDeckIds),
      replaceRandomBasicWeakness: true,
      saving: false,
      pendingNextCard: null,
      pendingAssignedCards: null,
      unsavedAssignedCards: props.unsavedAssignedCards || [],
      deckSlots: props.deckSlots,
    };

    this._saveDrawnCard = this.saveDrawnCard.bind(this);
    this._selectDeck = this.selectDeck.bind(this);
    this._updateDrawnCard = this.updateDrawnCard.bind(this);
    this._onPressInvestigator = this.onPressInvestigator.bind(this);
    this._toggleReplaceRandomBasicWeakness = this.toggleReplaceRandomBasicWeakness.bind(this);
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
    Navigation.push(componentId, {
      component: {
        name: 'Dialog.CampaignEditWeakness',
        passProps: {
          campaignId: campaignId,
        },
      },
    });

  }
  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'edit') {
      this._showEditWeaknessDialog();
    }
  }

  toggleReplaceRandomBasicWeakness() {
    this.setState({
      replaceRandomBasicWeakness: !this.state.replaceRandomBasicWeakness,
    });
  }

  selectDeck(deck) {
    this.setState({
      selectedDeckId: deck.id,
    });
  }

  onPressInvestigator() {
    const {
      latestDeckIds,
      campaignId,
    } = this.props;
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'Dialog.DeckSelector',
            passProps: {
              campaignId: campaignId,
              onDeckSelect: this._selectDeck,
              selectedDeckIds: latestDeckIds,
              showOnlySelectedDeckIds: true,
            },
          },
        }],
      },
    });
  }

  updateDrawnCard(nextCard, assignedCards) {
    this.setState({
      pendingNextCard: nextCard,
      pendingAssignedCards: assignedCards,
    });
  }

  static updateSlots(slots, pendingNextCard, replaceRandomBasicWeakness) {
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

  saveDrawnCard() {
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
    if (saveWeakness) {
      // We are in 'pending' mode to don't save it immediately.
      saveWeakness(pendingNextCard, replaceRandomBasicWeakness);
      const newSlots = CampaignDrawWeaknessDialog.updateSlots(
        this.state.deckSlots,
        pendingNextCard,
        replaceRandomBasicWeakness
      );
      this.setState({
        pendingAssignedCards: null,
        pendingNextCard: null,
        unsavedAssignedCards: [...this.state.unsavedAssignedCards, pendingNextCard],
        deckSlots: newSlots,
      });
      return;
    }
    const deck = selectedDeckId && decks[selectedDeckId];
    if (deck) {
      const previousDeck = decks[deck.previous_deck];
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
          pendingAssignedCards: null,
          pendingNextCard: null,
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
            pendingAssignedCards: null,
            pendingNextCard: null,
          });
        });
      }
    }
    const newWeaknessSet = Object.assign(
      {},
      weaknessSet,
      { assignedCards: pendingAssignedCards },
    );
    updateCampaign(campaignId, { weaknessSet: newWeaknessSet });
  }

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
    const message = L('Investigator: {{name}}', { name: investigator ? investigator.name : '' });
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
            label={L('Replace Random Weakness')}
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
      L('Save to {{name}}’s Deck', { name: investigator.name }) :
      L('Save to Deck');
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

function mapStateToProps(state, props) {
  const campaign = getCampaign(state, props.campaignId);
  return {
    weaknessSet: campaign.weaknessSet,
    latestDeckIds: getLatestDeckIds(state, campaign),
    decks: getAllDecks(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, Actions, { updateCampaign }),
    dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withPlayerCards(CampaignDrawWeaknessDialog)
);

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

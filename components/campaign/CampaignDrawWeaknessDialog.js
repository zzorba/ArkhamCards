import React from 'react';
import PropTypes from 'prop-types';
import { head, flatMap, keys, map, range, throttle } from 'lodash';
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
import * as Actions from '../../actions';
import { iconsMap } from '../../app/NavIcons';
import { saveDeck } from '../../lib/authApi';
import DeckValidation from '../../lib/DeckValidation';
import { getCampaign, getAllDecks, getLatestDeckIds } from '../../reducers';
import WeaknessDrawComponent from '../weakness/WeaknessDrawComponent';
import withPlayerCards from '../withPlayerCards';

const RANDOM_BASIC_WEAKNESS = '01000';

class CampaignDrawWeaknessDialog extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    campaignId: PropTypes.number.isRequired,
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

  static get options() {
    return {
      topBar: {
        rightButtons: [{
          icon: iconsMap.edit,
          id: 'edit',
        }],
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedDeckId: head(props.latestDeckIds),
      replaceRandomBasicWeakness: true,
      saving: false,
      pendingNextCard: null,
      pendingAssignedCards: null,
    };

    this._saveDrawnCard = this.saveDrawnCard.bind(this);
    this._selectDeck = this.selectDeck.bind(this);
    this._updateDrawnCard = this.updateDrawnCard.bind(this);
    this._onPressInvestigator = this.onPressInvestigator.bind(this);
    this._toggleReplaceRandomBasicWeakness = this.toggleReplaceRandomBasicWeakness.bind(this);
    this._showEditWeaknessDialog = throttle(this.showEditWeaknessDialog.bind(this), 200);
    this._navEventListener = Navigation.events().bindComponent(this);
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
    } = this.props;
    const {
      selectedDeckId,
      replaceRandomBasicWeakness,
    } = this.state;
    const deck = selectedDeckId && decks[selectedDeckId];
    if (deck) {
      this.setState({
        saving: true,
      });
      const previousDeck = decks[deck.previous_deck];
      const investigator = investigators[deck.investigator_code];
      const newSlots = Object.assign({}, deck.slots);
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
      const parsedDeck = parseDeck(deck, newSlots, cards, previousDeck);
      const validator = new DeckValidation(investigator);
      const problemObj = validator.getProblem(flatMap(keys(newSlots), code => {
        const card = cards[code];
        return map(range(0, newSlots[code]), () => card);
      }));
      const problem = problemObj ? problemObj.reason : '';

      saveDeck(
        deck.id,
        deck.name,
        newSlots,
        problem,
        parsedDeck.spentXp
      ).then(deck => {
        updateDeck(deck.id, deck, true);
        this.setState({
          saving: false,
          pendingAssignedCards: null,
          pendingNextCard: null,
        });
      });
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
    } = this.state;
    const deck = selectedDeckId && decks[selectedDeckId];
    const investigator = deck && investigators[deck.investigator_code];
    const message = L('Investigator: {{name}}', { name: investigator ? investigator.name : '' });
    const hasRandomBasicWeakness = deck && deck.slots[RANDOM_BASIC_WEAKNESS] > 0;
    return (
      <View>
        <NavButton
          text={message}
          onPress={this._onPressInvestigator}
        />
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
    const deck = selectedDeckId && decks[selectedDeckId];
    const investigator = deck && investigators[deck.investigator_code];
    if (!pendingNextCard || !investigator) {
      return null;
    }

    return (
      <View style={styles.button}>
        <Button
          color="green"
          onPress={this._saveDrawnCard}
          text={L('Save to {{name}}’s Deck', { name: investigator.name })}
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

    return (
      <WeaknessDrawComponent
        componentId={componentId}
        customHeader={this.renderInvestigatorChooser()}
        customFlippedHeader={this.renderFlippedHeader()}
        weaknessSet={weaknessSet}
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
    latestDeckIds: getLatestDeckIds(campaign, state),
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

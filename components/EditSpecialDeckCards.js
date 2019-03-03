import React from 'react';
import PropTypes from 'prop-types';
import { forEach, keys, map, sortBy } from 'lodash';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import L from '../app/i18n';
import CardSelectorComponent from './CardSelectorComponent';
import withPlayerCards from './withPlayerCards';
import CardSearchResult from './CardSearchResult';
import { FACTION_DARK_GRADIENTS } from '../constants';
import { getCampaign } from '../reducers';
import { COLORS } from '../styles/colors';
import typography from '../styles/typography';

const RANDOM_BASIC_WEAKNESS = '01000';
const ACE_OF_RODS = '05040';

class EditSpecialDeckCards extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    deck: PropTypes.object.isRequired,
    previousDeck: PropTypes.object,
    xpAdjustment: PropTypes.number,
    campaignId: PropTypes.number,
    updateSlots: PropTypes.func.isRequired,
    updateIgnoreDeckLimitSlots: PropTypes.func.isRequired,
    slots: PropTypes.object.isRequired,
    ignoreDeckLimitSlots: PropTypes.object.isRequired,
    assignedWeaknesses: PropTypes.array,
    // From withPlayerCards
    cards: PropTypes.object.isRequired,
  };

  static get options() {
    return {
      topBar: {
        backButton: {
          title: L('Back'),
        },
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      slots: props.slots,
      ignoreDeckLimitSlots: props.ignoreDeckLimitSlots,
      unsavedAssignedWeaknesses: props.assignedWeaknesses || [],
    };

    this._updateSlots = this.updateSlots.bind(this);
    this._saveWeakness = this.saveWeakness.bind(this);
    this._showCampaignWeaknessDialog = this.showCampaignWeaknessDialog.bind(this);
    this._showWeaknessDialog = this.showWeaknessDialog.bind(this);
    this._drawWeakness = this.drawWeakness.bind(this);
    this._editStoryPressed = this.editStoryPressed.bind(this);
    this._onIgnoreDeckLimitSlotsChange = this.onIgnoreDeckLimitSlotsChange.bind(this);
    this._cardPressed = this.cardPressed.bind(this);
    this._isSpecial = this.isSpecial.bind(this);
    this._editCollection = this.editCollection.bind(this);
  }

  cardPressed(card) {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'Card',
        passProps: {
          id: card.code,
          pack_code: card.pack_code,
          showSpoilers: true,
          backButtonTitle: L('Back'),
        },
      },
    });
  }

  editStoryPressed() {
    const {
      componentId,
      deck,
      previousDeck,
      cards,
      xpAdjustment,
    } = this.props;
    const {
      slots,
      ignoreDeckLimitSlots,
    } = this.state;
    const investigator = cards[deck.investigator_code];
    Navigation.push(componentId, {
      component: {
        name: 'Deck.Edit',
        passProps: {
          deck,
          previousDeck,
          slots,
          ignoreDeckLimitSlots,
          updateSlots: this._updateSlots,
          xpAdjustment: xpAdjustment,
          storyOnly: true,
        },
        options: {
          statusBar: {
            style: 'light',
          },
          topBar: {
            title: {
              text: L('Edit Story Cards'),
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

  isSpecial(card) {
    const {
      ignoreDeckLimitSlots,
    } = this.state;
    return card.code === ACE_OF_RODS || ignoreDeckLimitSlots > 0;
  }

  updateSlots(newSlots) {
    this.setState({
      slots: newSlots,
    });
    this.props.updateSlots(newSlots);
  }

  saveWeakness(code, replaceRandomBasicWeakness) {
    const {
      updateSlots,
    } = this.props;
    const {
      slots,
      unsavedAssignedWeaknesses,
    } = this.state;
    const newSlots = Object.assign({}, slots);
    if (replaceRandomBasicWeakness && slots[RANDOM_BASIC_WEAKNESS] > 0) {
      newSlots[RANDOM_BASIC_WEAKNESS]--;
      if (!newSlots[RANDOM_BASIC_WEAKNESS]) {
        delete newSlots[RANDOM_BASIC_WEAKNESS];
      }
    }
    newSlots[code] = (newSlots[code] || 0) + 1;
    updateSlots(newSlots);

    this.setState({
      slots: newSlots,
      unsavedAssignedWeaknesses: [...unsavedAssignedWeaknesses, code],
    });
  }

  editCollection() {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'My.Collection',
      },
    });
  }

  drawWeakness() {
    Alert.alert(
      L('Draw Basic Weakness'),
      L('This deck does not seem to be part of a campaign yet.\n\nIf you add this deck to a campaign, the app can keep track of the available weaknesses between multiple decks.\n\nOtherwise, you can draw random weaknesses from your entire collection.'),
      [
        { text: L('Draw From Collection'), style: 'default', onPress: this._showWeaknessDialog },
        { text: L('Edit Collection'), onPress: this._editCollection },
        { text: L('Cancel'), style: 'cancel' },
      ]);
  }

  showWeaknessDialog() {
    const {
      componentId,
      cards,
      deck,
    } = this.props;
    const {
      slots,
    } = this.state;
    const investigator = cards[deck.investigator_code];
    Navigation.push(componentId, {
      component: {
        name: 'Weakness.Draw',
        passProps: {
          slots,
          saveWeakness: this._saveWeakness,
        },
        options: {
          statusBar: {
            style: 'light',
          },
          topBar: {
            title: {
              text: L('Draw Weaknesses'),
              color: COLORS.white,
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

  showCampaignWeaknessDialog() {
    const {
      componentId,
      campaignId,
      deck,
      cards,
    } = this.props;
    const {
      slots,
      unsavedAssignedWeaknesses,
    } = this.state;
    const investigator = cards[deck.investigator_code];
    Navigation.push(componentId, {
      component: {
        name: 'Dialog.CampaignDrawWeakness',
        passProps: {
          campaignId,
          deckSlots: slots,
          saveWeakness: this._saveWeakness,
          unsavedAssignedCards: unsavedAssignedWeaknesses,
        },
        options: {
          statusBar: {
            style: 'light',
          },
          topBar: {
            title: {
              text: L('Draw Weaknesses'),
              color: COLORS.white,
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

  onIgnoreDeckLimitSlotsChange(ignoreDeckLimitSlots) {
    this.props.updateIgnoreDeckLimitSlots(ignoreDeckLimitSlots);
    this.setState({
      ignoreDeckLimitSlots,
    });
  }

  renderDrawWeaknessButton() {
    const {
      campaignId,
    } = this.props;
    return (
      <Button
        title={L('Draw Basic Weakness')}
        onPress={campaignId ? this._showCampaignWeaknessDialog : this._drawWeakness}
      />
    );
  }

  renderBasicWeaknessSection() {
    const {
      cards,
    } = this.props;
    const {
      slots,
    } = this.state;
    const weaknesses = [];
    forEach(keys(slots), code => {
      if (cards[code] && cards[code].subtype_code === 'basicweakness') {
        weaknesses.push(cards[code]);
      }
    });

    return (
      <React.Fragment>
        <View style={styles.header}>
          <Text style={[typography.small, styles.headerText]}>
            { L('BASIC WEAKNESS') }
          </Text>
        </View>
        { map(sortBy(weaknesses, card => card.name), card => (
          <CardSearchResult
            key={card.code}
            card={card}
            count={slots[card.code]}
            onPress={this._cardPressed}
          />
        )) }
        { this.renderDrawWeaknessButton() }
      </React.Fragment>
    );
  }

  renderStorySection() {
    const {
      cards,
    } = this.props;
    const {
      slots,
    } = this.state;
    const storyCards = [];
    forEach(keys(slots), code => {
      if (cards[code] && cards[code].spoiler) {
        storyCards.push(cards[code]);
      }
    });

    return (
      <React.Fragment>
        <View style={styles.header}>
          <Text style={[typography.small, styles.headerText]}>
            { L('STORY') }
          </Text>
        </View>
        { map(sortBy(storyCards, card => card.name), card => (
          <CardSearchResult
            key={card.code}
            card={card}
            count={slots[card.code]}
            onPress={this._cardPressed}
          />
        )) }
        <Button
          title={L('Edit Story Cards')}
          onPress={this._editStoryPressed}
        />
      </React.Fragment>
    );
  }

  renderIgnoreCardsSection() {
    const {
      slots,
    } = this.props;

    const {
      ignoreDeckLimitSlots,
    } = this.state;

    const header = (
      <View style={styles.header}>
        <Text style={[typography.small, styles.headerText]}>
          { L('DO NOT COUNT TOWARDS DECK SIZE') }
        </Text>
      </View>
    );
    return (
      <CardSelectorComponent
        slots={slots}
        counts={ignoreDeckLimitSlots}
        updateCounts={this._onIgnoreDeckLimitSlotsChange}
        filterCard={this._isSpecial}
        header={header}
      />
    );
  }

  render() {
    return (
      <ScrollView style={styles.wrapper}>
        { this.renderIgnoreCardsSection() }
        { this.renderStorySection() }
        { this.renderBasicWeaknessSection() }
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    campaign: props.campaignId && getCampaign(state, props.campaignId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default withPlayerCards(
  connect(mapStateToProps, mapDispatchToProps)(EditSpecialDeckCards)
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  header: {
    marginTop: 32,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  headerText: {
    paddingLeft: 8,
  },
});

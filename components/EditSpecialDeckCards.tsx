import React from 'react';
import { forEach, keys, map, sortBy } from 'lodash';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';

import { t } from 'ttag';
import { Campaign, Deck, Slots } from '../actions/types';
import Card from '../data/Card';
import { CardDetailProps } from './CardDetailView';
import { EditDeckProps } from './DeckEditView';
import { CampaignDrawWeaknessProps } from './campaign/CampaignDrawWeaknessDialog';
import CardSelectorComponent from './CardSelectorComponent';
import { DrawWeaknessProps } from './weakness/WeaknessDrawDialog';
import withPlayerCards, { PlayerCardProps } from './withPlayerCards';
import { NavigationProps } from './types';
import CardSearchResult from './CardSearchResult';
import { FACTION_DARK_GRADIENTS, RANDOM_BASIC_WEAKNESS } from '../constants';
import { getCampaign, AppState } from '../reducers';
import { COLORS } from '../styles/colors';
import typography from '../styles/typography';

const ACE_OF_RODS = '05040';

export interface EditSpecialCardsProps {
  deck: Deck;
  previousDeck?: Deck;
  xpAdjustment?: number;
  campaignId?: number;
  updateSlots: (slots: Slots) => void;
  updateIgnoreDeckLimitSlots: (slots: Slots) => void;
  slots: Slots;
  ignoreDeckLimitSlots: Slots;
  assignedWeaknesses?: string[];
}

interface ReduxProps {
  campaign?: Campaign;
}

type Props = NavigationProps & EditSpecialCardsProps & ReduxProps & PlayerCardProps;

interface State {
  slots: Slots;
  ignoreDeckLimitSlots: Slots;
  unsavedAssignedWeaknesses: string[];
}

class EditSpecialDeckCards extends React.Component<Props, State> {
  static get options() {
    return {
      topBar: {
        backButton: {
          title: t`Back`,
        },
      },
    };
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      slots: props.slots,
      ignoreDeckLimitSlots: props.ignoreDeckLimitSlots,
      unsavedAssignedWeaknesses: props.assignedWeaknesses || [],
    };
  }

  _cardPressed = (card: Card) => {
    Navigation.push<CardDetailProps>(this.props.componentId, {
      component: {
        name: 'Card',
        passProps: {
          id: card.code,
          pack_code: card.pack_code,
          showSpoilers: true,
        },
      },
    });
  };

  _editStoryPressed = () => {
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
    Navigation.push<EditDeckProps>(componentId, {
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
              text: t`Edit Story Cards`,
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

  _isSpecial = (card: Card) => {
    const {
      ignoreDeckLimitSlots,
    } = this.state;
    return card.code === ACE_OF_RODS || ignoreDeckLimitSlots[card.code] > 0;
  };

  _updateSlots = (newSlots: Slots) => {
    this.setState({
      slots: newSlots,
    });
    this.props.updateSlots(newSlots);
  };

  _saveWeakness = (code: string, replaceRandomBasicWeakness: boolean) => {
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
  };

  _editCollection = () => {
    Navigation.push<{}>(this.props.componentId, {
      component: {
        name: 'My.Collection',
      },
    });
  };

  _drawWeakness = () => {
    Alert.alert(
      t`Draw Basic Weakness`,
      t`This deck does not seem to be part of a campaign yet.\n\nIf you add this deck to a campaign, the app can keep track of the available weaknesses between multiple decks.\n\nOtherwise, you can draw random weaknesses from your entire collection.`,
      [
        { text: t`Draw From Collection`, style: 'default', onPress: this._showWeaknessDialog },
        { text: t`Edit Collection`, onPress: this._editCollection },
        { text: t`Cancel`, style: 'cancel' },
      ]);
  };

  _showWeaknessDialog = () => {
    const {
      componentId,
      cards,
      deck,
    } = this.props;
    const {
      slots,
    } = this.state;
    const investigator = cards[deck.investigator_code];
    Navigation.push<DrawWeaknessProps>(componentId, {
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
              text: t`Draw Weaknesses`,
              color: COLORS.white,
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

  _showCampaignWeaknessDialog = () => {
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
    if (!campaignId) {
      return;
    }
    const investigator = cards[deck.investigator_code];
    Navigation.push<CampaignDrawWeaknessProps>(componentId, {
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
              text: t`Draw Weaknesses`,
              color: COLORS.white,
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

  _onIgnoreDeckLimitSlotsChange = (ignoreDeckLimitSlots: Slots) => {
    this.props.updateIgnoreDeckLimitSlots(ignoreDeckLimitSlots);
    this.setState({
      ignoreDeckLimitSlots,
    });
  };

  renderDrawWeaknessButton() {
    const {
      campaignId,
    } = this.props;
    return (
      <Button
        title={t`Draw Basic Weakness`}
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
    const weaknesses: Card[] = [];
    forEach(keys(slots), code => {
      if (cards[code] && cards[code].subtype_code === 'basicweakness') {
        weaknesses.push(cards[code]);
      }
    });

    return (
      <React.Fragment>
        <View style={styles.header}>
          <Text style={[typography.small, styles.headerText]}>
            { t`BASIC WEAKNESS` }
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
    const storyCards: Card[] = [];
    forEach(keys(slots), code => {
      if (cards[code] && cards[code].spoiler) {
        storyCards.push(cards[code]);
      }
    });

    return (
      <React.Fragment>
        <View style={styles.header}>
          <Text style={[typography.small, styles.headerText]}>
            { t`STORY` }
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
          title={t`Edit Story Cards`}
          onPress={this._editStoryPressed}
        />
      </React.Fragment>
    );
  }

  renderIgnoreCardsSection() {
    const {
      componentId,
      slots,
    } = this.props;

    const {
      ignoreDeckLimitSlots,
    } = this.state;

    const header = (
      <View style={styles.header}>
        <Text style={[typography.small, styles.headerText]}>
          { t`DO NOT COUNT TOWARDS DECK SIZE` }
        </Text>
      </View>
    );
    return (
      <CardSelectorComponent
        componentId={componentId}
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

function mapStateToProps(
  state: AppState,
  props: NavigationProps & EditSpecialCardsProps
): ReduxProps {
  return {
    campaign: (props.campaignId && getCampaign(state, props.campaignId)) || undefined,
  };
}

export default withPlayerCards(
  connect(mapStateToProps)(EditSpecialDeckCards)
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

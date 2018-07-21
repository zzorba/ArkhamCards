import React from 'react';
import PropTypes from 'prop-types';
import { find, keys } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import { exileString } from './exile';
import listOfDecks from '../listOfDecks';
import deckRowWithDetails from '../deckRowWithDetails';
import EditTraumaComponent from '../EditTraumaComponent';
import XpComponent from '../XpComponent';
import LabeledTextBox from '../../core/LabeledTextBox';

class DeckScenarioUpgradeDetails extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    investigator: PropTypes.object.isRequired,
    deck: PropTypes.object,
    cards: PropTypes.object,

    deckUpdates: PropTypes.object,
    deckUpdatesChanged: PropTypes.func,
    investigatorData: PropTypes.object,
    showTraumaDialog: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._updateExiles = this.doUpdate.bind(this, 'exiles');
    this._updateXp = this.doUpdate.bind(this, 'xp');
    this._updateTrauma = this.doUpdate.bind(this, 'trauma');
    this._showExileDialog = this.showExileDialog.bind(this);
  }

  updates() {
    const {
      id,
      deckUpdates,
    } = this.props;
    return deckUpdates[id] || {};
  }

  showExileDialog() {
    const {
      navigator,
      id,
    } = this.props;
    navigator.push({
      screen: 'Dialog.ExileCards',
      passProps: {
        id,
        updateExiles: this._updateExiles,
        exiles: this.updates().exiles || {},
      },
    });
  }

  doUpdate(key, value) {
    const {
      id,
      deckUpdatesChanged,
    } = this.props;
    deckUpdatesChanged(id, Object.assign({}, this.updates(), { [key]: value }));
  }

  renderXp() {
    if (!this.props.deckUpdatesChanged) {
      return null;
    }
    return (
      <XpComponent
        xp={this.updates().xp || 0}
        onChange={this._updateXp}
        isInvestigator
      />
    );
  }

  exileText() {
    const {
      cards,
    } = this.props;
    const {
      exiles,
    } = this.updates();
    return exileString(exiles, cards);
  }

  hasExile() {
    const {
      deck,
      cards,
    } = this.props;
    return !!find(keys(deck.slots), code => cards[code].exile);
  }

  renderExile() {
    if (!this.props.deckUpdatesChanged || !this.hasExile()) {
      return null;
    }
    return (
      <View style={styles.marginRight}>
        <LabeledTextBox
          label="Exiled Cards"
          onPress={this._showExileDialog}
          value={this.exileText()}
          column
        />
      </View>
    );
  }

  renderTrauma() {
    const {
      investigator,
      investigatorData,
      showTraumaDialog,
    } = this.props;
    return (
      <View style={styles.marginRight}>
        <EditTraumaComponent
          investigator={investigator}
          investigatorData={investigatorData}
          showTraumaDialog={showTraumaDialog}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.flex}>
        { this.renderXp() }
        { this.renderTrauma() }
        { this.renderExile() }
      </View>
    );
  }
}

export default listOfDecks(
  deckRowWithDetails(DeckScenarioUpgradeDetails, {
    compact: false,
    viewDeckButton: true,
  }),
  {
    deckLimit: 4,
  },
);

const styles = StyleSheet.create({
  flex: {
    flexDirection: 'column',
  },
  marginRight: {
    marginRight: 8,
  },
});

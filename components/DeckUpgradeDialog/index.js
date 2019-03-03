import React from 'react';
import PropTypes from 'prop-types';
import { forEach, head, keys, range, throttle } from 'lodash';
import {
  ActivityIndicator,
  View,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { Navigation } from 'react-native-navigation';

import L from '../../app/i18n';
import { handleAuthErrors } from '../authHelper';
import { showDeckModal, showCard } from '../navHelper';
import ExileCardSelectorComponent from '../ExileCardSelectorComponent';
import { updateCampaign } from '../campaign/actions';
import withTraumaDialog from '../campaign/withTraumaDialog';
import EditTraumaComponent from '../campaign/EditTraumaComponent';
import { upgradeLocalDeck } from '../decks/localHelper';
import { upgradeDeck } from '../../lib/authApi';
import * as Actions from '../../actions';
import PlusMinusButtons from '../core/PlusMinusButtons';
import { getDeck, getCampaign, getNextLocalDeckId } from '../../reducers';
import typography from '../../styles/typography';

class DeckUpgradeDialog extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    showNewDeck: PropTypes.bool,
    // Optional campaignId
    campaignId: PropTypes.number,
    // From redux, maybe
    login: PropTypes.func.isRequired,
    updateCampaign: PropTypes.func.isRequired,
    deck: PropTypes.object,
    campaign: PropTypes.object,
    setNewDeck: PropTypes.func.isRequired,
    updateDeck: PropTypes.func.isRequired,
    investigator: PropTypes.object,
    showTraumaDialog: PropTypes.func.isRequired,
    investigatorDataUpdates: PropTypes.object.isRequired,
    nextLocalDeckId: PropTypes.number.isRequired,
  };

  static get options() {
    return {
      topBar: {
        tintColor: 'white',
        rightButtons: [{
          text: L('Save'),
          color: 'white',
          id: 'save',
          showAsAction: 'ifRoom',
        }],
        backButton: {
          title: L('Cancel'),
          color: 'white',
        },
      },
    };
  }

  constructor(props) {
    super(props);

    const latestScenario = props.campaign && head(props.campaign.scenarioResults || []);
    const xp = latestScenario ? latestScenario.xp : 0;
    this.state = {
      xp,
      exileCounts: {},
      saving: false,
    };

    this._handleDeckResult = this.handleDeckResult.bind(this);
    this._incXp = this.incXp.bind(this);
    this._decXp = this.decXp.bind(this);
    this._onExileCountsChange = this.onExileCountsChange.bind(this);
    this._saveUpgrade = throttle(this.saveUpgrade.bind(this), 200);

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'save') {
      this._saveUpgrade();
    }
  }

  handleDeckResult({ deck, upgradedDeck }) {
    const {
      showNewDeck,
      componentId,
      investigator,
      setNewDeck,
      updateDeck,
    } = this.props;
    updateDeck(deck.id, deck, false);
    setNewDeck(upgradedDeck.id, upgradedDeck);
    if (showNewDeck) {
      showDeckModal(componentId, upgradedDeck, investigator);
    } else {
      Navigation.pop(componentId);
    }
  }

  saveUpgrade(isRetry) {
    const {
      deck: {
        id,
        local,
      },
      campaign,
      updateCampaign,
      login,
      nextLocalDeckId,
    } = this.props;
    if (!this.state.saving || isRetry) {
      this.setState({
        saving: true,
      });
      if (campaign) {
        updateCampaign(campaign.id, {
          investigatorData: this.investigatorData(),
        });
      }
      const {
        xp,
        exileCounts,
      } = this.state;
      const exileParts = [];
      forEach(keys(exileCounts), code => {
        const count = exileCounts[code];
        if (count > 0) {
          forEach(range(0, count), () => exileParts.push(code));
        }
      });
      if (local) {
        this.handleDeckResult(
          upgradeLocalDeck(nextLocalDeckId, this.props.deck, xp, exileParts)
        );
        this.setState({
          saving: false,
        });
      } else {
        const exiles = exileParts.join(',');
        const upgradeDeckPromise = upgradeDeck(id, xp, exiles);
        handleAuthErrors(
          upgradeDeckPromise,
          this._handleDeckResult,
          () => {
            this.setState({
              saving: false,
            });
          },
          // retry
          () => this.saveUpgrade(true),
          login
        );
      }
    }
  }

  onCardPress(card) {
    showCard(this.props.componentId, card.code, card);
  }

  onExileCountsChange(exileCounts) {
    this.setState({
      exileCounts,
    });
  }

  incXp() {
    this.setState(state => {
      return { xp: (state.xp || 0) + 1 };
    });
  }

  decXp() {
    this.setState(state => {
      return { xp: Math.max((state.xp || 0) - 1, 0) };
    });
  }

  investigatorData() {
    const {
      campaign,
      investigatorDataUpdates,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return Object.assign(
      {},
      campaign.investigatorData || {},
      investigatorDataUpdates
    );
  }

  renderCampaignSection() {
    const {
      campaign,
      investigator,
      showTraumaDialog,
    } = this.props;
    if (!campaign || !investigator) {
      return null;
    }
    return (
      <View style={styles.labeledRow}>
        <EditTraumaComponent
          investigator={investigator}
          investigatorData={this.investigatorData()}
          showTraumaDialog={showTraumaDialog}
        />
      </View>
    );
  }

  render() {
    const {
      deck,
    } = this.props;
    const {
      xp,
      exileCounts,
      saving,
    } = this.state;
    if (!deck) {
      return null;
    }
    if (saving) {
      return (
        <View style={[styles.container, styles.saving]}>
          <Text style={typography.text}>
            Saving...
          </Text>
          <ActivityIndicator
            style={styles.savingSpinner}
            size="large"
            animating
          />
        </View>
      );
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.labeledRow}>
          <Text style={typography.small}>
            EXPERIENCE
          </Text>
          <View style={styles.row}>
            <Text style={typography.text}>
              { xp }
            </Text>
            <PlusMinusButtons
              count={xp}
              onIncrement={this._incXp}
              onDecrement={this._decXp}
            />
          </View>
        </View>
        { this.renderCampaignSection() }
        <ExileCardSelectorComponent
          id={deck.id}
          showLabel
          exileCounts={exileCounts}
          updateExileCounts={this._onExileCountsChange}
        />
      </ScrollView>
    );
  }
}


function mapStateToProps(state, props) {
  return {
    deck: getDeck(state, props.id),
    campaign: props.campaignId && getCampaign(state, props.campaignId),
    nextLocalDeckId: getNextLocalDeckId(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, Actions, { updateCampaign }),
    dispatch
  );
}

export default withTraumaDialog(
  connect(mapStateToProps, mapDispatchToProps)(
    connectRealm(DeckUpgradeDialog, {
      schemas: ['Card'],
      mapToProps(results, realm, props) {
        if (props.deck) {
          return {
            investigator: head(results.cards.filtered(`code == '${props.deck.investigator_code}'`)),
          };
        }
        return {};
      },
    })
  )
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  saving: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingSpinner: {
    marginTop: 16,
  },
  labeledRow: {
    flexDirection: 'column',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

import React from 'react';
import { forEach, find, head, keys, last, range, throttle } from 'lodash';
import {
  ActivityIndicator,
  View,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { connectRealm, CardResults } from 'react-native-realm';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import { Campaign, Deck, Slots } from '../../actions/types';
import { handleAuthErrors } from '../authHelper';
import { NavigationProps } from '../types';
import { showDeckModal, showCard } from '../navHelper';
import ExileCardSelectorComponent from '../ExileCardSelectorComponent';
import StoryCardSelectorComponent from '../StoryCardSelectorComponent';
import { updateCampaign } from '../campaign/actions';
import withTraumaDialog, { TraumaProps } from '../campaign/withTraumaDialog';
import EditTraumaComponent from '../campaign/EditTraumaComponent';
import { upgradeLocalDeck, updateLocalDeck } from '../decks/localHelper';
import Card from '../../data/Card';
import { saveDeck, upgradeDeck, UpgradeDeckResult } from '../../lib/authApi';
import { login, setNewDeck, updateDeck } from '../../actions';
import PlusMinusButtons from '../core/PlusMinusButtons';
import { getDeck, getCampaign, getNextLocalDeckId, getTabooSet, AppState } from '../../reducers';
import typography from '../../styles/typography';

export interface UpgradeDeckProps {
  id: number;
  campaignId?: number;
  showNewDeck: boolean;
}

interface ReduxProps {
  deck?: Deck;
  campaign?: Campaign;
  nextLocalDeckId: number;
  tabooSetId?: number;
}

interface ReduxActionProps {
  login: () => void;
  setNewDeck: (id: number, deck: Deck) => void;
  updateDeck: (id: number, deck: Deck, isWrite: boolean) => void;
  updateCampaign: (id: number, sparseCampaign: Campaign) => void;
}

interface RealmProps {
  investigator?: Card;
}

type Props = NavigationProps & UpgradeDeckProps & ReduxProps & ReduxActionProps & RealmProps & TraumaProps;

interface State {
  xp: number;
  exileCounts: Slots;
  storyEncounterCodes: string[];
  storyCounts: Slots;
  scenarioName?: string;
  saving: boolean;
}

class DeckUpgradeDialog extends React.Component<Props, State> {
  static get options() {
    return {
      topBar: {
        tintColor: 'white',
        rightButtons: [{
          text: t`Save`,
          color: 'white',
          id: 'save',
          showAsAction: 'ifRoom',
          testID: t`Save`,
        }],
        backButton: {
          title: t`Cancel`,
          color: 'white',
          testID: t`Cancel`,
        },
      },
    };
  }

  _navEventListener?: EventSubscription;
  _saveUpgrade!: (isRetry?: boolean) => void;
  constructor(props: Props) {
    super(props);

    const latestScenario = props.campaign && last(props.campaign.scenarioResults || []);
    const xp = latestScenario ? (latestScenario.xp || 0) : 0;
    const storyEncounterCodes = latestScenario && latestScenario.scenarioCode ?
      [latestScenario.scenarioCode] :
      [];
    this.state = {
      xp,
      exileCounts: {},
      saving: false,
      scenarioName: latestScenario ? latestScenario.scenario : undefined,
      storyEncounterCodes,
      storyCounts: {},
    };

    this._saveUpgrade = throttle(this.saveUpgrade.bind(this), 200);
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'save') {
      this._saveUpgrade();
    }
  }

  _deckUpgradeComplete = (deck: Deck) => {
    const {
      showNewDeck,
      componentId,
      investigator,
    } = this.props;
    if (showNewDeck) {
      showDeckModal(componentId, deck, investigator);
    } else {
      Navigation.pop(componentId);
    }
  }

  _handleUpgradeDeckResult = ({
    deck,
    upgradedDeck,
  }: UpgradeDeckResult) => {
    const {
      setNewDeck,
      updateDeck,
    } = this.props;
    updateDeck(deck.id, deck, false);
    setNewDeck(upgradedDeck.id, upgradedDeck);

    const {
      storyCounts,
    } = this.state;
    const hasStoryChange = !!find(keys(storyCounts), code =>
      upgradedDeck.slots[code] !== storyCounts[code]
    );
    if (hasStoryChange) {
      const newSlots: Slots = { ...upgradedDeck.slots };
      forEach(keys(storyCounts), code => {
        if (storyCounts[code] > 0) {
          newSlots[code] = storyCounts[code];
        } else {
          delete newSlots[code];
        }
      });
      if (upgradedDeck.local) {
        const updatedDeck = updateLocalDeck(
          upgradedDeck,
          upgradedDeck.name,
          newSlots,
          upgradedDeck.ignoreDeckLimitSlots || {},
          upgradedDeck.problem || '',
          upgradedDeck.spentXp,
          upgradedDeck.xp_adjustment,
          upgradedDeck.taboo_id
        );
        updateDeck(updatedDeck.id, updatedDeck, false);
        this._deckUpgradeComplete(updatedDeck);
      } else {
        saveDeck(
          upgradedDeck.id,
          upgradedDeck.name,
          newSlots,
          upgradedDeck.ignoreDeckLimitSlots || {},
          upgradedDeck.problem || '',
          upgradedDeck.spentXp || 0,
          upgradedDeck.xp_adjustment || 0,
          upgradedDeck.taboo_id
        ).then(deck => {
          updateDeck(deck.id, deck, false);
          this._deckUpgradeComplete(deck);
        });
      }
    } else {
      this._deckUpgradeComplete(upgradedDeck);
    }

  };

  saveUpgrade(isRetry?: boolean) {
    const {
      deck,
      campaign,
      updateCampaign,
      login,
      nextLocalDeckId,
    } = this.props;
    if (!deck) {
      return;
    }
    const {
      id,
      local,
    } = deck;
    if (!this.state.saving || isRetry) {
      this.setState({
        saving: true,
      });
      if (campaign) {
        const investigatorData = this.investigatorData();
        if (investigatorData) {
          updateCampaign(
            campaign.id,
            { investigatorData } as any as Campaign
          );
        }
      }
      const {
        xp,
        exileCounts,
      } = this.state;
      const exileParts: string[] = [];
      forEach(exileCounts, (count, code) => {
        if (count > 0) {
          forEach(range(0, count), () => exileParts.push(code));
        }
      });
      if (local) {
        this._handleUpgradeDeckResult(
          upgradeLocalDeck(nextLocalDeckId, deck, xp, exileParts)
        );
        this.setState({
          saving: false,
        });
      } else {
        const exiles = exileParts.join(',');
        const upgradeDeckPromise = upgradeDeck(id, xp, exiles);
        handleAuthErrors(
          upgradeDeckPromise,
          this._handleUpgradeDeckResult,
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

  _onCardPress = (card: Card) => {
    showCard(this.props.componentId, card.code, card);
  };

  _onExileCountsChange = (exileCounts: Slots) => {
    this.setState({
      exileCounts,
    });
  };

  _onStoryCountsChange = (storyCounts: Slots) => {
    this.setState({
      storyCounts,
    });
  };

  _incXp = () => {
    this.setState(state => {
      return { xp: (state.xp || 0) + 1 };
    });
  };

  _decXp = () => {
    this.setState(state => {
      return { xp: Math.max((state.xp || 0) - 1, 0) };
    });
  };

  investigatorData() {
    const {
      campaign,
      investigatorDataUpdates,
    } = this.props;
    if (!campaign) {
      return undefined;
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
      componentId,
    } = this.props;
    const {
      xp,
      exileCounts,
      saving,
      storyEncounterCodes,
      scenarioName,
    } = this.state;
    if (!deck) {
      return null;
    }
    if (saving) {
      return (
        <View style={[styles.container, styles.saving]}>
          <Text style={typography.text}>
            { t`Saving...` }
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
          <Text style={[typography.small, styles.header]}>
            { t`Earned experience` }
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
        <ExileCardSelectorComponent
          componentId={componentId}
          id={deck.id}
          showLabel
          exileCounts={exileCounts}
          updateExileCounts={this._onExileCountsChange}
        />
        { this.renderCampaignSection() }
        <StoryCardSelectorComponent
          componentId={componentId}
          deckId={deck.id}
          updateStoryCounts={this._onStoryCountsChange}
          encounterCodes={storyEncounterCodes}
          scenarioName={scenarioName}
        />
      </ScrollView>
    );
  }
}


function mapStateToProps(state: AppState, props: UpgradeDeckProps): ReduxProps {
  return {
    deck: getDeck(state, props.id) || undefined,
    campaign: (props.campaignId && getCampaign(state, props.campaignId)) || undefined,
    nextLocalDeckId: getNextLocalDeckId(state),
    tabooSetId: getTabooSet(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    login,
    setNewDeck,
    updateDeck,
    updateCampaign,
  }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, NavigationProps & UpgradeDeckProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(
  connectRealm<NavigationProps & UpgradeDeckProps & ReduxProps & ReduxActionProps, RealmProps, Card>(
    withTraumaDialog<NavigationProps & UpgradeDeckProps & ReduxProps & ReduxActionProps & RealmProps>(DeckUpgradeDialog), {
      schemas: ['Card'],
      mapToProps(
        results: CardResults<Card>,
        realm: Realm,
        props: NavigationProps & UpgradeDeckProps & ReduxProps & ReduxActionProps
      ): RealmProps {
        if (props.deck) {
          return {
            investigator: head(results.cards.filtered(`(code == '${props.deck.investigator_code}') and ${Card.tabooSetQuery(props.tabooSetId)}`)),
          };
        }
        return {};
      },
    })
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
  header: {
    textTransform: 'uppercase',
  },
});

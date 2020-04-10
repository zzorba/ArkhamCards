import React from 'react';
import { head, last } from 'lodash';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { connectRealm, CardResults } from 'react-native-realm';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import DeckUpgradeComponent from './DeckUpgradeComponent';
import { Campaign, Deck, Slots } from 'actions/types';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { NavigationProps } from 'components/nav/types';
import { showDeckModal, showCard } from 'components/nav/helper';
import StoryCardSelectorComponent from 'components/campaign/StoryCardSelectorComponent';
import { updateCampaign } from 'components/campaign/actions';
import withTraumaDialog, { TraumaProps } from 'components/campaign/withTraumaDialog';
import EditTraumaComponent from 'components/campaign/EditTraumaComponent';
import Card from 'data/Card';
import { saveDeckUpgrade, saveDeckChanges, DeckChanges } from 'components/deck/actions';
import { getDeck, getCampaign, getTabooSet, AppState } from 'reducers';
import typography from 'styles/typography';

export interface UpgradeDeckProps {
  id: number;
  campaignId?: number;
  showNewDeck: boolean;
}

interface ReduxProps {
  deck?: Deck;
  campaign?: Campaign;
  tabooSetId?: number;
}

interface ReduxActionProps {
  saveDeckChanges: (deck: Deck, changes: DeckChanges) => Promise<Deck>;
  saveDeckUpgrade: (deck: Deck, xp: number, exileCounts: Slots) => Promise<Deck>;
  updateCampaign: (id: number, sparseCampaign: Partial<Campaign>) => void;
}

interface RealmProps {
  investigator?: Card;
}

type Props = NavigationProps & UpgradeDeckProps & ReduxProps & ReduxActionProps & RealmProps & TraumaProps & DimensionsProps;

interface State {
  storyEncounterCodes: string[];
  storyCounts: Slots;
  scenarioName?: string;
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

  deckUpgradeComponent: React.RefObject<DeckUpgradeComponent> = React.createRef<DeckUpgradeComponent>();

  _navEventListener?: EventSubscription;
  constructor(props: Props) {
    super(props);

    const latestScenario = props.campaign && last(props.campaign.scenarioResults || []);
    const storyEncounterCodes = latestScenario && latestScenario.scenarioCode ?
      [latestScenario.scenarioCode] :
      [];

    this.state = {
      scenarioName: latestScenario ? latestScenario.scenario : undefined,
      storyEncounterCodes,
      storyCounts: {},
    };

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'save') {
      if (this.deckUpgradeComponent.current) {
        this.deckUpgradeComponent.current.save();
      }
    }
  }

  _deckUpgradeComplete = (deck: Deck) => {
    const {
      showNewDeck,
      componentId,
      investigator,
      campaign,
      updateCampaign,
    } = this.props;
    if (campaign) {
      const investigatorData = this.investigatorData();
      if (investigatorData) {
        updateCampaign(
          campaign.id,
          { investigatorData }
        );
      }
    }
    if (showNewDeck) {
      showDeckModal(componentId, deck, investigator);
    } else {
      Navigation.pop(componentId);
    }
  }

  _onCardPress = (card: Card) => {
    showCard(this.props.componentId, card.code, card);
  };

  _onStoryCountsChange = (storyCounts: Slots) => {
    this.setState({
      storyCounts,
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

  renderCampaignSection(deck: Deck) {
    const {
      componentId,
      campaign,
      investigator,
      showTraumaDialog,
      fontScale,
    } = this.props;
    const {
      storyEncounterCodes,
      scenarioName,
    } = this.state;
    if (!campaign || !investigator) {
      return null;
    }
    return (
      <>
        { !campaign.guided && (
          <EditTraumaComponent
            investigator={investigator}
            investigatorData={this.investigatorData()}
            showTraumaDialog={showTraumaDialog}
            fontScale={fontScale}
            sectionHeader
          />
        ) }
        <StoryCardSelectorComponent
          componentId={componentId}
          investigator={investigator}
          fontScale={fontScale}
          deckId={deck.id}
          updateStoryCounts={this._onStoryCountsChange}
          encounterCodes={storyEncounterCodes}
          scenarioName={scenarioName}
        />
      </>
    );
  }

  render() {
    const {
      deck,
      componentId,
      investigator,
      campaign,
      saveDeckChanges,
      saveDeckUpgrade,
      fontScale,
    } = this.props;
    const {
      storyCounts,
    } = this.state;

    if (!deck || !investigator) {
      return null;
    }
    const latestScenario = campaign && last(campaign.scenarioResults || []);
    const xp = latestScenario ? (latestScenario.xp || 0) : 0;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.headerText}>
          <Text style={typography.text}>
            { t`Upgrading your deck allows changes and experience to be tracked over the course of a campaign.` }
          </Text>
        </View>
        <DeckUpgradeComponent
          ref={this.deckUpgradeComponent}
          saveDeckChanges={saveDeckChanges}
          saveDeckUpgrade={saveDeckUpgrade}
          componentId={componentId}
          deck={deck}
          investigator={investigator}
          startingXp={xp}
          fontScale={fontScale}
          storyCounts={storyCounts}
          ignoreStoryCounts={{}}
          upgradeCompleted={this._deckUpgradeComplete}
          campaignSection={this.renderCampaignSection(deck)}
        />
      </ScrollView>
    );
  }
}


function mapStateToProps(state: AppState, props: UpgradeDeckProps): ReduxProps {
  return {
    deck: getDeck(state, props.id) || undefined,
    campaign: (props.campaignId && getCampaign(state, props.campaignId)) || undefined,
    tabooSetId: getTabooSet(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    saveDeckChanges,
    saveDeckUpgrade,
    updateCampaign,
  } as any, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, NavigationProps & UpgradeDeckProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(
  connectRealm<NavigationProps & UpgradeDeckProps & ReduxProps & ReduxActionProps, RealmProps, Card>(
    withTraumaDialog<NavigationProps & UpgradeDeckProps & ReduxProps & ReduxActionProps & RealmProps>(
      withDimensions(DeckUpgradeDialog)
    ), {
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
  headerText: {
    padding: 16,
  },
});

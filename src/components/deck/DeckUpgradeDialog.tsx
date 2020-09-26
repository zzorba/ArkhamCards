import React from 'react';
import { last } from 'lodash';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import DeckUpgradeComponent from './DeckUpgradeComponent';
import { Campaign, Deck, Slots } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import { showDeckModal, showCard } from '@components/nav/helper';
import StoryCardSelectorComponent from '@components/campaign/StoryCardSelectorComponent';
import { updateCampaign } from '@components/campaign/actions';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import withTraumaDialog, { TraumaProps } from '@components/campaign/withTraumaDialog';
import EditTraumaComponent from '@components/campaign/EditTraumaComponent';
import Card from '@data/Card';
import { saveDeckUpgrade, saveDeckChanges, DeckChanges } from '@components/deck/actions';
import { getDeck, getCampaign, getTabooSet, AppState } from '@reducers';
import space from '@styles/space';
import BasicButton from '@components/core/BasicButton';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

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

type Props = NavigationProps & UpgradeDeckProps & ReduxProps & ReduxActionProps & PlayerCardProps & TraumaProps;

interface State {
  storyEncounterCodes: string[];
  storyCounts: Slots;
  scenarioName?: string;
}

class DeckUpgradeDialog extends React.Component<Props, State> {
  static contextType = StyleContext;
  context!: StyleContextType;

  static options() {
    return {
      topBar: {
        tintColor: 'white',
        rightButtons: [{
          text: t`Save`,
          color: 'white',
          id: 'save',
          accessibilityLabel: t`Save`,
        }],
        backButton: {
          title: t`Cancel`,
          color: 'white',
          accessibilityLabel: t`Cancel`,
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

  _save = () => {
    if (this.deckUpgradeComponent.current) {
      this.deckUpgradeComponent.current.save();
    }
  };

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'save') {
      this._save();
    }
  }

  investigator(): Card | undefined {
    const {
      deck,
      investigators,
    } = this.props;
    if (!deck) {
      return undefined;
    }
    return investigators[deck.investigator_code];
  }

  _deckUpgradeComplete = (deck: Deck) => {
    const {
      showNewDeck,
      componentId,
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
      showDeckModal(componentId, deck, this.investigator());
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
      showTraumaDialog,
    } = this.props;
    const {
      storyEncounterCodes,
      scenarioName,
    } = this.state;
    const investigator = this.investigator();
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
            sectionHeader
          />
        ) }
        <StoryCardSelectorComponent
          componentId={componentId}
          investigator={investigator}
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
      campaign,
      saveDeckChanges,
      saveDeckUpgrade,
    } = this.props;
    const {
      storyCounts,
    } = this.state;
    const { backgroundStyle, typography } = this.context;
    const investigator = this.investigator();
    if (!deck || !investigator) {
      return null;
    }
    const latestScenario = campaign && last(campaign.scenarioResults || []);
    const xp = latestScenario ? (latestScenario.xp || 0) : 0;

    return (
      <ScrollView style={[styles.container, backgroundStyle]}>
        <View style={space.paddingM}>
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
          storyCounts={storyCounts}
          ignoreStoryCounts={{}}
          upgradeCompleted={this._deckUpgradeComplete}
          campaignSection={this.renderCampaignSection(deck)}
        />
        <BasicButton onPress={this._save} title={t`Save`} />
      </ScrollView>
    );
  }
}


function mapStateToProps(state: AppState, props: UpgradeDeckProps): ReduxProps {
  return {
    deck: getDeck(props.id)(state) || undefined,
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
  withPlayerCards<NavigationProps & UpgradeDeckProps & ReduxProps & ReduxActionProps>(
    withTraumaDialog<NavigationProps & UpgradeDeckProps & ReduxProps & ReduxActionProps & PlayerCardProps>(
      DeckUpgradeDialog
    )
  )
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});

import React from 'react';
import { flatMap } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from 'components/core/BasicButton';
import { Campaign, Deck, DecksMap, SingleCampaign, ScenarioResult } from 'actions/types';
import { NavigationProps } from 'components/nav/types';
import Card from 'data/Card';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { getAllDecks, getLatestCampaignInvestigators, getLatestCampaignDeckIds, getCampaign, AppState } from 'reducers';
import withPlayerCards, { PlayerCardProps } from 'components/core/withPlayerCards';
import typography from 'styles/typography';
import { iconsMap } from 'app/NavIcons';
import COLORS from 'styles/colors';
import { updateCampaign } from 'components/campaign/actions';
import UpgradeDecksList from './UpgradeDecksList';
import { UpgradeDeckProps } from 'components/deck/DeckUpgradeDialog';
import space, { s } from 'styles/space';

export interface UpgradeDecksProps {
  id: number;
  scenarioResult: ScenarioResult;
}

interface ReduxProps {
  campaign?: SingleCampaign;
  decks: DecksMap;
  allInvestigators: Card[];
  latestDeckIds: number[];
}

interface ReduxActionProps {
  updateCampaign: (id: number, sparseCampaign: Partial<Campaign>) => void;
}

type Props = NavigationProps & UpgradeDecksProps & PlayerCardProps & ReduxProps & ReduxActionProps & DimensionsProps;

class UpgradeDecksView extends React.Component<Props> {
  static options(passProps: UpgradeDecksProps) {
    return {
      topBar: {
        title: {
          text: passProps.scenarioResult.scenario,
        },
        subtitle: {
          text: t`Update investigator decks`,
        },
        leftButtons: [{
          icon: iconsMap.close,
          id: 'close',
          color: COLORS.navButton,
          testID: t`Cancel`,
        }],
      },
    };
  }

  _navEventListener?: EventSubscription;
  _originalDeckIds: Set<number>;

  constructor(props: Props) {
    super(props);

    this._originalDeckIds = new Set(this.props.latestDeckIds);
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'close') {
      this._close();
    }
  }

  _updateInvestigatorXp = (investigator: Card, xp: number) => {
    const { updateCampaign, campaign } = this.props;
    if (campaign) {
      const investigatorData = campaign.investigatorData[investigator.code] || {};
      const oldXp = investigatorData.availableXp || 0;
      updateCampaign(campaign.id, {
        investigatorData: {
          ...campaign.investigatorData || {},
          [investigator.code]: {
            ...investigatorData,
            availableXp: oldXp + xp,
          },
        },
      });
    }
  };

  _close = () => {
    Navigation.dismissModal(this.props.componentId);
  };

  _showDeckUpgradeDialog = (deck: Deck, investigator?: Card) => {
    const {
      componentId,
      id,
    } = this.props;
    Navigation.push<UpgradeDeckProps>(componentId, {
      component: {
        name: 'Deck.Upgrade',
        passProps: {
          id: deck.id,
          campaignId: id,
          showNewDeck: false,
        },
        options: {
          statusBar: {
            style: 'light',
          },
          topBar: {
            title: {
              text: t`Upgrade`,
              color: 'white',
            },
            subtitle: {
              text: investigator ? investigator.name : '',
              color: 'white',
            },
            background: {
              color: COLORS.faction[investigator ? investigator.factionCode() : 'neutral'].darkBackground,
            },
          },
        },
      },
    });
  };

  render() {
    const {
      latestDeckIds,
      id,
      campaign,
      componentId,
      fontScale,
      allInvestigators,
      decks,
      cards,
      investigators,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={space.marginS}>
          <Text style={typography.label}>
            { t`By upgrading a deck, you can track XP and story card upgrades as your campaign develops.\n\nPrevious versions of your deck will still be accessible.` }
          </Text>
        </View>
        <UpgradeDecksList
          componentId={componentId}
          fontScale={fontScale}
          campaignId={id}
          investigatorData={campaign.investigatorData}
          allInvestigators={allInvestigators}
          decks={flatMap(latestDeckIds, deckId => decks[deckId] || [])}
          originalDeckIds={this._originalDeckIds}
          showDeckUpgradeDialog={this._showDeckUpgradeDialog}
          updateInvestigatorXp={this._updateInvestigatorXp}
          cards={cards}
          investigators={investigators}
        />
        <BasicButton title={t`Done`} onPress={this._close} />
        <View style={styles.footer} />
      </ScrollView>
    );
  }
}

function mapStateToPropsFix(
  state: AppState,
  props: NavigationProps & UpgradeDecksProps & PlayerCardProps
): ReduxProps {
  const campaign = getCampaign(state, props.id);
  const latestDeckIds = getLatestCampaignDeckIds(state, campaign);
  const allInvestigators = getLatestCampaignInvestigators(state, props.investigators, campaign);
  return {
    campaign,
    decks: getAllDecks(state),
    latestDeckIds,
    allInvestigators,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    updateCampaign,
  }, dispatch);
}

export default withPlayerCards(
  connect<ReduxProps, ReduxActionProps, NavigationProps & UpgradeDecksProps & PlayerCardProps, AppState>(
    mapStateToPropsFix,
    mapDispatchToProps
  )(
    withDimensions(UpgradeDecksView)
  )
);

const styles = StyleSheet.create({
  container: {
    paddingTop: s,
    paddingBottom: s,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  footer: {
    height: 100,
  },
});

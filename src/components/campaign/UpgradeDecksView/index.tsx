import React from 'react';
import { forEach } from 'lodash';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import { Deck, DecksMap, SingleCampaign, ScenarioResult } from 'actions/types';
import { NavigationProps } from 'components/nav/types';
import { FACTION_DARK_GRADIENTS } from 'constants';
import Card from 'data/Card';
import { Scenario, campaignScenarios } from '../constants';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { getAllDecks, getLatestCampaignDeckIds, getCampaign, AppState } from 'reducers';
import typography from 'styles/typography';
import { iconsMap } from 'app/NavIcons';
import { COLORS } from 'styles/colors';
import UpgradeDecksList from './UpgradeDecksList';
import { UpgradeDeckProps } from 'components/deck/DeckUpgradeDialog';
import ScenarioResultRow from '../CampaignScenarioView/ScenarioResultRow';

export interface UpgradeDecksProps {
  id: number;
  scenarioResult: ScenarioResult;
}

interface ReduxProps {
  campaign?: SingleCampaign;
  decks: DecksMap;
  latestDeckIds: number[];
  scenarioByCode: { [code: string]: Scenario };
}

type Props = NavigationProps & UpgradeDecksProps & ReduxProps & DimensionsProps;

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
  _doSave!: () => void;
  _originalDeckIds: Set<number> = new Set(this.props.latestDeckIds);

  constructor(props: Props) {
    super(props);

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
              color: FACTION_DARK_GRADIENTS[investigator ? investigator.factionCode() : 'neutral'][0],
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
      scenarioResult,
      scenarioByCode,
      fontScale,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <ScenarioResultRow
            componentId={componentId}
            campaignId={id}
            index={0}
            scenarioResult={scenarioResult}
            scenarioByCode={scenarioByCode}
          />
          <Text style={typography.small}>
            { t`By upgrading a deck, you can track XP and story card upgrades as your campaign develops.\n\nPrevious versions of your deck will still be accessible.` }
          </Text>
        </View>
        <UpgradeDecksList
          componentId={componentId}
          fontScale={fontScale}
          campaignId={id}
          investigatorData={campaign.investigatorData}
          deckIds={latestDeckIds}
          originalDeckIds={this._originalDeckIds}
          showDeckUpgradeDialog={this._showDeckUpgradeDialog}
        />
        <View style={styles.button}>
          <Button title={t`Done`} onPress={this._close} />
        </View>
        <View style={styles.footer} />
      </ScrollView>
    );
  }
}

function mapStateToPropsFix(
  state: AppState,
  props: NavigationProps & UpgradeDecksProps
): ReduxProps {
  const campaign = getCampaign(state, props.id);
  const cycleScenarios = campaign ? campaignScenarios(campaign.cycleCode) : [];
  const scenarioByCode: { [code: string]: Scenario } = {};
  forEach(cycleScenarios, scenario => {
    scenarioByCode[scenario.code] = scenario;
  });
  return {
    campaign,
    decks: getAllDecks(state),
    latestDeckIds: getLatestCampaignDeckIds(state, campaign),
    scenarioByCode,
  };
}

export default connect<ReduxProps, {}, NavigationProps & UpgradeDecksProps, AppState>(
  mapStateToPropsFix
)(
  withDimensions(UpgradeDecksView)
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  footer: {
    height: 100,
  },
  header: {
    margin: 8,
  },
  button: {
    margin: 8,
  },
});

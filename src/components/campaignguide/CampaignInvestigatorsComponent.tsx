import React from 'react';
import { Alert, InteractionManager, Text, StyleSheet, View } from 'react-native';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { flatMap, forEach, map, partition } from 'lodash';
import { t } from 'ttag';

import { Campaign, InvestigatorData } from '@actions/types';
import BasicButton from '@components/core/BasicButton';
import InvestigatorCampaignRow from '@components/campaign/InvestigatorCampaignRow';
import { ProcessedCampaign } from '@data/scenario';
import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import Card from '@data/Card';
import typography from '@styles/typography';
import { s, l } from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  componentId: string;
  campaignData: CampaignGuideContextType;
  processedCampaign: ProcessedCampaign;
  fontScale: number;
  updateCampaign: (
    id: number,
    sparseCampaign: Partial<Campaign>
  ) => void;
  deleteCampaign?: () => void;
}

interface State {
  spentXp: {
    [code: string]: number;
  };
  removeMode: boolean;
}

export default class CampaignInvestigatorsComponent extends React.Component<Props, State> {
  _navEventListener: EventSubscription;

  static contextType = CampaignGuideContext;
  context!: CampaignGuideContextType;

  constructor(props: Props) {
    super(props);
    const spentXp: {
      [code: string]: number;
    } = {};
    forEach(props.campaignData.adjustedInvestigatorData, (data, code) => {
      spentXp[code] = (data && data.spentXp) || 0;
    });

    this.state = {
      spentXp,
      removeMode: false,
    };
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
    InteractionManager.runAfterInteractions(this._syncCampaignData);
  }

  _syncCampaignData = () => {
    const {
      campaignData: {
        campaignId,
        campaignGuideVersion,
        campaignGuide,
      },
      processedCampaign: {
        campaignLog,
        scenarios,
      },
      updateCampaign,
    } = this.props;
    const { spentXp } = this.state;
    const adjustedInvestigatorData: InvestigatorData = {};
    forEach(spentXp, (xp, code) => {
      adjustedInvestigatorData[code] = {
        spentXp: xp,
      };
    });
    updateCampaign(
      campaignId,
      {
        guideVersion: campaignGuideVersion === -1 ? campaignGuide.campaignVersion() : campaignGuideVersion,
        difficulty: campaignLog.campaignData.difficulty,
        investigatorData: campaignLog.campaignData.investigatorData,
        chaosBag: campaignLog.chaosBag,
        lastUpdated: new Date(),
        scenarioResults: flatMap(scenarios, scenario => {
          if (scenario.type !== 'completed') {
            return [];
          }
          const scenarioType = scenario.scenarioGuide.scenarioType();
          return {
            scenario: scenario.scenarioGuide.scenarioName(),
            scenarioCode: scenario.scenarioGuide.scenarioId(),
            resolution: campaignLog.scenarioResolution(scenario.scenarioGuide.scenarioId()) || '',
            interlude: scenarioType === 'interlude' || scenarioType === 'epilogue',
          };
        }),
        adjustedInvestigatorData,
      }
    );
  };

  _addInvestigator = () => {
    this.context.campaignState.showChooseDeck();
  };

  _toggleRemoveInvestigator = () => {
    this.setState(state => {
      return {
        removeMode: !state.removeMode,
      };
    });
  };

  _showChooseDeckForInvestigator = (investigator: Card) =>{
    this.context.campaignState.showChooseDeck(investigator);
  };

  _incXp = (code: string) => {
    this.setState({
      spentXp: {
        ...this.state.spentXp,
        [code]: (this.state.spentXp[code] || 0) + 1,
      },
    });
  };

  _decXp = (code: string) => {
    this.setState({
      spentXp: {
        ...this.state.spentXp,
        [code]: Math.max(0, (this.state.spentXp[code] || 0) - 1),
      },
    });
  };

  renderRemoveButton(aliveInvestigators: Card[]) {
    if (!aliveInvestigators.length) {
      return null;
    }

    return (
      <BasicButton
        title={t`Remove investigators`}
        color={COLORS.red}
        onPress={this._toggleRemoveInvestigator}
      />
    );
  }

  _removeInvestigatorPressed = (investigator: Card) => {
    const { latestDecks, campaignState } = this.context;
    const deck = latestDecks[investigator.code];
    if (deck) {
      Alert.alert(
        t`Remove deck from campaign`,
        t`Are you sure you want to remove this deck from the campaign?\n\nAfter removing the deck you will be able to select a different deck, but experience and story assets will only be saved as you complete new scenarios.`,
        [
          { text: t`Cancel`, style: 'cancel' },
          {
            text: t`Remove deck`,
            style: 'destructive',
            onPress: () => {
              campaignState.removeDeck(deck);
            },
          },
        ]
      );
    } else {
      const {
        processedCampaign: {
          campaignLog,
        },
      } = this.props;
      if (campaignLog.hasInvestigatorPlayedScenario(investigator)) {
        Alert.alert(
          t`Cannot remove`,
          t`Since this investigator has participated in one or more scenarios during this campaign, they cannot be removed.\n\nHowever, you can choose to have them not participate in future scenarios of this campaign.`,
          [
            { text: t`Okay` },
          ]
        );
      } else {
        campaignState.removeInvestigator(investigator);
      }
    }
  };

  render() {
    const {
      processedCampaign: {
        campaignLog,
      },
      campaignData: {
        playerCards,
      },
      fontScale,
      componentId,
      deleteCampaign,
    } = this.props;
    const {
      removeMode,
      spentXp,
    } = this.state;
    return (
      <CampaignGuideContext.Consumer>
        { ({ campaignInvestigators, campaignId, latestDecks }: CampaignGuideContextType) => {
          const [killedInvestigators, aliveInvestigators] = partition(
            campaignInvestigators,
            investigator => campaignLog.isEliminated(investigator)
          );
          return (
            <>
              { map(aliveInvestigators, investigator => (
                <InvestigatorCampaignRow
                  key={investigator.code}
                  campaignId={campaignId}
                  playerCards={playerCards}
                  spentXp={spentXp[investigator.code] || 0}
                  totalXp={campaignLog.totalXp(investigator.code)}
                  incSpentXp={this._incXp}
                  decSpentXp={this._decXp}
                  deck={latestDecks[investigator.code]}
                  componentId={componentId}
                  fontScale={fontScale}
                  investigator={investigator}
                  traumaAndCardData={campaignLog.traumaAndCardData(investigator.code)}
                  chooseDeckForInvestigator={this._showChooseDeckForInvestigator}
                  removeInvestigator={removeMode ? this._removeInvestigatorPressed : undefined}
                />
              )) }
              { !removeMode && (
                <BasicButton
                  title={t`Add Investigator`}
                  onPress={this._addInvestigator}
                />
              ) }
              { removeMode ?
                <BasicButton
                  title={t`Finished removing investigators`}
                  color={COLORS.red}
                  onPress={this._toggleRemoveInvestigator}
                /> : this.renderRemoveButton(aliveInvestigators)
              }
              { killedInvestigators.length > 0 && (
                <View style={styles.header}>
                  <Text style={[typography.bigGameFont, typography.center, typography.underline]}>
                    { t`Killed and Insane Investigators` }
                  </Text>
                </View>
              ) }
              <View style={styles.bottomBorder}>
                { map(killedInvestigators, investigator => (
                  <InvestigatorCampaignRow
                    key={investigator.code}
                    playerCards={playerCards}
                    spentXp={spentXp[investigator.code] || 0}
                    totalXp={campaignLog.totalXp(investigator.code)}
                    incSpentXp={this._incXp}
                    decSpentXp={this._decXp}
                    campaignId={campaignId}
                    deck={latestDecks[investigator.code]}
                    componentId={componentId}
                    fontScale={fontScale}
                    investigator={investigator}
                    traumaAndCardData={campaignLog.traumaAndCardData(investigator.code)}
                  />
                )) }
              </View>
              { !!deleteCampaign && !removeMode && (
                <BasicButton
                  title={t`Delete Campaign`}
                  color={COLORS.red}
                  onPress={deleteCampaign}
                />
              ) }
            </>
          );
        } }
      </CampaignGuideContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    padding: s,
    paddingTop: l,
  },
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
});

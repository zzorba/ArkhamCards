import React from 'react';
import { Button, Text, ScrollView, StyleSheet, View } from 'react-native';
import { map, partition } from 'lodash';
import { t } from 'ttag';

import CampaignGuideSummary from './CampaignGuideSummary';
import InvestigatorCampaignRow from './InvestigatorCampaignRow';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import CampaignGuide from 'data/scenario/CampaignGuide';
import CampaignGuideContext, { CampaignGuideContextType, LatestDecks } from '../../CampaignGuideContext';
import Card, { CardsMap } from 'data/Card';
import typography from 'styles/typography';

interface Props {
  componentId: string;
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;
  fontScale: number;
  latestDecks: LatestDecks;
  spentXp: {
    [code: string]: number;
  };
  incSpentXp: (code: string) => void;
  decSpentXp: (code: string) => void;
  playerCards: CardsMap;
}

export default class InvestigatorsTab extends React.Component<Props> {
  static contextType = CampaignGuideContext;
  context!: CampaignGuideContextType;

  _addInvestigator = () => {
    this.context.campaignState.showChooseDeck();
  };

  _showChooseDeckForInvestigator = (investigator: Card) =>{
    this.context.campaignState.showChooseDeck(investigator);
  };

  render() {
    const {
      campaignLog,
      campaignGuide,
      fontScale,
      componentId,
      playerCards,
      spentXp,
      incSpentXp,
      decSpentXp,
    } = this.props;
    const difficulty = campaignLog.campaignData.difficulty;
    return (
      <CampaignGuideContext.Consumer>
        { ({ campaignInvestigators, campaignId, latestDecks }: CampaignGuideContextType) => {
          const [killedInvestigators, aliveInvestigators] = partition(
            campaignInvestigators,
            investigator => campaignLog.isEliminated(investigator)
          );
          return (
            <ScrollView>
              <View style={styles.section}>
                <CampaignGuideSummary
                  difficulty={difficulty}
                  campaignGuide={campaignGuide}
                />
              </View>
              { map(aliveInvestigators, investigator => (
                <InvestigatorCampaignRow
                  key={investigator.code}
                  campaignId={campaignId}
                  playerCards={playerCards}
                  spentXp={spentXp[investigator.code] || 0}
                  incSpentXp={incSpentXp}
                  decSpentXp={decSpentXp}
                  deck={latestDecks[investigator.code]}
                  componentId={componentId}
                  campaignLog={campaignLog}
                  fontScale={fontScale}
                  investigator={investigator}
                  traumaAndCardData={campaignLog.traumaAndCardData(investigator.code)}
                  chooseDeckForInvestigator={this._showChooseDeckForInvestigator}
                />
              )) }
              <View style={styles.button}>
                <Button title={t`Add Investigator`} onPress={this._addInvestigator} />
              </View>
              { killedInvestigators.length > 0 && (
                <View style={styles.header}>
                  <Text style={[typography.bigGameFont, typography.center, typography.underline]}>
                    { t`Killed and Insane Investigators` }
                  </Text>
                </View>
              ) }
              { map(killedInvestigators, investigator => (
                <InvestigatorCampaignRow
                  key={investigator.code}
                  playerCards={playerCards}
                  spentXp={spentXp[investigator.code] || 0}
                  incSpentXp={incSpentXp}
                  decSpentXp={decSpentXp}
                  campaignId={campaignId}
                  campaignLog={campaignLog}
                  deck={latestDecks[investigator.code]}
                  componentId={componentId}
                  fontScale={fontScale}
                  investigator={investigator}
                  traumaAndCardData={campaignLog.traumaAndCardData(investigator.code)}
                />
              )) }
            </ScrollView>
          );
        } }
      </CampaignGuideContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  header: {
    padding: 8,
    paddingTop: 32,
  },
  section: {
    padding: 16,
    paddingLeft: 24,
    paddingRight: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
  },
});

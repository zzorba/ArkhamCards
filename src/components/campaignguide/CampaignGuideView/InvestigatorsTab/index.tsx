import React from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import { map, partition } from 'lodash';
import { t } from 'ttag';

import BasicButton from 'components/core/BasicButton';
import CampaignGuideSummary from './CampaignGuideSummary';
import InvestigatorCampaignRow from './InvestigatorCampaignRow';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import CampaignGuide from 'data/scenario/CampaignGuide';
import CampaignGuideContext, { CampaignGuideContextType, LatestDecks } from '../../CampaignGuideContext';
import Card, { CardsMap } from 'data/Card';
import typography from 'styles/typography';
import { s, m, l } from 'styles/space';
import { COLORS } from 'styles/colors';

interface Props {
  componentId: string;
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;
  fontScale: number;
  latestDecks: LatestDecks;
  spentXp: {
    [code: string]: number;
  };
  deleteCampaign: () => void;
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
      deleteCampaign,
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
              <View style={[styles.section, styles.bottomBorder]}>
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
              <BasicButton title={t`Add Investigator`} onPress={this._addInvestigator} />
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
              </View>
              <BasicButton
                title={t`Delete Campaign`}
                color={COLORS.red}
                onPress={deleteCampaign}
              />
            </ScrollView>
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
  section: {
    padding: m,
    paddingLeft: s + m,
    paddingRight: s + m,
  },
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CampaignCycleCode, CampaignDifficulty } from 'actions/types';
import { CAMPAIGN_COLORS, difficultyString } from 'components/campaign/constants';
import typography from 'styles/typography';
import GameHeader from 'components/campaign/GameHeader';
import BackgroundIcon from 'components/campaign/BackgroundIcon';
import CampaignGuide from 'data/scenario/CampaignGuide';

interface Props {
  campaignGuide: CampaignGuide;
  difficulty?: CampaignDifficulty;
}
export default class CampaignSummaryComponent extends React.Component<Props> {
  render() {
    const {
      campaignGuide,
      difficulty,
    } = this.props;
    const difficultyText = difficulty && difficultyString(difficulty);
    return (
      <View style={styles.row}>
        <BackgroundIcon
          style={{ top: -12 }}
          code={campaignGuide.campaignCycleCode()}
          color={CAMPAIGN_COLORS[campaignGuide.campaignCycleCode() as CampaignCycleCode]}
        />
        <View>
          <GameHeader text={campaignGuide.campaignName()} />
          { difficultyText && (
            <Text style={typography.text}>
              { difficultyText }
            </Text>
          ) }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  marginTop: {
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
  },
});

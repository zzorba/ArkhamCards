import React from 'react';
import { StyleSheet, View } from 'react-native';
import { map } from 'lodash';

import { ProcessedCampaign } from '@data/scenario';
import ScenarioButton from './ScenarioButton';
import AddSideScenarioButton from './AddSideScenarioButton';
import { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import space from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  componentId: string;
  fontScale: number;
  campaignId: number;
  processedCampaign: ProcessedCampaign;
  campaignData: CampaignGuideContextType;
  showLinkedScenario?: (
    scenarioId: string
  ) => void;
}

export default class ScenarioListTab extends React.Component<Props> {
  render() {
    const {
      fontScale,
      componentId,
      campaignId,
      processedCampaign,
      campaignData: {
        campaignGuide,
        campaignState,
      },
      showLinkedScenario,
    } = this.props;
    return (
      <View style={[space.paddingBottomL, styles.wrapper]}>
        { map(processedCampaign.scenarios, (scenario, idx) => (
          <ScenarioButton
            key={idx}
            fontScale={fontScale}
            componentId={componentId}
            scenario={scenario}
            campaignId={campaignId}
            campaignGuide={campaignGuide}
            showLinkedScenario={showLinkedScenario}
            linked={processedCampaign.campaignLog.linked}
          />
        )) }
        <AddSideScenarioButton
          componentId={componentId}
          campaignId={campaignId}
          processedCampaign={processedCampaign}
          campaignGuide={campaignGuide}
          campaignState={campaignState}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.background,
  },
});

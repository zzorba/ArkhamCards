import React, { useContext } from 'react';
import { View } from 'react-native';
import { map } from 'lodash';

import { ProcessedCampaign } from '@data/scenario';
import ScenarioButton from './ScenarioButton';
import AddSideScenarioButton from './AddSideScenarioButton';
import { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import { CampaignId } from '@actions/types';
import { ShowAlert } from '@components/deck/dialogs';

interface Props {
  componentId: string;
  campaignId: CampaignId;
  header?: React.ReactNode;
  processedCampaign: ProcessedCampaign;
  campaignData: CampaignGuideContextType;
  showLinkedScenario?: (scenarioId: string) => void;
  showAlert: ShowAlert;
}

export default function ScenarioListComponent({
  componentId,
  campaignId,
  header,
  processedCampaign,
  campaignData: {
    campaignGuide,
    campaignState,
  },
  showLinkedScenario,
  showAlert,
}: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  return (
    <View style={[space.paddingSideS, space.paddingBottomM, backgroundStyle]}>
      <RoundedFactionBlock
        faction="neutral"
        noSpace
        header={header}
        footer={
          <AddSideScenarioButton
            componentId={componentId}
            campaignId={campaignId}
            processedCampaign={processedCampaign}
            campaignGuide={campaignGuide}
            campaignState={campaignState}
            showAlert={showAlert}
          />
        }
      >
        { map(processedCampaign.scenarios, (scenario, idx) => (
          <ScenarioButton
            key={idx}
            componentId={componentId}
            scenario={scenario}
            campaignId={campaignId}
            campaignGuide={campaignGuide}
            showLinkedScenario={showLinkedScenario}
            linked={processedCampaign.campaignLog.linked}
          />
        )) }
      </RoundedFactionBlock>
    </View>
  );
}

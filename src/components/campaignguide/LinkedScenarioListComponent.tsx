import React, { useMemo } from 'react';
import { find } from 'lodash';

import { showScenario } from './nav';
import CampaignGuideSummary from './CampaignGuideSummary';
import ScenarioListComponent from './ScenarioListComponent';
import { ProcessedCampaign } from '@data/scenario';
import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import { ShowAlert } from '@components/deck/dialogs';

interface Props {
  componentId: string;
  campaignA: ProcessedCampaign;
  campaignDataA: CampaignGuideContextType;
  campaignB: ProcessedCampaign;
  campaignDataB: CampaignGuideContextType;
  showAlert: ShowAlert;
}

class CampaignLinkHelper {
  componentId: string;
  campaignA: ProcessedCampaign;
  campaignDataA: CampaignGuideContextType;
  campaignB: ProcessedCampaign;
  campaignDataB: CampaignGuideContextType;

  constructor(
    componentId: string,
    campaignA: ProcessedCampaign,
    campaignDataA: CampaignGuideContextType,
    campaignB: ProcessedCampaign,
    campaignDataB: CampaignGuideContextType
  ) {
    this.componentId = componentId;
    this.campaignA = campaignA;
    this.campaignDataA = campaignDataA;
    this.campaignB = campaignB;
    this.campaignDataB = campaignDataB;
  }

  showCampaignScenarioA = (scenarioId: string) => {
    const scenario = find(
      this.campaignA.scenarios,
      scenario => scenario.id.encodedScenarioId === scenarioId
    );
    if (scenario) {
      showScenario(
        this.componentId,
        scenario,
        this.campaignDataA.campaignId,
        this.campaignDataA.campaignState,
        this.campaignDataA.campaignGuide.campaignName(),
        this.showCampaignScenarioB
      );
    }
  };

  showCampaignScenarioB = (scenarioId: string) => {
    const scenario = find(
      this.campaignB.scenarios,
      scenario => scenario.id.encodedScenarioId === scenarioId
    );
    if (scenario) {
      showScenario(
        this.componentId,
        scenario,
        this.campaignDataB.campaignId,
        this.campaignDataB.campaignState,
        this.campaignDataB.campaignGuide.campaignName(),
        this.showCampaignScenarioA
      );
    }
  };
}

export default function LinkedScenarioListComponent({ componentId, campaignA, campaignDataA, campaignB, campaignDataB, showAlert }: Props) {
  const linkHelper = useMemo(() => {
    return new CampaignLinkHelper(componentId, campaignA, campaignDataA, campaignB, campaignDataB);
  }, [componentId, campaignA, campaignDataA, campaignB, campaignDataB]);

  return (
    <>
      <CampaignGuideContext.Provider value={campaignDataA}>
        <ScenarioListComponent
          showAlert={showAlert}
          campaignId={campaignDataA.campaignId}
          campaignData={campaignDataA}
          processedCampaign={campaignA}
          componentId={componentId}
          showLinkedScenario={linkHelper.showCampaignScenarioB}
          header={
            <CampaignGuideSummary
              difficulty={campaignA.campaignLog.campaignData.difficulty}
              campaignGuide={campaignDataA.campaignGuide}
              inverted
            />
          }
        />
      </CampaignGuideContext.Provider>
      <CampaignGuideContext.Provider value={campaignDataB}>
        <ScenarioListComponent
          showAlert={showAlert}
          campaignId={campaignDataB.campaignId}
          campaignData={campaignDataB}
          processedCampaign={campaignB}
          componentId={componentId}
          showLinkedScenario={linkHelper.showCampaignScenarioA}
          header={
            <CampaignGuideSummary
              difficulty={campaignB.campaignLog.campaignData.difficulty}
              campaignGuide={campaignDataB.campaignGuide}
              inverted
            />
          }
        />
      </CampaignGuideContext.Provider>
    </>
  );
}

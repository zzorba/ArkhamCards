import React from 'react';
import { find } from 'lodash';

import { showScenario } from './nav';
import CampaignGuideSummary from './CampaignGuideSummary';
import ScenarioListComponent from './ScenarioListComponent';
import { ProcessedCampaign } from '@data/scenario';
import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';

interface Props {
  componentId: string;
  fontScale: number;
  campaignA: ProcessedCampaign;
  campaignDataA: CampaignGuideContextType;
  campaignB: ProcessedCampaign;
  campaignDataB: CampaignGuideContextType;
}

export default class LinkedScenarioListComponent extends React.Component<Props> {
  _showCampaignScenarioA = (
    scenarioId: string
  ) => {
    const {
      componentId,
      campaignA,
      campaignDataA,
    } = this.props;
    const scenario = find(
      campaignA.scenarios,
      scenario => scenario.id.encodedScenarioId === scenarioId
    );
    if (scenario) {
      showScenario(
        componentId,
        scenario,
        campaignDataA.campaignId,
        campaignDataA.campaignState,
        campaignDataA.campaignGuide.campaignName(),
        this._showCampaignScenarioB
      );
    }
  };

  _showCampaignScenarioB = (
    scenarioId: string
  ) => {
    const {
      componentId,
      campaignB,
      campaignDataB,
    } = this.props;
    const scenario = find(
      campaignB.scenarios,
      scenario => scenario.id.encodedScenarioId === scenarioId
    );
    if (scenario) {
      showScenario(
        componentId,
        scenario,
        campaignDataB.campaignId,
        campaignDataB.campaignState,
        campaignDataB.campaignGuide.campaignName(),
        this._showCampaignScenarioA
      );
    }
  };

  render() {
    const {
      componentId,
      fontScale,
      campaignA,
      campaignDataA,
      campaignB,
      campaignDataB,
    } = this.props;
    return (
      <>
        <CampaignGuideSummary
          difficulty={campaignA.campaignLog.campaignData.difficulty}
          campaignGuide={campaignDataA.campaignGuide}
          inverted
        />
        <CampaignGuideContext.Provider value={campaignDataA}>
          <ScenarioListComponent
            campaignId={campaignDataA.campaignId}
            campaignData={campaignDataA}
            processedCampaign={campaignA}
            fontScale={fontScale}
            componentId={componentId}
            showLinkedScenario={this._showCampaignScenarioB}
          />
        </CampaignGuideContext.Provider>
        <CampaignGuideSummary
          difficulty={campaignB.campaignLog.campaignData.difficulty}
          campaignGuide={campaignDataB.campaignGuide}
          inverted
        />
        <CampaignGuideContext.Provider value={campaignDataB}>
          <ScenarioListComponent
            campaignId={campaignDataB.campaignId}
            campaignData={campaignDataB}
            processedCampaign={campaignB}
            fontScale={fontScale}
            componentId={componentId}
            showLinkedScenario={this._showCampaignScenarioA}
          />
        </CampaignGuideContext.Provider>
      </>
    );
  }
}

import { StandaloneId } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import React from 'react';

import ScenarioView from './ScenarioView';

export interface StandaloneGuideProps {
  campaignId: number;
  standaloneId: StandaloneId;
}
export default function StandaloneGuideView({ campaignId, standaloneId, componentId }: StandaloneGuideProps & NavigationProps) {
  return (
    <ScenarioView
      componentId={componentId}
      campaignId={campaignId}
      scenarioId={standaloneId.scenarioId}
      standalone
    />
  );
}
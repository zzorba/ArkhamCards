import React, { useContext } from 'react';
import { ScrollView } from 'react-native';

import { NavigationProps } from '@components/nav/types';
import CampaignGuide from '@data/scenario/CampaignGuide';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import CampaignLogComponent from './CampaignLogComponent';
import StyleContext from '@styles/StyleContext';

export interface CampaignLogProps {
  campaignId: number;
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;
}

type Props = CampaignLogProps & NavigationProps;

export default function CampaignLogView({
  campaignId,
  campaignGuide,
  campaignLog,
  componentId,
}: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  return (
    <ScrollView contentContainerStyle={backgroundStyle}>
      <CampaignLogComponent
        componentId={componentId}
        campaignId={campaignId}
        campaignGuide={campaignGuide}
        campaignLog={campaignLog}
      />
    </ScrollView>
  );
}

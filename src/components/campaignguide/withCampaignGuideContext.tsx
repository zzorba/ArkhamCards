import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import { AppState } from '@reducers';
import { campaignGuideReduxData } from '@components/campaignguide/contextHelper';
import useCampaignGuideContext from './useCampaignGuideContext';
import { useInvestigatorCards } from '@components/core/hooks';
import LoadingSpinner from '@components/core/LoadingSpinner';

export interface CampaignGuideInputProps {
  campaignId: number;
}

export interface CampaignGuideProps {
  campaignData: CampaignGuideContextType;
}

export default function withCampaignGuideContext<Props>(
  WrappedComponent: React.ComponentType<Props & CampaignGuideProps>
): React.ComponentType<Props & CampaignGuideInputProps> {
  function CampaignDataComponent(props: Props & CampaignGuideInputProps) {
    const { campaignId } = props;
    const investigators = useInvestigatorCards();
    const campaignDataSelector = useCallback((state: AppState) => {
      if (!investigators) {
        return undefined;
      }
      return campaignGuideReduxData(campaignId, investigators, state);
    }, [campaignId, investigators]);
    const campaignData = useSelector(campaignDataSelector);
    const context = useCampaignGuideContext(campaignId, campaignData);
    if (!campaignData || !context) {
      return (
        <LoadingSpinner />
      );
    }
    return (
      <CampaignGuideContext.Provider value={context}>
        <WrappedComponent
          {...props as Props}
          campaignData={context}
        />
      </CampaignGuideContext.Provider>
    );
  }
  hoistNonReactStatic(CampaignDataComponent, WrappedComponent);
  return CampaignDataComponent;
}

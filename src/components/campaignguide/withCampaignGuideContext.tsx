import React, { useCallback, useContext, useMemo } from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import { AppState } from '@reducers';
import withUniversalCampaignData, { UniversalCampaignProps } from '@components/campaignguide/withUniversalCampaignData';
import { CampaignGuideReduxData, campaignGuideReduxData, constructCampaignGuideContext } from '@components/campaignguide/contextHelper';
import StyleContext from '@styles/StyleContext';

export interface CampaignGuideInputProps {
  campaignId: number;
}

export interface CampaignGuideProps {
  campaignData: CampaignGuideContextType;
}

export default function withCampaignGuideContext<Props>(
  WrappedComponent: React.ComponentType<Props & CampaignGuideProps>
): React.ComponentType<Props & CampaignGuideInputProps> {
  function CampaignDataComponent(props: Props & CampaignGuideInputProps & UniversalCampaignProps) {
    const { campaignId, investigators } = props;
    const campaignDataSelector = useCallback((state: AppState) => {
      return campaignGuideReduxData(campaignId, investigators, state);
    }, [campaignId, investigators]);
    const campaignData = useSelector(campaignDataSelector);
    const styleContext = useContext(StyleContext);
    const context = useMemo(() => {
      return campaignData ? constructCampaignGuideContext(
        campaignData as CampaignGuideReduxData,
        props,
        styleContext
      ) : undefined;
    }, [props, styleContext, campaignData]);
    if (!campaignData || !context) {
      return (
        <Text>Unknown Campaign</Text>
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
  const result = withUniversalCampaignData<Props & CampaignGuideInputProps>(CampaignDataComponent);
  hoistNonReactStatic(result, WrappedComponent);
  return result;
}

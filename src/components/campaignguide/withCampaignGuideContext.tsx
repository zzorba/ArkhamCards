import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import {
  AppState,
} from '@reducers';
import withUniversalCampaignData, { UniversalCampaignProps } from '@components/campaignguide/withUniversalCampaignData';
import { CampaignGuideReduxData, campaignGuideReduxData, constructCampaignGuideContext } from '@components/campaignguide/contextHelper';

export interface CampaignGuideInputProps {
  campaignId: number;
}

interface ReduxProps {
  campaignData?: CampaignGuideReduxData;
}

export interface CampaignGuideProps {
  campaignData: CampaignGuideContextType;
}

export default function withCampaignGuideContext<Props>(
  WrappedComponent: React.ComponentType<Props & CampaignGuideProps>
): React.ComponentType<Props & CampaignGuideInputProps> {
  const mapStateToProps = (
    state: AppState,
    props: Props & CampaignGuideInputProps & UniversalCampaignProps
  ): ReduxProps => {
    return {
      campaignData: campaignGuideReduxData(props.campaignId, props.investigators, state),
    };
  };

  class CampaignDataComponent extends React.Component<
    Props &
    CampaignGuideInputProps &
    UniversalCampaignProps &
    ReduxProps
  > {
    render() {
      const {
        campaignData,
      } = this.props;
      if (!campaignData) {
        return (
          <Text>Unknown Campaign</Text>
        );
      }
      const context = constructCampaignGuideContext(
        campaignData as CampaignGuideReduxData,
        this.props
      );
      return (
        <CampaignGuideContext.Provider value={context}>
          <WrappedComponent
            {...this.props as Props}
            campaignData={context}
          />
        </CampaignGuideContext.Provider>
      );
    }
  }
  const result = withUniversalCampaignData<Props & CampaignGuideInputProps>(
    connect<ReduxProps, {}, Props & UniversalCampaignProps & CampaignGuideInputProps, AppState>(
      mapStateToProps
    )(
      // @ts-ignore TS2345
      CampaignDataComponent
    )
  );
  hoistNonReactStatic(result, WrappedComponent);
  return result as React.ComponentType<Props & CampaignGuideInputProps>;
}

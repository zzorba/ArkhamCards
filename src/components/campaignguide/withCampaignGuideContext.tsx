import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, Action } from 'redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import CampaignGuideContext, { CampaignGuideContextType } from './CampaignGuideContext';
import {
  startScenario,
  resetScenario,
  setScenarioCount,
  setScenarioDecision,
  setScenarioChoice,
  setScenarioSupplies,
  setScenarioChoiceList,
  undo,
} from './actions';
import { ListChoices, SupplyCounts, SingleCampaign, CampaignGuideState } from 'actions/types';
import CampaignStateHelper from 'data/scenario/CampaignStateHelper';
import { getCampaignGuide } from 'data/scenario';
import {
  AppState,
  getCampaign,
  getCampaignGuideState,
} from 'reducers';

export interface CampaignGuideInputProps {
  campaignId: number;
}

interface ReduxProps {
  campaign?: SingleCampaign;
  campaignState: CampaignGuideState;
}

interface ReduxActionProps {
  startScenario: (campaignId: number, scenarioId: string) => void;
  setScenarioDecision: (
    campaignId: number,
    stepId: string,
    value: boolean,
    scenarioId?: string
  ) => void;
  setScenarioCount: (
    campaignId: number,
    stepId: string,
    value: number,
    scenarioId?: string
  ) => void;
  setScenarioSupplies: (
    campaignId: number,
    stepId: string,
    supplyCounts: SupplyCounts,
    scenarioId?: string
  ) => void;
  setScenarioChoiceList: (
    campaignId: number,
    stepId: string,
    supplyCounts: ListChoices,
    scenarioId?: string
  ) => void;
  setScenarioChoice: (
    campaignId: number,
    stepId: string,
    choice: number,
    scenarioId?: string
  ) => void;
  resetScenario: (
    campaignId: number,
    scenarioId: string
  ) => void;
  undo: (campaignId: number) => void;
}

export default function withCampaignGuideContext<Props>(
  WrappedComponent: React.ComponentType<Props & CampaignGuideContextType>
): React.ComponentType<Props & CampaignGuideInputProps> {
  const mapStateToProps = (
    state: AppState,
    props: Props & CampaignGuideInputProps
  ): ReduxProps => {
    const campaign = getCampaign(state, props.campaignId);
    return {
      campaign,
      campaignState: getCampaignGuideState(state, props.campaignId),
    };
  };

  const mapDispatchToProps = (
    dispatch: Dispatch<Action>
  ): ReduxActionProps => {
    return bindActionCreators({
      startScenario,
      setScenarioCount,
      setScenarioDecision,
      setScenarioSupplies,
      setScenarioChoiceList,
      resetScenario,
      setScenarioChoice,
      undo,
    }, dispatch);
  };
  class CampaignDataComponent extends React.Component<
    Props &
    CampaignGuideInputProps &
    ReduxProps &
    ReduxActionProps
  > {
    _startScenario = (
      scenarioId: string
    ) => {
      const {
        startScenario,
        campaignId,
      } = this.props;
      startScenario(campaignId, scenarioId);
    };
    _setScenarioDecision = (
      stepId: string,
      value: boolean,
      scenarioId?: string
    ) => {
      const {
        setScenarioDecision,
        campaignId,
      } = this.props;
      setScenarioDecision(
        campaignId,
        stepId,
        value,
        scenarioId
      );
    };

    _setScenarioCount = (
      stepId: string,
      value: number,
      scenarioId?: string
    ) => {
      const {
        setScenarioCount,
        campaignId,
      } = this.props;
      setScenarioCount(
        campaignId,
        stepId,
        value,
        scenarioId
      );
    };

    _setSupplies = (
      stepId: string,
      supplyCounts: SupplyCounts,
      scenarioId?: string
    ) => {
      const {
        setScenarioSupplies,
        campaignId,
      } = this.props;
      setScenarioSupplies(
        campaignId,
        stepId,
        supplyCounts,
        scenarioId
      );
    };

    _setChoiceList = (
      stepId: string,
      choices: ListChoices,
      scenarioId?: string
    ) => {
      const {
        setScenarioChoiceList,
        campaignId,
      } = this.props;
      setScenarioChoiceList(
        campaignId,
        stepId,
        choices,
        scenarioId
      );
    };

    _setChoice = (
      stepId: string,
      choice: number,
      scenarioId?: string
    ) => {
      const {
        setScenarioChoice,
        campaignId,
      } = this.props;
      setScenarioChoice(
        campaignId,
        stepId,
        choice,
        scenarioId
      );
    };

    _undo = () => {
      const {
        undo,
        campaignId,
      } = this.props;
      undo(campaignId);
    };

    _resetScenario = (scenarioId: string) => {
      const {
        resetScenario,
        campaignId,
      } = this.props;
      resetScenario(campaignId, scenarioId);
    }

    render() {
      const {
        campaign,
        campaignState,
      } = this.props;
      if (campaign === undefined) {
        return <Text>Unknown Campaign</Text>;
      }
      const campaignStateHelper = new CampaignStateHelper(
        campaignState,
        {
          startScenario: this._startScenario,
          setCount: this._setScenarioCount,
          setDecision: this._setScenarioDecision,
          setSupplies: this._setSupplies,
          setChoiceList: this._setChoiceList,
          setChoice: this._setChoice,
          resetScenario: this._resetScenario,
          undo: this._undo,
        }
      );
      const campaignGuide = getCampaignGuide(campaign.cycleCode);
      if (!campaignGuide) {
        return <Text>Unknown Campaign Guide</Text>;
      }
      const context: CampaignGuideContextType = {
        // @ts-ignore TS2322
        campaign,
        campaignGuide,
        campaignState: campaignStateHelper,
      };
      return (
        <CampaignGuideContext.Provider value={context}>
          <WrappedComponent
            {...this.props as Props}
            campaign={campaign as SingleCampaign}
            campaignGuide={campaignGuide}
            campaignState={campaignStateHelper}
          />
        </CampaignGuideContext.Provider>
      );
    }
  }
  const result = connect<ReduxProps, ReduxActionProps, Props & CampaignGuideInputProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(
    // @ts-ignore TS2345
    CampaignDataComponent
  );
  hoistNonReactStatic(result, WrappedComponent);
  return result as React.ComponentType<Props & CampaignGuideInputProps>;
}

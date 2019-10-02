import React from 'react';
import { TouchableHighlight } from 'react-native';
import { Action, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { updateCampaign } from './actions';
import ChaosToken from './ChaosToken';
import { Campaign, ChaosBagResults, NEW_CHAOS_BAG_RESULTS } from '../../actions/types';
import { AppState, getCampaign } from '../../reducers';
import { ChaosTokenType } from '../../constants';

interface OwnProps {
  campaignId: number;
  id: string;
  iconKey: ChaosTokenType;
  sealed?: boolean;
  canDisable?: boolean;
}

interface ReduxProps {
  chaosBagResults: ChaosBagResults;
}

interface ReduxActionProps {
  updateCampaign: (id: number, chaosBagResults: Partial<Campaign>) => void;
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

class SealTokenButton extends React.Component<Props> {

  public static defaultProps: Partial<Props> = {
    sealed: false,
    canDisable: false,
  };

  _toggleSealToken = () => {
    const {
      campaignId,
      chaosBagResults,
      id,
      updateCampaign,
      iconKey,
      sealed,
    } = this.props;

    let newSealedTokens = [...chaosBagResults.sealedTokens];

    if (sealed) {
      newSealedTokens = newSealedTokens.filter(token => token.id !== id);
    } else {
      const token = { id: id, icon: iconKey };
      newSealedTokens.push(token);
    }

    const newChaosBagResults = {
      drawnTokens: chaosBagResults.drawnTokens,
      sealedTokens: newSealedTokens,
      totalDrawnTokens: chaosBagResults.totalDrawnTokens,
    };

    updateCampaign(campaignId, { chaosBagResults: newChaosBagResults });
  }

  render() {
    const {
      iconKey,
      sealed,
      canDisable,
    } = this.props;
    return (
      <TouchableHighlight style={sealed && canDisable && { opacity: 0.2 }} onPress={this._toggleSealToken} underlayColor="transparent">
        <ChaosToken iconKey={iconKey} small />
      </TouchableHighlight>
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: OwnProps
): ReduxProps {
  const campaign = getCampaign(state, props.campaignId);
  return {
    chaosBagResults: (campaign && campaign.chaosBagResults) || NEW_CHAOS_BAG_RESULTS,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    updateCampaign,
  } as any, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SealTokenButton);
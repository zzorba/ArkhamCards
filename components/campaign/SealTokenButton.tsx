import React from 'react';
import { TouchableOpacity } from 'react-native';
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

interface State {
  sealed: boolean;
  canDisable: boolean;
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

class SealTokenButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      sealed: props.sealed || false,
      canDisable: props.canDisable || false,
    };
  }

  _toggleSealToken = () => {
    const {
      campaignId,
      chaosBagResults,
      id,
      updateCampaign,
      iconKey,
    } = this.props;

    const {
      sealed,
    } = this.state;

    let newSealedTokens = [...chaosBagResults.sealedTokens];

    if (sealed) {
      newSealedTokens = newSealedTokens.filter(function(token) {
        return token.id !== id;
      });

      this.setState({
        sealed: false,
      });
    } else {
      const token = { id: id, icon: iconKey };
      newSealedTokens.push(token);
      this.setState({
        sealed: true,
      });
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
      canDisable,
      sealed,
    } = this.state;
    const {
      iconKey,
    } = this.props;
    return (
      <TouchableOpacity style={sealed && canDisable && { opacity: 0.2 }} onPress={this._toggleSealToken} disabled={sealed && canDisable}>
        <ChaosToken iconKey={iconKey} small />
      </TouchableOpacity>
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